$Server = "bisup"
$RemoteDir = "~/ecotrack.santoshray.com.np"
$ArchiveName = "deploy_app.tar.gz"

Write-Host "Starting deployment to $Server : $RemoteDir" -ForegroundColor Cyan

# 1. Archive the files, excluding node_modules and .git
Write-Host "1. Archiving files locally..." -ForegroundColor Yellow
tar.exe -czvf $ArchiveName --exclude=".git" --exclude="node_modules" --exclude="deploy.sh" --exclude="deploy.ps1" --exclude=$ArchiveName .

if (-not (Test-Path $ArchiveName)) {
    Write-Host "Error: Archive creation failed!" -ForegroundColor Red
    exit 1
}

# 2. Upload the archive using scp
Write-Host "2. Uploading archive to server..." -ForegroundColor Yellow
scp $ArchiveName "${Server}:${RemoteDir}/"

# 3. Extract the archive on the remote server and clean up
Write-Host "3. Extracting files on the server..." -ForegroundColor Yellow
ssh $Server "cd $RemoteDir && tar -xzvf $ArchiveName && rm $ArchiveName"

# 4. Clean up locally
Write-Host "4. Cleaning up local archive..." -ForegroundColor Yellow
Remove-Item -Force $ArchiveName

Write-Host "Deployment complete! 🚀" -ForegroundColor Green
