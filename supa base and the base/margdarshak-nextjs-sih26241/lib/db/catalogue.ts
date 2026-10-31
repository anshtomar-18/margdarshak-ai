export type VerificationStatus = 'verified' | 'estimate' | 'illustrative' | 'unavailable';

export interface SourceRecord {
  id: string;
  publisher: string;
  title: string;
  publicationDate: string;
  referenceUrl: string;
  coverage: string;
  lastChecked: string;
  limitationsEn: string;
  limitationsHi: string;
  verificationStatus: VerificationStatus;
}

export interface PathwayStep {
  nsqfLevel: number;
  qualificationEn: string;
  qualificationHi: string;
  roleEn: string;
  roleHi: string;
  durationEn: string;
  durationHi: string;
  optionsEn: string;
  optionsHi: string;
}

export interface TradeRecord {
  id: string;
  slug: string;
  nameEn: string;
  nameHi: string;
  category: string;
  nsqfLevel: number;
  durationMonths: number;
  eligibilityEn: string;
  eligibilityHi: string;
  regions: string[];
  earningsMinInr: number | null;
  earningsMaxInr: number | null;
  placementRatePct: number | null;
  trainingCostInr: number | null;
  reportingPeriod: string;
  verifiedAt: string;
  isStale: boolean;
  isIllustrative: boolean;
  evidenceStatus: VerificationStatus;
  sourceId: string;
  jobRolesEn: string[];
  jobRolesHi: string[];
  limitationsEn: string;
  limitationsHi: string;
  pathways: PathwayStep[];
}

export const SOURCES: SourceRecord[] = [
  {
    id: 'SRC-NCVET-NSQF',
    publisher: 'NCVET & MSDE',
    title: 'National Skills Qualifications Framework (NSQF) Qualification Register',
    publicationDate: '2025-11-15',
    referenceUrl: 'https://ncvet.gov.in',
    coverage: 'National (All States & UTs)',
    lastChecked: '2026-10-15',
    limitationsEn: 'Qualification levels and progression pathways reflect NSQF descriptors; institute availability varies by district.',
    limitationsHi: 'योग्यता स्तर और प्रगति पथ NSQF संरचना को दर्शाते हैं; संस्थानों की उपलब्धता जिले के अनुसार भिन्न होती है।',
    verificationStatus: 'verified',
  },
  {
    id: 'SRC-DGT-ITI',
    publisher: 'Directorate General of Training (DGT)',
    title: 'Craftsmen Training Scheme (CTS) Syllabus & NAPS Apprenticeship Directives',
    publicationDate: '2025-07-20',
    referenceUrl: 'https://dgt.gov.in',
    coverage: 'National ITI Network',
    lastChecked: '2026-10-10',
    limitationsEn: 'Covers course duration, eligibility, and NAPS apprenticeship structure; stipends depend on state minimum wage notifications.',
    limitationsHi: 'कोर्स अवधि, पात्रता और NAPS अप्रेंटिसशिप शामिल है; स्टाइपेंड राज्य के न्यूनतम वेतन नियमों पर निर्भर करता है।',
    verificationStatus: 'verified',
  },
  {
    id: 'SRC-PMKVY-EST',
    publisher: 'MSDE / PMKVY 4.0 Monitoring Sample',
    title: 'Regional Training Centre Placement & Stipend Tracking Summary',
    publicationDate: '2025-12-10',
    referenceUrl: 'https://pmkvyofficial.org',
    coverage: 'Selected PMKVY 4.0 Clusters',
    lastChecked: '2026-09-30',
    limitationsEn: '6-month post-certification centre tracking; informal & self-employed rural earnings are underrepresented.',
    limitationsHi: 'प्रमाणन के 6 महीने बाद की ट्रैकिंग; ग्रामीण स्व-रोजगार आय कम दर्ज है।',
    verificationStatus: 'estimate',
  },
  {
    id: 'SRC-NSDC-DEMO',
    publisher: 'NSDC / Skill India Demonstration Catalogue',
    title: 'Illustrative Sector Skill Council Outcome Dataset for SIH26241 Evaluation',
    publicationDate: '2026-08-01',
    referenceUrl: 'https://skillindia.gov.in',
    coverage: 'Multi-State Sample (North, West, South, East, Central)',
    lastChecked: '2026-10-20',
    limitationsEn: 'Demonstration figures for SIH26241 evaluation. Do not treat as official national census guarantees.',
    limitationsHi: 'SIH26241 मूल्यांकन के लिए प्रदर्शन आंकड़े। इन्हें राष्ट्रीय गारंटी न मानें।',
    verificationStatus: 'illustrative',
  },
];

