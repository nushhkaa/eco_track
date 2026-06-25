Eco-Tracks Nepal Repository Analysis
This document provides a comprehensive analysis of the Eco-Tracks Nepal project, outlining its features


🌟 Core Features
Offline-First Carbon Tracker: An entirely frontend-driven application relying on LocalStorage, capable of functioning seamlessly in remote Nepali schools with limited connectivity and sync to a server functionality, which syncs the local data to server on connectivity, so the app runs flawlessly offline.

Hyper-Local Carbon Engine: Unlike generic trackers, it uses localized variables from 77 Nepali districts (categorized into Mountain, Hilly, and Terai regions) adjusting emission math and baseline assumptions accordingly.


Gamified Student Portal: A wizard-based form where classroom groups report their commute, paper use, and waste management to calculate their climate score.


Teacher/Admin Dashboard: A ledger for logging school-wide utility usage (electricity, diesel, piped water, etc.) to serve as baseline limits for the student portal.


Bilingual Interface: Built-in support for switching between English and Nepali languages using a custom i18n.js module.
Adaptive Climate Solutions: Actionable geographic solutions derived dynamically based on a school's designated ecological zone and its highest emission hotspot.


Grading & Achievements: Converts abstract carbon numbers into readable grades (A+ to E) and visualizes the equivalent number of "trees" needed to offset emissions.
(needs adjustments)



Data Export & Sync: Capability to generate and download reports in CSV format and sync all local data to a remote server.




what has been done

admin login, sets upp school basic details for base footprint of students

setting classes, loggin class footprints via questions.

shows basic reports, pain points, and solutions to reduce footprint.


what needs to be done

add more questions and generate solutions such that they triiger behavioral changes in students.

more better reports, and solutions, better ui.

create a goal, and track its progress, how far we are along, set goals like reduce footprint by 10% in a month. and the app should show things to follow to achieve that.( show suggestions and their impact on footprint reduction)






