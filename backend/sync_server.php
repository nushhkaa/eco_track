<?php
/**
 * sync_server.php — Eco-Tracks Nepal backend
 * Handles two request types:
 *   POST  {action:"sync", ...}    → store submission data
 *   GET   ?action=nearby&lat&lon  → return nearby school summaries
 *
 * Deploy to cPanel: upload backend/ to public_html/ecotracks/
 * Then set Admin → Sync Server URL: https://yourdomain.com/ecotracks/sync_server.php
 */

require_once __DIR__ . '/db_config.php';

// ─── CORS — allow all origins (school LANs & file:// ───────────────────────
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ─── DB connection ─────────────────────────────────────────────────────────
try {
    $dsn = sprintf('mysql:host=%s;dbname=%s;charset=%s', DB_HOST, DB_NAME, DB_CHARSET);
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    json_error('Database connection failed: ' . $e->getMessage(), 500);
}

// ─── Route ─────────────────────────────────────────────────────────────────
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

if ($method === 'POST') {
    $body = file_get_contents('php://input');
    $data = json_decode($body, true);

    // Legacy FormData / CSV upload (action=sync or no action key in form)
    if (!$data && !empty($_FILES['csvFile'])) {
        handle_csv_upload($pdo);
        exit;
    }

    $action = $data['action'] ?? 'sync';
    if ($action === 'sync') {
        handle_json_sync($pdo, $data);
    } else {
        json_error('Unknown action', 400);
    }
} elseif ($method === 'GET') {
    if ($action === 'nearby') {
        handle_nearby($pdo);
    } else {
        // Health-check
        json_ok(['status' => 'ok', 'app' => 'Eco-Tracks Nepal sync server']);
    }
} else {
    json_error('Method not allowed', 405);
}