export const TRADES: TradeRecord[] = [
  {
    id: 'TRD-ELEC',
    slug: 'electrician-domestic-industrial',
    nameEn: 'Electrician (Domestic & Industrial)',
    nameHi: 'इलेक्ट्रीशियन (घरेलू और औद्योगिक)',
    category: 'Electrical & Electronics',
    nsqfLevel: 4,
    durationMonths: 24,
    eligibilityEn: 'Class 10 Pass (Science & Maths)',
    eligibilityHi: '10वीं पास (विज्ञान और गणित)',
    regions: ['North', 'West', 'South', 'East', 'Central'],
    earningsMinInr: 14000,
    earningsMaxInr: 22000,
    placementRatePct: 68,
    trainingCostInr: 4500,
    reportingPeriod: 'FY 2025-26 Sample',
    verifiedAt: '2026-08-01',
    isStale: false,
    isIllustrative: true,
    evidenceStatus: 'illustrative',
    sourceId: 'SRC-NSDC-DEMO',
    jobRolesEn: ['Assistant Electrician', 'Industrial Maintenance Technician', 'Self-Employed Wireman'],
    jobRolesHi: ['सहायक इलेक्ट्रीशियन', 'औद्योगिक मेंटेनेंस तकनीशियन', 'स्व-रोजगार वायरमैन'],
    limitationsEn: 'Illustrative starting range across urban/industrial clusters; self-employed contractor income varies seasonally.',
    limitationsHi: 'शहरी/औद्योगिक क्लस्टरों में प्रदर्शन शुरुआती रेंज; स्व-रोजगार आय मौसम के अनुसार बदलती है।',
    pathways: [
      { nsqfLevel: 3, qualificationEn: 'Assistant Wireman Certificate', qualificationHi: 'सहायक वायरमैन प्रमाणपत्र', roleEn: 'Helper / Trainee Wireman', roleHi: 'सहायक / ट्रेनी वायरमैन', durationEn: '6 Months', durationHi: '6 महीने', optionsEn: 'Entry via PMKVY short-term training', optionsHi: 'PMKVY अल्पकालिक प्रशिक्षण से प्रवेश' },
      { nsqfLevel: 4, qualificationEn: 'ITI CTS Electrician', qualificationHi: 'ITI CTS इलेक्ट्रीशियन', roleEn: 'Licensed Domestic/Industrial Electrician', roleHi: 'लाइसेंस प्राप्त इलेक्ट्रीशियन', durationEn: '24 Months', durationHi: '24 महीने', optionsEn: 'NAPS Apprenticeship or lateral Polytechnic entry', optionsHi: 'NAPS अप्रेंटिसशिप या पॉलिटेक्निक लेटरल एंट्री' },
      { nsqfLevel: 5, qualificationEn: 'CITS / Senior Electrical Supervisor', qualificationHi: 'CITS / सीनियर इलेक्ट्रिकल सुपरवाइजर', roleEn: 'Shopfloor Electrical Supervisor', roleHi: 'इलेक्ट्रिकल सुपरवाइजर', durationEn: '12 Months + Experience', durationHi: '12 महीने + अनुभव', optionsEn: 'Craft Instructor (CITS) or Polytechnic Diploma', optionsHi: 'प्रशिक्षक (CITS) या डिप्लोमा' },
      { nsqfLevel: 6, qualificationEn: 'Diploma in Electrical Engineering (Lateral)', qualificationHi: 'इलेक्ट्रिकल इंजीनियरिंग डिप्लोमा (लेटरल)', roleEn: 'Junior Engineer / Contractor', roleHi: 'जूनियर इंजीनियर / ठेकेदार', durationEn: '24 Months', durationHi: '24 महीने', optionsEn: 'Eligible for B.Tech lateral entry or supervisory licensing', optionsHi: 'B.Tech लेटरल एंट्री या सुपरवाइजर लाइसेंस' }
    ]
  },
  {
    id: 'TRD-SOLAR',
    slug: 'solar-pv-installer-suryamitra',
    nameEn: 'Solar PV Installer (Suryamitra)',
    nameHi: 'सोलर पीवी इंस्टॉलर (सूर्यमित्र)',
    category: 'Green Jobs & Renewable Energy',
    nsqfLevel: 4,
    durationMonths: 6,
    eligibilityEn: 'Class 10 Pass + ITI/Diploma preferred',
    eligibilityHi: '10वीं पास + ITI/डिप्लोमा को प्राथमिकता',
    regions: ['North', 'West', 'South', 'Central'],
    earningsMinInr: 13500,
    earningsMaxInr: 20000,
    placementRatePct: 64,
    trainingCostInr: 0,
    reportingPeriod: 'FY 2025-26 Sample',
    verifiedAt: '2026-07-15',
    isStale: false,
    isIllustrative: true,
    evidenceStatus: 'estimate',
    sourceId: 'SRC-PMKVY-EST',
    jobRolesEn: ['Rooftop Solar Technician', 'O&M Field Associate', 'Solar Site Surveyor'],
    jobRolesHi: ['रूफटॉप सोलर तकनीशियन', 'O&M फील्ड एसोसिएट', 'सोलर साइट सर्वेयर'],
    limitationsEn: 'Outdoor fieldwork & rooftop safety compliance required; demand peaks during dry installation seasons.',
    limitationsHi: 'आउटडोर फील्डवर्क और छत पर सुरक्षा आवश्यक; सूखे मौसम में मांग अधिक होती है।',
    pathways: [
      { nsqfLevel: 3, qualificationEn: 'Solar Helper Certificate', qualificationHi: 'सोलर हेल्पर प्रमाणपत्र', roleEn: 'Module Mounting Assistant', roleHi: 'मॉड्यूल माउंटिंग सहायक', durationEn: '3 Months', durationHi: '3 महीने', optionsEn: 'Entry-level rooftop installation support', optionsHi: 'शुरुआती रूफटॉप इंस्टॉलेशन सहायता' },
      { nsqfLevel: 4, qualificationEn: 'Suryamitra Solar PV Technician', qualificationHi: 'सूर्यमित्र सोलर पीवी तकनीशियन', roleEn: 'Solar PV Installer', roleHi: 'सोलर पीवी इंस्टॉलर', durationEn: '6 Months', durationHi: '6 महीने', optionsEn: 'EPC company technician or PM Surya Ghar vendor partner', optionsHi: 'EPC तकनीशियन या पीएम सूर्य घर वेंडर सहयोगी' },
      { nsqfLevel: 5, qualificationEn: 'Solar Plant O&M Supervisor', qualificationHi: 'सोलर प्लांट O&M सुपरवाइजर', roleEn: 'Site Commissioning Lead', roleHi: 'साइट कमीशनिंग लीड', durationEn: '12 Months Exp', durationHi: '12 महीने का अनुभव', optionsEn: 'Grid-scale plant supervision', optionsHi: 'ग्रिड-स्केल प्लांट पर्यवेक्षण' }
    ]
  },
  {
    id: 'TRD-CNC',
    slug: 'cnc-operator-machining-technician',
    nameEn: 'CNC Operator & Machining Technician',
    nameHi: 'सीएनसी (CNC) ऑपरेटर और मशीनिंग तकनीशियन',
    category: 'Capital Goods & Manufacturing',
    nsqfLevel: 4,
    durationMonths: 12,
    eligibilityEn: 'Class 10 Pass (Maths & Science)',
    eligibilityHi: '10वीं पास (गणित और विज्ञान)',
    regions: ['West', 'South', 'North'],
    earningsMinInr: 15000,
    earningsMaxInr: 24000,
    placementRatePct: 72,
    trainingCostInr: 3500,
    reportingPeriod: 'FY 2025-26 Sample',
    verifiedAt: '2026-08-01',
    isStale: false,
    isIllustrative: true,
    evidenceStatus: 'illustrative',
    sourceId: 'SRC-NSDC-DEMO',
    jobRolesEn: ['CNC Turning Operator', 'Vertical Machining Centre (VMC) Setter', 'Quality Inspection Assistant'],
    jobRolesHi: ['सीएनसी टर्निंग ऑपरेटर', 'वीएमसी (VMC) सेटर', 'क्वालिटी इंस्पेक्शन सहायक'],
    limitationsEn: 'Concentrated in industrial auto/manufacturing hubs (Pune, Chennai, Gurugram, Rajkot); shift work is common.',
    limitationsHi: 'औद्योगिक ऑटो/मैन्युफैक्चरिंग हब (पुणे, चेन्नई, गुरुग्राम, राजकोट) में केंद्रित; शिफ्ट में काम आम है।',
    pathways: [
      { nsqfLevel: 3, qualificationEn: 'Conventional Lathe Operator', qualificationHi: 'पारंपरिक लेथ ऑपरेटर', roleEn: 'Machine Shop Helper', roleHi: 'मशीन शॉप हेल्पर', durationEn: '6 Months', durationHi: '6 महीने', optionsEn: 'Basic metal cutting & micrometer reading', optionsHi: 'बेसिक मेटल कटिंग और माइक्रोमीटर रीडिंग' },
      { nsqfLevel: 4, qualificationEn: 'CNC Operator Turning/Milling', qualificationHi: 'सीएनसी ऑपरेटर टर्निंग/मिलिंग', roleEn: 'CNC Machine Operator', roleHi: 'सीएनसी मशीन ऑपरेटर', durationEn: '12 Months', durationHi: '12 महीने', optionsEn: 'NAPS Apprenticeship in MSMEs or Tier-1 auto suppliers', optionsHi: 'MSME या ऑटो सप्लायर में अप्रेंटिसशिप' },
      { nsqfLevel: 5, qualificationEn: 'CNC Programmer & CAD/CAM Technician', qualificationHi: 'सीएनसी प्रोग्रामर और CAD/CAM तकनीशियन', roleEn: 'CNC Setter & G-Code Programmer', roleHi: 'सीएनसी सेटर और प्रोग्रामर', durationEn: '18 Months', durationHi: '18 महीने', optionsEn: 'Progression to Tool Room Supervisor or Mechanical Diploma', optionsHi: 'टूल रूम सुपरवाइजर या मैकेनिकल डिप्लोमा' }
    ]
  },
  {
    id: 'TRD-HEALTH',
    slug: 'general-duty-assistant-healthcare',
    nameEn: 'General Duty Assistant (Healthcare)',
    nameHi: 'जनरल ड्यूटी असिस्टेंट (स्वास्थ्य सेवा / GDA)',
    category: 'Healthcare & Life Sciences',
    nsqfLevel: 4,
    durationMonths: 6,
    eligibilityEn: 'Class 10 Pass',
    eligibilityHi: '10वीं पास',
    regions: ['North', 'West', 'South', 'East', 'Central'],
    earningsMinInr: 12000,
    earningsMaxInr: 18500,
    placementRatePct: 71,
    trainingCostInr: 1500,
    reportingPeriod: 'FY 2025-26 Sample',
    verifiedAt: '2026-06-20',
    isStale: false,
    isIllustrative: true,
    evidenceStatus: 'estimate',
    sourceId: 'SRC-PMKVY-EST',
    jobRolesEn: ['Hospital Nursing Assistant', 'Home Health Aide', 'Patient Care Coordinator'],
    jobRolesHi: ['अस्पताल नर्सिंग सहायक', 'होम हेल्थ एडे', 'रोगी देखभाल सहायक'],
    limitationsEn: 'Involves rotational hospital shifts and patient mobility assistance; does not replace a registered nursing degree.',
    limitationsHi: 'अस्पताल की रोटेशनल शिफ्ट शामिल है; यह पंजीकृत नर्सिंग डिग्री का विकल्प नहीं है।',
    pathways: [
      { nsqfLevel: 4, qualificationEn: 'General Duty Assistant (GDA)', qualificationHi: 'जनरल ड्यूटी असिस्टेंट (GDA)', roleEn: 'Patient Care Assistant', roleHi: 'रोगी देखभाल सहायक', durationEn: '6 Months', durationHi: '6 महीने', optionsEn: 'Hospitals, geriatric care centres, telemedicine clinics', optionsHi: 'अस्पताल, वृद्ध देखभाल केंद्र, क्लिनिक' },
      { nsqfLevel: 5, qualificationEn: 'Advanced GDA — Critical Care / Dialysis Support', qualificationHi: 'एडवांस्ड GDA — क्रिटिकल केयर सहायता', roleEn: 'Senior Ward Assistant', roleHi: 'सीनियर वार्ड सहायक', durationEn: '12 Months', durationHi: '12 महीने', optionsEn: 'Bridge courses toward ANM/GNM nursing programmes (subject to council eligibility)', optionsHi: 'ANM/GNM नर्सिंग कोर्स की ओर प्रगति' }
    ]
  },
  {
    id: 'TRD-PLUMB',
    slug: 'plumber-general-sanitation',
    nameEn: 'Plumber (General & Water Sanitation)',
    nameHi: 'प्लंबर (सामान्य और जल स्वच्छता)',
    category: 'Construction & Plumbing',
    nsqfLevel: 4,
    durationMonths: 12,
    eligibilityEn: 'Class 8 or Class 10 Pass',
    eligibilityHi: '8वीं या 10वीं पास',
    regions: ['North', 'West', 'South', 'East', 'Central'],
    earningsMinInr: 13000,
    earningsMaxInr: 21000,
    placementRatePct: null,
    trainingCostInr: 2500,
    reportingPeriod: 'FY 2024-25 Sample',
    verifiedAt: '2025-01-10',
    isStale: true,
    isIllustrative: true,
    evidenceStatus: 'unavailable',
    sourceId: 'SRC-DGT-ITI',
    jobRolesEn: ['Building Piping Technician', 'Jal Jeevan Mission Maintenance Worker', 'Independent Plumbing Contractor'],
    jobRolesHi: ['बिल्डिंग पाइपिंग तकनीशियन', 'जल जीवन मिशन मेंटेनेंस कर्मी', 'स्वतंत्र प्लंबिंग ठेकेदार'],
    limitationsEn: 'Formal placement percentage is marked Unavailable because over 60% of certified plumbers enter independent contracting.',
    limitationsHi: 'औपचारिक प्लेसमेंट प्रतिशत अनुपलब्ध है क्योंकि अधिकांश प्रमाणित प्लंबर स्वतंत्र ठेकेदारी करते हैं।',
    pathways: [
      { nsqfLevel: 3, qualificationEn: 'Plumber Assistant', qualificationHi: 'प्लंबर सहायक', roleEn: 'Pipe Fitting Helper', roleHi: 'पाइप फिटिंग सहायक', durationEn: '4 Months', durationHi: '4 महीने', optionsEn: 'PMKVY recognition of prior learning (RPL)', optionsHi: 'पूर्व शिक्षण की मान्यता (RPL)' },
      { nsqfLevel: 4, qualificationEn: 'ITI Plumber (CTS)', qualificationHi: 'ITI प्लंबर (CTS)', roleEn: 'Certified Plumber', roleHi: 'प्रमाणित प्लंबर', durationEn: '12 Months', durationHi: '12 महीने', optionsEn: 'Municipal water boards, real estate facility management', optionsHi: 'नगर जल बोर्ड और रियल एस्टेट मेंटेनेंस' }
    ]
  },
  {
    id: 'TRD-RETAIL',
    slug: 'retail-sales-associate-omnichannel',
    nameEn: 'Retail Sales Associate & Cashier',
    nameHi: 'रिटेल सेल्स एसोसिएट और कैशियर',
    category: 'Retail & Customer Service',
    nsqfLevel: 4,
    durationMonths: 4,
    eligibilityEn: 'Class 10 or Class 12 Pass',
    eligibilityHi: '10वीं या 12वीं पास',
    regions: ['North', 'West', 'South', 'East', 'Central'],
    earningsMinInr: 11500,
    earningsMaxInr: 17000,
    placementRatePct: 66,
    trainingCostInr: 0,
    reportingPeriod: 'FY 2025-26 Sample',
    verifiedAt: '2026-08-01',
    isStale: false,
    isIllustrative: true,
    evidenceStatus: 'illustrative',
    sourceId: 'SRC-NSDC-DEMO',
    jobRolesEn: ['Store Sales Associate', 'POS Billing Executive', 'Inventory & Visual Merchandising Assistant'],
    jobRolesHi: ['स्टोर सेल्स एसोसिएट', 'POS बिलिंग एग्जीक्यूटिव', 'इन्वेंट्री सहायक'],
    limitationsEn: 'Weekend shifts and standing hours required; incentives vary by store footfall.',
    limitationsHi: 'सप्ताहांत शिफ्ट और खड़े होकर काम करना शामिल; इंसेंटिव स्टोर की बिक्री पर निर्भर करता है।',
    pathways: [
      { nsqfLevel: 3, qualificationEn: 'Retail Trainee Associate', qualificationHi: 'रिटेल ट्रेनी एसोसिएट', roleEn: 'Floor Support Associate', roleHi: 'फ्लोर सपोर्ट एसोसिएट', durationEn: '3 Months', durationHi: '3 महीने', optionsEn: 'Entry into organized retail outlets', optionsHi: 'संगठित रिटेल स्टोर में प्रवेश' },
      { nsqfLevel: 4, qualificationEn: 'Retail Sales Associate', qualificationHi: 'रिटेल सेल्स एसोसिएट', roleEn: 'POS & Customer Specialist', roleHi: 'POS और ग्राहक विशेषज्ञ', durationEn: '4 Months', durationHi: '4 महीने', optionsEn: 'Progression to Department Team Leader (NSQF Level 5)', optionsHi: 'डिपार्टमेंट टीम लीडर (NSQF स्तर 5) में प्रगति' }
    ]
  },
  {
    id: 'TRD-COPA',
    slug: 'computer-operator-programming-assistant',
    nameEn: 'Computer Operator & Programming Assistant (COPA)',
    nameHi: 'कंप्यूटर ऑपरेटर और प्रोग्रामिंग असिस्टेंट (COPA)',
    category: 'IT & Digital Services',
    nsqfLevel: 4,
    durationMonths: 12,
    eligibilityEn: 'Class 10 Pass',
    eligibilityHi: '10वीं पास',
    regions: ['North', 'West', 'South', 'East', 'Central'],
    earningsMinInr: 13000,
    earningsMaxInr: 20500,
    placementRatePct: 62,
    trainingCostInr: 2800,
    reportingPeriod: 'FY 2025-26 Sample',
    verifiedAt: '2026-08-01',
    isStale: false,
    isIllustrative: true,
    evidenceStatus: 'verified',
    sourceId: 'SRC-DGT-ITI',
    jobRolesEn: ['Office Automation Assistant', 'Data Entry & MIS Executive', 'Junior Web/IT Helpdesk Support'],
    jobRolesHi: ['ऑफिस ऑटोमेशन सहायक', 'डेटा एंट्री और MIS एग्जीक्यूटिव', 'जूनियर IT हेल्पडेस्क सपोर्ट'],
    limitationsEn: 'Course structure is verified via DGT; starting salary figures are illustrative regional samples.',
    limitationsHi: 'कोर्स संरचना DGT द्वारा सत्यापित है; शुरुआती वेतन क्षेत्रीय प्रदर्शन नमूने हैं।',
    pathways: [
      { nsqfLevel: 4, qualificationEn: 'ITI COPA (National Trade Certificate)', qualificationHi: 'ITI COPA (राष्ट्रीय ट्रेड प्रमाणपत्र)', roleEn: 'IT Support & MIS Operator', roleHi: 'IT सपोर्ट और MIS ऑपरेटर', durationEn: '12 Months', durationHi: '12 महीने', optionsEn: 'NAPS Apprenticeship, CITS, or BCA/Diploma in CS', optionsHi: 'NAPS अप्रेंटिसशिप, CITS, या कंप्यूटर डिप्लोमा' }
    ]
  },
  {
    id: 'TRD-EV',
    slug: 'electric-vehicle-service-technician',
    nameEn: 'Electric Vehicle (EV) Service Technician',
    nameHi: 'इलेक्ट्रिक वाहन (EV) सर्विस तकनीशियन',
    category: 'Automotive & Mobility',
    nsqfLevel: 4,
    durationMonths: 12,
    eligibilityEn: 'Class 10 Pass',
    eligibilityHi: '10वीं पास',
    regions: ['North', 'West', 'South'],
    earningsMinInr: 14500,
    earningsMaxInr: 23000,
    placementRatePct: 69,
    trainingCostInr: 4000,
    reportingPeriod: 'FY 2025-26 Sample',
    verifiedAt: '2026-08-01',
    isStale: false,
    isIllustrative: true,
    evidenceStatus: 'illustrative',
    sourceId: 'SRC-NSDC-DEMO',
    jobRolesEn: ['2W/3W EV Diagnostics Technician', 'Battery Management System (BMS) Repair Associate', 'Dealership Service Advisor'],
    jobRolesHi: ['2W/3W EV डायग्नोस्टिक्स तकनीशियन', 'बैटरी मैनेजमेंट सिस्टम (BMS) रिपेयर एसोसिएट', 'डीलरशिप सर्विस सलाहकार'],
    limitationsEn: 'High-voltage battery safety certification required; rural authorised service centres are still expanding.',
    limitationsHi: 'हाई-वोल्टेज बैटरी सुरक्षा प्रमाणन आवश्यक; ग्रामीण अधिकृत सर्विस सेंटर अभी बढ़ रहे हैं।',
    pathways: [
      { nsqfLevel: 4, qualificationEn: 'EV Service Technician Level 4', qualificationHi: 'EV सर्विस तकनीशियन स्तर 4', roleEn: 'EV Workshop Technician', roleHi: 'EV वर्कशॉप तकनीशियन', durationEn: '12 Months', durationHi: '12 महीने', optionsEn: 'Progression to Master EV Diagnostic Lead (NSQF Level 5)', optionsHi: 'मास्टर EV डायग्नोस्टिक लीड (NSQF स्तर 5)' }
    ]
  }
];

