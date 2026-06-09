# Eco-Tracks Nepal: Empowering Classrooms to Fight Climate Change 🌿

## The Problem: The Climate Disconnect
Global climate tracking tools are almost entirely built for Western infrastructure. They ask users about their central heating systems, personal car mileage, and natural gas grid-mix ratios. 

But what happens when you bring these tools into a classroom in a developing nation like Nepal? The reality of their emissions looks completely different: open-air plastic burning, off-grid firewood cookstoves, anaerobic pit burials, and rugged mountainous foot commutes. 

When schools try to teach climate responsibility, standard tools don't reflect the students' reality. You can't ask a student in a remote Himalayan village about their Uber rides or HVAC usage. The result is a total disconnect, leading to climate apathy. If we want the next generation to be eco-warriors, they need tools that understand their world.

## The Solution
**Eco-Tracks Nepal** is a hyper-localized, offline-first Carbon Footprint Calculator designed specifically for the unique topographical zones of Nepal. 

It bridges the gap between global climate science and local realities. We gamify the experience for students to track their *actual* emission sources: from how many virgin notebooks they consume, to how often they burn waste, to their walking or micro-bus commutes.

It operates on a dual-portal system:
1. **The Teacher's Ledger:** Admins set school-wide baselines (like Municipal Waste collection availability, electricity grids, and diesel generators).
2. **The Student Portal:** Students form classroom teams to log their localized data in a beautiful, interactive wizard to earn "Eco-Warrior" status and unlock actionable climate missions.

## Where We Stand Out

*   **Topographical Adaptability:** We dynamically adapt the UI and mitigation strategies based on the school's exact geographic region (Mountain, Hilly, or Terai). A school freezing in the Himalayas receives completely different climate targets than a school in the sweltering Terai plains.
*   **Micro-Localized Emission Factors:** Unlike generic global APIs, our engine calculates CO₂e using localized variables—such as distinguishing between "Anaerobic Pit Burial" versus "Open-Air Plastic Burning," and factoring in high-occupancy bus travel versus zero-emission mountainous walking routes.
*   **Action-Oriented & Gamified:** We don't just spit out a scary carbon number. We provide a beautiful Analytics Dashboard grading the footprint (A+ to E) and automatically generate customized "Eco-Missions" for students to commit to for the month.
*   **Offline-First & Bilingual:** Fully functional entirely offline, recognizing that rural schools often have intermittent internet access. The entire application is also fully translated into both English and Nepali at the toggle of a button.

---

## Technical Specifications

Eco-Tracks Nepal was engineered to be lightweight, incredibly fast, and independent of complex server infrastructure to ensure maximum accessibility in low-bandwidth environments.

*   **Core Architecture:** Client-side Single Page Application (SPA) utilizing Vanilla JavaScript (ES6 Modules), CSS3 (with custom variables for theming), and semantic HTML5. No heavy frameworks (like React or Angular) were used, ensuring zero build-step deployment.
*   **State Management & Storage:** The `StorageManager` module leverages Browser `LocalStorage` for persistent offline data retention. It caches historical session logs, user preferences, and administrative configurations without requiring a cloud backend database.
*   **Calculator Engine:** A modular, dynamically-loaded rules engine (`calculator_engine.js`) that imports emission multipliers from a highly structured, scalable JSON taxonomy (`emission_factors.json`).
*   **Geographic Logic Matrix:** An intelligent mapping system (`geographic_matrix.json`) tying 70+ Nepalese districts to specific climate challenges, which feeds into our adaptive `solutions.js` matrix to generate custom UI outcomes.
*   **Real-time I18n Engine:** A proprietary, lightweight internationalization engine that recursively scans the DOM for `data-i18n` attributes, seamlessly swapping English and Nepali text strings without page reloads.