// ─── Handler: JSON sync (from flushSyncQueue) ──────────────────────────────
function handle_json_sync(PDO $pdo, array $data): void {
    $school = trim($data['schoolName'] ?? 'Unknown');
    if ($school === '') { json_error('schoolName required', 422); }

    $district = strtolower(trim($data['district'] ?? ''));
    $region   = $data['region']      ?? '';
    $grade    = $data['grade']       ?? '';
    $month    = $data['reportMonth'] ?? '';
    $year     = (int)($data['reportYear'] ?? date('Y'));
    $payload  = $data['payload']     ?? [];

    $co2 = extract_co2($payload);

    $stmt = $pdo->prepare('
        INSERT INTO submissions
            (school_name, district, region, grade, report_month, report_year,
             total_co2, energy_co2, commute_co2, waste_co2, water_co2, paper_co2, raw_json)
        VALUES
            (:school, :district, :region, :grade, :month, :year,
             :total, :energy, :commute, :waste, :water, :paper, :raw)
    ');
    $stmt->execute([
        ':school'  => $school,
        ':district'=> $district,
        ':region'  => $region,
        ':grade'   => $grade,
        ':month'   => $month,
        ':year'    => $year ?: null,
        ':total'   => $co2['total'],
        ':energy'  => $co2['energy'],
        ':commute' => $co2['commute'],
        ':waste'   => $co2['waste'],
        ':water'   => $co2['water'],
        ':paper'   => $co2['paper'],
        ':raw'     => json_encode($payload),
    ]);

    // Sync any badge data if included
    if (!empty($data['badges']) && is_array($data['badges'])) {
        sync_badges($pdo, $school, $district, $grade, $data['badges']);
    }

    json_ok(['message' => 'Synced successfully', 'id' => $pdo->lastInsertId()]);
}

// ─── Handler: legacy CSV FormData upload ──────────────────────────────────
function handle_csv_upload(PDO $pdo): void {
    $school    = trim($_POST['schoolName'] ?? 'Unknown');
    $monthYear = trim($_POST['monthYear']  ?? '');
    $csvFile   = $_FILES['csvFile']['tmp_name'] ?? '';

    if (!$csvFile || !is_readable($csvFile)) {
        json_error('No CSV file received', 422);
    }

    $stmt = $pdo->prepare('
        INSERT INTO submissions (school_name, report_month, raw_json)
        VALUES (:school, :month, :raw)
    ');
    $stmt->execute([
        ':school' => $school,
        ':month'  => $monthYear,
        ':raw'    => file_get_contents($csvFile),
    ]);

    json_ok(['message' => 'CSV received', 'id' => $pdo->lastInsertId()]);
}

// ─── Handler: GET nearby schools ──────────────────────────────────────────
function handle_nearby(PDO $pdo): void {
    $lat    = (float)($_GET['lat']    ?? 28.0);
    $lon    = (float)($_GET['lon']    ?? 84.0);
    $radius = (float)($_GET['radius'] ?? 150);   // km

    // Validate inputs
    if ($lat < 26.0 || $lat > 30.5 || $lon < 79.5 || $lon > 88.2) {
        json_error('Coordinates out of Nepal bounds', 422);
    }
    $radius = min(max($radius, 10), 500);

    // Get the latest submission per school with their badges
    $sql = '
        SELECT
            s.school_name,
            s.district,
            s.region,
            s.grade,
            s.total_co2,
            GROUP_CONCAT(DISTINCT sb.badge_id) AS badges
        FROM submissions s
        LEFT JOIN school_badges sb ON sb.school_name = s.school_name
        INNER JOIN (
            SELECT school_name, MAX(id) AS max_id
            FROM submissions
            GROUP BY school_name
        ) latest ON latest.school_name = s.school_name AND latest.max_id = s.id
        GROUP BY s.id, s.school_name, s.district, s.region, s.grade, s.total_co2
        ORDER BY s.created_at DESC
        LIMIT 200
    ';
    $rows = $pdo->query($sql)->fetchAll();

    $coords = DISTRICT_COORDS;
    $schools = [];

    foreach ($rows as $row) {
        $dist = $row['district'];
        $schoolCoords = $coords[$dist] ?? null;
        if (!$schoolCoords) continue;   // skip if district unknown

        $km = haversine($lat, $lon, $schoolCoords[0], $schoolCoords[1]);
        if ($km > $radius) continue;

        $schools[] = [
            'school_name'  => $row['school_name'],
            'district'     => $row['district'],
            'region'       => $row['region'],
            'grade_letter' => grade_letter((float)$row['total_co2']),
            'total_co2'    => (float)$row['total_co2'],
            'badges'       => $row['badges'] ?? '',
            'distance_km'  => round($km, 1),
        ];
    }

    // Sort closest first
    usort($schools, fn($a, $b) => $a['distance_km'] <=> $b['distance_km']);

    json_ok(['schools' => array_slice($schools, 0, 50), 'total' => count($schools)]);
}

// ─── Helpers ───────────────────────────────────────────────────────────────
function sync_badges(PDO $pdo, string $school, string $district, string $grade, array $badges): void {
    $stmt = $pdo->prepare('
        INSERT IGNORE INTO school_badges (school_name, district, badge_id, grade)
        VALUES (:school, :district, :badge, :grade)
    ');
    foreach ($badges as $badgeId) {
        $stmt->execute([
            ':school'   => $school,
            ':district' => $district,
            ':badge'    => $badgeId,
            ':grade'    => $grade,
        ]);
    }
}

function extract_co2(array $payload): array {
    $get = fn($key) => (float)($payload[$key]['co2'] ?? 0);
    $total = $get('energy') + $get('commute') + $get('waste') + $get('water') + $get('paper');
    return [
        'total'   => round($total, 4),
        'energy'  => round($get('energy'),  4),
        'commute' => round($get('commute'), 4),
        'waste'   => round($get('waste'),   4),
        'water'   => round($get('water'),   4),
        'paper'   => round($get('paper'),   4),
    ];
}

function grade_letter(float $co2): string {
    if ($co2 <= 30)  return 'A+';
    if ($co2 <= 60)  return 'A';
    if ($co2 <= 100) return 'B';
    if ($co2 <= 150) return 'C';
    if ($co2 <= 200) return 'D';
    return 'E';
}

function haversine(float $lat1, float $lon1, float $lat2, float $lon2): float {
    $R  = 6371;
    $dL = deg2rad($lat2 - $lat1);
    $dG = deg2rad($lon2 - $lon1);
    $a  = sin($dL/2) ** 2 + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($dG/2) ** 2;
    return $R * 2 * atan2(sqrt($a), sqrt(1 - $a));
}

function json_ok(array $data): void {
    echo json_encode(['success' => true] + $data, JSON_UNESCAPED_UNICODE);
    exit;
}

function json_error(string $msg, int $code = 400): void {
    http_response_code($code);
    echo json_encode(['success' => false, 'message' => $msg]);
    exit;
}