export function getTradesFiltered(filters: {
  region?: string;
  nsqfLevel?: number;
  category?: string;
  maxDuration?: number;
  search?: string;
}): TradeRecord[] {
  return TRADES.filter((t) => {
    if (filters.region && filters.region !== 'All' && !t.regions.includes(filters.region)) return false;
    if (filters.nsqfLevel && t.nsqfLevel !== filters.nsqfLevel) return false;
    if (filters.category && filters.category !== 'All' && t.category !== filters.category) return false;
    if (filters.maxDuration && t.durationMonths > filters.maxDuration) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const hay = `${t.nameEn} ${t.nameHi} ${t.category} ${t.jobRolesEn.join(' ')}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function getAllowedNumbersForTrade(trade: TradeRecord | undefined): Set<number> {
  const nums = new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 2025, 2026]);
  if (!trade) {
    for (const t of TRADES) {
      nums.add(t.nsqfLevel);
      nums.add(t.durationMonths);
      if (t.earningsMinInr !== null) nums.add(t.earningsMinInr);
      if (t.earningsMaxInr !== null) nums.add(t.earningsMaxInr);
      if (t.placementRatePct !== null) nums.add(t.placementRatePct);
      if (t.trainingCostInr !== null) nums.add(t.trainingCostInr);
    }
    return nums;
  }
  nums.add(trade.nsqfLevel);
  nums.add(trade.durationMonths);
  if (trade.earningsMinInr !== null) nums.add(trade.earningsMinInr);
  if (trade.earningsMaxInr !== null) nums.add(trade.earningsMaxInr);
  if (trade.placementRatePct !== null) nums.add(trade.placementRatePct);
  if (trade.trainingCostInr !== null) nums.add(trade.trainingCostInr);
  return nums;
}
