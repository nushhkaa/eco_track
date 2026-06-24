/**
 * i18n.js — English/Nepali Localization Engine
 */
const translations = {
  en: {
    // Nav
    "nav_missions": "Missions",
    "nav_myschool": "My School",
    "nav_badges": "Badges",
    "nav_home": "🏠 Return to Hub",
    "footer_overview": "📈 Sync with my school (Overview)",
    "footer_sync": "🔄 Sync with School Server",

    // Home
    "home_title": "Eco-Tracks: Our School's<br>Carbon Mission!",
    "home_desc": "Join the adventure! Track your classroom's energy use, food waste, and green travel to earn badges and save the planet — one step at a time.",
    "home_btn_student": "🎒 Student Portal",
    "home_choose_path": "Choose Your Path",
    "home_choose_desc": "Start your environmental quest as a student or manage school data as an admin.",

    // Login (Student only)
    "login_student_title": "Student Login",
    "login_student_desc": "Ready for your eco-missions?",
    "login_select_class": "Select Your Class",
    "login_select_section": "Select Section",
    "login_btn_student": "Go Exploring! ✨",

    // Admin Auth
    "admin_auth_title": "Admin Authentication",
    "admin_auth_desc": "Enter the school password to access settings.",
    "login_username": "Username",
    "login_password": "Password",
    "login_btn_teacher": "Access Dashboard 📊",

    // Setup / Admin Config
    "setup_title": "School Initialization Protocol",
    "setup_subtitle": "Welcome! Please set up your school profile. Admin access uses the default password \"admin123\".",
    "setup_section_info": "1. School Information",
    "setup_district": "Region / District",
    "setup_school_name": "School Name",
    "setup_month": "Reporting Month",
    "setup_year": "Reporting Year",
    "setup_select_dist": "Select District...",
    "setup_btn_save": "💾 Initialize School Profile",

    // Admin Dashboard
    "admin_title": "Teacher's Operations Ledger",
    "admin_desc": "Log your school's environmental data to unlock new adventure missions for your students!",
    "admin_metrics_title": "School Consumption Metrics",
    "admin_metrics_desc": "Enter whole-school monthly data.",
    "admin_elec": "⚡ Electricity (kWh)",
    "admin_water": "💧 Water (Litres)",
    "admin_diesel": "⛽ Diesel/Petrol (L)",
    "admin_lpg": "🔥 LPG Cylinders",
    "admin_waste_type": "🗑️ Primary Waste Disposal",
    "admin_btn_save": "💾 Save School Parameters",
    "loading": "Loading...",

    // Student Dashboard
    "student_title_primary": "Class Data Portal",
    "student_subtitle": "Every small action adds up to a huge change. Help your class climb the leaderboard!",
    "student_btn_compile": "📊 Compile and View Footprint",
    "student_school_metrics": "School Metrics Overview",
    "student_wizard_next": "Next Step ➔",
    "student_wizard_prev": "← Previous",

    "std_step_1_title": "Step 1: Demographic Info",
    "std_step_1_sub": "Who is tracking today?",
    "std_total_students": "Total Students Present Today",
    "std_teacher_name": "Class Teacher's Name",

    "std_step_2_title": "Step 2: Commute Log",
    "std_step_2_sub": "Aggregate classroom travel data",
    "std_bus_travel": "Bus (students)",
    "std_bike_travel": "Motorbike (students)",
    "std_walk_travel": "Walking (students)",
    "std_cycle_travel": "Cycling (students)",
    "std_car_travel": "Private Car (students)",

    "std_step_3_title": "Step 3: Resource Log",
    "std_step_3_sub": "Paper & Exam consumption",
    "std_copies_new": "How many new copies (notebooks) were used this month?",
    "std_books_recycled": "Did you recycle old books/copies (to juniors or collectors)?",
    "opt_yes": "Yes, we recycled",
    "opt_no": "No, we threw them away",

    "std_step_4_title": "Step 4: Waste Path",
    "std_step_4_sub": "Disposal frequency",
    "std_waste_burn": "🔥 Open Burning",
    "std_waste_pit": "🕳️ Pit Burial",
    "std_waste_comp": "🌱 Composting",
    "std_waste_recycle": "♻️ Recycle to Collectors",
    "std_waste_muni_sep": "🚛 Municipal (Separated)",
    "std_waste_muni_mix": "🗑️ Municipal (Single Mixed)",
    "scale_never": "Never",
    "scale_rarely": "Rarely",
    "scale_sometimes": "Sometimes",
    "scale_often": "Often",
    "scale_always": "Always",

    // Analytics / Report
    "report_title": "This Month's Eco-Report Card!",
    "report_subtitle": "Check your school's progress and help our planet smile!",
    "report_summary": "Quick Summary",
    "report_breakdown": "Category Breakdown",

    // Solutions
    "sol_hero_title": "🌱 Geographically Contextual Solutions",
    "sol_hero_sub": "Mapping climate alternatives tailored directly to your school's environmental zone.",
    "sol_btn_commit": "🎯 Commit to this Plan",
    "sol_commit_success": "Mission Activated! Check your student dashboard.",
    
    // Overview
    "over_hero_title": "School-wide Emission Overview",
    "over_hero_sub": "Detailed view of all records from Grades 1 to 10.",
    "over_total_tracked": "Total Tracked School Emissions",

    // Months
    "month_jan": "January", "month_feb": "February", "month_mar": "March", "month_apr": "April",
    "month_may": "May", "month_jun": "June", "month_jul": "July", "month_aug": "August",
    "month_sep": "September", "month_oct": "October", "month_nov": "November", "month_dec": "December"
  },
  ne: {
    // Nav
    "nav_missions": "मिसनहरू",
    "nav_myschool": "मेरो विद्यालय",
    "nav_badges": "ब्याजहरू",
    "nav_home": "🏠 मुख्य पृष्ठमा फर्कनुहोस्",
    "footer_overview": "📈 मेरो विद्यालयसँग सिंक गर्नुहोस् (अवलोकन)",
    "footer_sync": "🔄 विद्यालय सर्भरसँग सिंक गर्नुहोस्",

    // Home
    "home_title": "इको-ट्र्याक: हाम्रो विद्यालयको<br>कार्बन मिसन!",
    "home_desc": "साहसिक कार्यमा सामेल हुनुहोस्! ब्याच कमाउन र पृथ्वी बचाउन आफ्नो कक्षाको ऊर्जा प्रयोग, खानाको फोहोर, र हरियो यात्रा ट्र्याक गर्नुहोस् - एक पटकमा एक कदम।",
    "home_btn_student": "🎒 विद्यार्थी पोर्टल",
    "home_choose_path": "तपाईंको बाटो छान्नुहोस्",
    "home_choose_desc": "विद्यार्थीको रूपमा आफ्नो वातावरणीय खोज सुरु गर्नुहोस् वा प्रशासकको रूपमा विद्यालयको डाटा व्यवस्थापन गर्नुहोस्।",

    // Login (Student only)
    "login_student_title": "विद्यार्थी लगइन",
    "login_student_desc": "तपाईंको इको-मिसनहरूको लागि तयार हुनुहुन्छ?",
    "login_select_class": "आफ्नो कक्षा छान्नुहोस्",
    "login_select_section": "खण्ड (Section) छान्नुहोस्",
    "login_btn_student": "अन्वेषण गरौं! ✨",

    // Admin Auth
    "admin_auth_title": "प्रशासक प्रमाणीकरण",
    "admin_auth_desc": "सेटिङहरू पहुँच गर्न विद्यालय पासवर्ड प्रविष्ट गर्नुहोस्।",
    "login_username": "प्रयोगकर्ता नाम",
    "login_password": "पासवर्ड",
    "login_btn_teacher": "ड्यासबोर्ड पहुँच गर्नुहोस् 📊",

    // Setup / Admin Config
    "setup_title": "विद्यालय प्रारम्भिकरण प्रोटोकल",
    "setup_subtitle": "स्वागत छ! कृपया आफ्नो विद्यालय प्रोफाइल सेट अप गर्नुहोस्। प्रशासक पहुँचले पूर्वनिर्धारित पासवर्ड \"admin123\" प्रयोग गर्दछ।",
    "setup_section_info": "१. विद्यालयको जानकारी",
    "setup_district": "क्षेत्र / जिल्ला",
    "setup_school_name": "विद्यालयको नाम",
    "setup_month": "रिपोर्टिङ महिना",
    "setup_year": "रिपोर्टिङ वर्ष",
    "setup_select_dist": "जिल्ला छान्नुहोस्...",
    "setup_btn_save": "💾 विद्यालय प्रोफाइल प्रारम्भ गर्नुहोस्",

    // Admin Dashboard
    "admin_title": "शिक्षक सञ्चालन खाता",
    "admin_desc": "तपाईंको विद्यार्थीहरूको लागि नयाँ साहसिक मिसनहरू अनलक गर्न तपाईंको विद्यालयको वातावरणीय डाटा लग गर्नुहोस्!",
    "admin_metrics_title": "विद्यालय खपत मेट्रिक्स",
    "admin_metrics_desc": "सम्पूर्ण-विद्यालय मासिक डाटा प्रविष्ट गर्नुहोस्।",
    "admin_elec": "⚡ बिजुली (kWh)",
    "admin_water": "💧 पानी (लिटर)",
    "admin_diesel": "⛽ डिजेल/पेट्रोल (L)",
    "admin_lpg": "🔥 एलपीजी सिलिन्डरहरू",
    "admin_waste_type": "🗑️ प्राथमिक फोहोर व्यवस्थापन",
    "admin_btn_save": "💾 विद्यालय प्यारामिटरहरू बचत गर्नुहोस्",
    "loading": "लोड हुँदैछ...",

    // Student Dashboard
    "student_title_primary": "कक्षा डाटा पोर्टल",
    "student_subtitle": "हरेक सानो कार्यले ठूलो परिवर्तन ल्याउँछ। तपाईंको कक्षालाई लिडरबोर्ड चढ्न मद्दत गर्नुहोस्!",
    "student_btn_compile": "📊 संकलन गर्नुहोस् र पदचिह्न हेर्नुहोस्",
    "student_school_metrics": "विद्यालय मेट्रिक्स अवलोकन",
    "student_wizard_next": "अर्को चरण ➔",
    "student_wizard_prev": "← अघिल्लो",

    "std_step_1_title": "चरण १: जनसांख्यिकीय जानकारी",
    "std_step_1_sub": "आज कसले ट्र्याक गर्दैछ?",
    "std_total_students": "आज उपस्थित कुल विद्यार्थीहरू",
    "std_teacher_name": "कक्षा शिक्षकको नाम",

    "std_step_2_title": "चरण २: यात्रा लग",
    "std_step_2_sub": "कक्षाकोठाको यात्रा डाटा संकलन",
    "std_bus_travel": "बस (विद्यार्थी संख्या)",
    "std_bike_travel": "मोटरसाइकल (विद्यार्थी संख्या)",
    "std_walk_travel": "हिँड्ने (विद्यार्थी संख्या)",
    "std_cycle_travel": "साइकल (विद्यार्थी संख्या)",
    "std_car_travel": "निजी कार (विद्यार्थी संख्या)",

    "std_step_3_title": "चरण ३: संसाधन लग",
    "std_step_3_sub": "कागज र परीक्षा खपत",
    "std_copies_new": "यस महिना कति नयाँ कपीहरू (नोटबुक) प्रयोग गरियो?",
    "std_books_recycled": "के तपाईंले पुराना किताब/कपीहरू पुनर्चक्रण गर्नुभयो (जुनियरहरू वा संकलकहरूलाई दिएर)?",
    "opt_yes": "हो, हामीले पुनर्चक्रण गर्यौं",
    "opt_no": "होइन, हामीले फाल्यौं",

    "std_step_4_title": "चरण ४: फोहोर मार्ग",
    "std_step_4_sub": "विर्सजन आवृत्ति",
    "std_waste_burn": "🔥 खुला जलाउने",
    "std_waste_pit": "🕳️ खाडलमा पुर्ने",
    "std_waste_comp": "🌱 मलखाद बनाउने",
    "std_waste_recycle": "♻️ संकलकहरूलाई दिने",
    "std_waste_muni_sep": "🚛 नगरपालिका (छुट्टै संकलन)",
    "std_waste_muni_mix": "🗑️ नगरपालिका (मिश्रित)",
    "scale_never": "कहिले पनि होइन",
    "scale_rarely": "विरलै",
    "scale_sometimes": "कहिलेकाहीँ",
    "scale_often": "प्राय:",
    "scale_always": "सधैं",

    // Analytics / Report
    "report_title": "यस महिनाको इको-रिपोर्ट कार्ड!",
    "report_subtitle": "आफ्नो विद्यालयको प्रगति जाँच गर्नुहोस् र हाम्रो ग्रहलाई मुस्कुराउन मद्दत गर्नुहोस्!",
    "report_summary": "द्रुत सारांश",
    "report_breakdown": "कोटी विभाजन",

    // Solutions
    "sol_hero_title": "🌱 भौगोलिक रूपमा सान्दर्भिक समाधानहरू",
    "sol_hero_sub": "तपाईंको विद्यालयको वातावरणीय क्षेत्रमा अनुकूलित जलवायु विकल्पहरू म्यापिङ गर्दै।",
    "sol_btn_commit": "🎯 यो योजनामा प्रतिबद्ध हुनुहोस्",
    "sol_commit_success": "मिसन सक्रिय गरियो! तपाईंको विद्यार्थी ड्यासबोर्ड जाँच गर्नुहोस्।",
    
    // Overview
    "over_hero_title": "विद्यालय-व्यापी उत्सर्जन अवलोकन",
    "over_hero_sub": "कक्षा १ देखि १० सम्मका सबै रेकर्डहरूको विस्तृत दृश्य।",
    "over_total_tracked": "कुल ट्र्याक गरिएको विद्यालय उत्सर्जन",

    // Months
    "month_jan": "जनवरी", "month_feb": "फेब्रुअरी", "month_mar": "मार्च", "month_apr": "अप्रिल",
    "month_may": "मे", "month_jun": "जुन", "month_jul": "जुलाई", "month_aug": "अगस्ट",
    "month_sep": "सेप्टेम्बर", "month_oct": "अक्टोबर", "month_nov": "नोभेम्बर", "month_dec": "डिसेम्बर"
  }
};
class I18n {
  static init() {
    this.currentLang = StorageManager.getLanguage();
    this.applyTranslations();
    this.injectToggleButton();
    this.attachResetListener();
  }

  static attachResetListener() {
    const resetBtn = document.getElementById('btn-reset-data');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm(this.currentLang === 'ne' ? 'तपाईं पक्का सबै डाटा रिसेट गर्न चाहनुहुन्छ? यो पूर्ववत गर्न सकिँदैन।' : 'Are you sure you want to completely reset all school data? This cannot be undone.')) {
          localStorage.clear();
          sessionStorage.clear();
          window.location.replace('index.html');
        }
      });
    }
  }

  static toggleLang() {
    this.currentLang = this.currentLang === 'en' ? 'ne' : 'en';
    StorageManager.setLanguage(this.currentLang);
    this.applyTranslations();
    const btn = document.getElementById('lang-toggle-btn');
    if (btn) btn.innerText = this.currentLang === 'en' ? 'नेपाली' : 'ENG';
  }

  static applyTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    const dict = translations[this.currentLang];
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        if (el.tagName === 'INPUT' && el.getAttribute('placeholder')) {
          el.setAttribute('placeholder', dict[key]);
        } else {
          el.innerHTML = dict[key];
        }
      }
    });

    if (this.currentLang === 'ne') {
      document.body.style.fontFamily = "'Noto Sans Devanagari', 'Nunito', sans-serif";
    } else {
      document.body.style.fontFamily = "'Nunito', sans-serif";
    }
  }

  static injectToggleButton() {
    const navLinks = document.querySelector('.nav__links');
    if (navLinks && !document.getElementById('lang-toggle-btn')) {
      const li = document.createElement('li');
      li.style.marginLeft = '16px';
      const btn = document.createElement('button');
      btn.id = 'lang-toggle-btn';
      btn.className = 'btn btn-outline btn-sm';
      btn.innerText = this.currentLang === 'en' ? 'नेपाली' : 'ENG';
      btn.onclick = () => this.toggleLang();
      li.appendChild(btn);
      navLinks.appendChild(li);
    }
  }

  static t(key) {
    return translations[this.currentLang][key] || key;
  }
}
