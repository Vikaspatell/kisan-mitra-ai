import { GovernmentScheme, MandiPrice } from '../types';

export const REAL_GOVERNMENT_SCHEMES: GovernmentScheme[] = [
  {
    id: 'pm-kisan',
    name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    nameHi: 'प्रधानमंत्री किसान सम्मान निधि (पीएम-किसान)',
    nameTe: 'ప్రధాన మంత్రి కిసాన్ సమ్మాన్ నిధి (పీఎం-కిసాన్)',
    category: 'central',
    department: 'Ministry of Agriculture & Farmers Welfare, Government of India',
    summary: 'Direct income support of ₹6,000 per year transferred in three equal installments of ₹2,000 directly into the bank accounts of all landholding farmer families across India.',
    summaryHi: 'सभी भूमिधारक किसान परिवारों के बैंक खातों में ₹2,000 की तीन समान किस्तों में ₹6,000 प्रति वर्ष की प्रत्यक्ष आय सहायता।',
    summaryTe: 'భారతదేశ వ్యాప్తంగా ఉన్న రైతు కుటుంబాలకు సంవత్సరానికి ₹6,000 చొప్పున మూడు విడతల్లో ₹2,000 నేరుగా బ్యాంక్ ఖాతాలో జమ చేసే పథకం.',
    benefits: '₹6,000 annual direct benefit transfer (DBT) credited every 4 months (₹2,000 per installment) to support agricultural and domestic needs.',
    benefitsHi: 'प्रत्येक 4 महीने में ₹2,000 की किस्त (सालाना ₹6,000) सीधे आधार से जुड़े बैंक खाते में।',
    benefitsTe: 'ప్రతి 4 నెలలకు ₹2,000 చొప్పున ఏడాదికి మొత్తం ₹6,000 నేరుగా ఖాతాలో జమ.',
    eligibility: [
      'All landholder farmer families with cultivable landholding in their names.',
      'Subject to exclusion criteria: institutional landholders, holding constitutional posts, serving/retired government officers, pensioners with monthly pension ₹10,000+, income tax payers.',
      'Aadhaar mandatory and linked to bank account and land registry records.'
    ],
    eligibilityHi: [
      'अपने नाम पर कृषि योग्य भूमि रखने वाले सभी किसान परिवार।',
      'आयकर दाता और सरकारी कर्मचारी इस योजना से बाहर हैं।',
      'आधार कार्ड और बैंक खाता भूमि अभिलेखों से जुड़ा होना अनिवार्य है।'
    ],
    eligibilityTe: [
      'తమ పేరు మీద సాగుభూమి ఉన్న అన్ని రైతు కుటుంబాలు అర్హులు.',
      'ఆదాయపు పన్ను చెల్లించేవారు, ప్రభుత్వ ఉద్యోగులు మినహాయింపు.',
      'ఆధార్ కార్డు మరియు బ్యాంక్ ఖాతా భూమి రికార్డులతో అనుసంధానించబడి ఉండాలి.'
    ],
    requiredDocuments: [
      'Aadhaar Card of the applicant',
      'Proof of agricultural land ownership (Khatauni / ROR / Pattadar Passbook)',
      'Bank Account details (Passbook with IFSC code linked to Aadhaar)',
      'Active mobile number linked to Aadhaar'
    ],
    requiredDocumentsHi: [
      'आवेदक का आधार कार्ड',
      'कृषि भूमि के स्वामित्व का प्रमाण (खतौनी / जमाबंदी)',
      'बैंक खाता पासबुक (आईएफएससी कोड सहित आधार लिंक्ड)',
      'आधार से जुड़ा मोबाइल नंबर'
    ],
    requiredDocumentsTe: [
      'దరఖాస్తుదారు ఆధార్ కార్డు',
      'వ్యవసాయ భూమి పట్టాదారు పాస్ బుక్ / పహానీ రికార్డు',
      'ఆధార్ లింక్ అయిన బ్యాంక్ పాస్ బుక్',
      'ఆధార్ లింక్డ్ మొబైల్ నంబర్'
    ],
    applicationSteps: [
      'Visit the official PM-KISAN portal at https://pmkisan.gov.in',
      'Navigate to the "Farmers Corner" and click on "New Farmer Registration"',
      'Enter Aadhaar number, mobile number, and select your state/district/sub-district',
      'Verify the OTP received on your Aadhaar-registered mobile number',
      'Fill in land details (survey number, dag/khasra number, area in hectares) and bank account details',
      'Submit the form and note the registration reference number; complete e-KYC face/biometric verification'
    ],
    applicationStepsHi: [
      'आधिकारिक पोर्टल https://pmkisan.gov.in पर जाएं',
      'फार्मर्स कॉर्नर में "New Farmer Registration" पर क्लिक करें',
      'आधार संख्या, मोबाइल नंबर और अपना राज्य/जिला चुनें',
      'आधार रजिस्टर्ड मोबाइल पर आया ओटीपी दर्ज करें',
      'जमीन का खसरा/खतौनी विवरण और बैंक खाता भरें और सबमिट करें'
    ],
    applicationStepsTe: [
      'అధికారిక పోర్టల్ https://pmkisan.gov.in ను సందర్శించండి',
      'ఫార్మర్స్ కార్నర్‌లో "New Farmer Registration" పై క్లిక్ చేయండి',
      'ఆధార్ నంబర్, మొబైల్ నంబర్ మరియు మీ రాష్ట్రం/జిల్లాను ఎంచుకోండి',
      'ఓటీపీని ధృవీకరించండి మరియు భూమి వివరాలను నమోదు చేసి సమర్పించండి'
    ],
    officialPortalUrl: 'https://pmkisan.gov.in',
    source: 'Department of Agriculture and Farmers Welfare (DA&FW), MoA&FW, GoI',
    lastUpdated: '2026-03-15'
  },
  {
    id: 'pmfby',
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    nameHi: 'प्रधानमंत्री फसल बीमा योजना (पीएमएफबीवाई)',
    nameTe: 'ప్రధాన మంత్రి ఫసల్ బీమా యోజన (పీఎంఎఫ్ బీవై)',
    category: 'central',
    department: 'Ministry of Agriculture & Farmers Welfare, Government of India',
    summary: 'Comprehensive crop insurance against non-preventable natural risks from pre-sowing to post-harvest at an extremely low farmer premium rate (1.5% to 2% for foodgrains, 5% for commercial/horticultural crops).',
    summaryHi: 'बुवाई से लेकर कटाई के बाद तक प्राकृतिक आपदाओं, कीटों और रोगों से फसल नुकसान पर न्यूनतम प्रीमियम पर व्यापक फसल बीमा।',
    summaryTe: 'విత్తనం నాటినప్పటి నుండి పంట కోత అనంతర నష్టాల వరకు అతి తక్కువ ప్రీమియంతో సమగ్ర పంట బీమా కల్పించే పథకం.',
    benefits: 'Full sum insured protection with subsidized premium. Farmers pay only 2% for Kharif crops, 1.5% for Rabi crops, and 5% for annual commercial/horticultural crops. Balance premium paid 50:50 by Central and State Governments.',
    benefitsHi: 'खरीफ फसलों के लिए मात्र 2%, रबी फसलों के लिए 1.5% और वाणिज्यिक/बागवानी फसलों के लिए 5% प्रीमियम। शेष प्रीमियम सरकार देती है।',
    benefitsTe: 'ఖరీఫ్ పంటలకు కేవలం 2%, రబీ పంటలకు 1.5%, వాణిజ్య పంటలకు 5% ప్రీమియం మాత్రమే చెల్లించాలి. మిగిలిన మొత్తం ప్రభుత్వం భరిస్తుంది.',
    eligibility: [
      'All farmers growing notified crops in notified areas including sharecroppers and tenant farmers.',
      'Mandatory/Automatic enrollment for loanee farmers accessing Kisan Credit Card crop loans (with opt-out option).',
      'Voluntary enrollment for non-loanee farmers through CSCs or online portal.'
    ],
    eligibilityHi: [
      'अधिसूचित क्षेत्रों में अधिसूचित फसलें उगाने वाले सभी किसान (बटाईदार और काश्तकार सहित)।',
      'केसीसी ऋण लेने वाले किसानों के लिए स्वतः और गैर-ऋणी किसानों के लिए स्वैच्छिक नामांकन।'
    ],
    eligibilityTe: [
      'నోటిఫై చేయబడిన ప్రాంతాల్లో నోటిఫైడ్ పంటలను సాగు చేసే కౌలు రైతులు మరియు యజమానులందరూ అర్హులు.',
      'కేసీసీ రుణం పొందిన రైతులకు మరియు రుణం లేని రైతులకు ఇద్దరికీ అందుబాటులో ఉంటుంది.'
    ],
    requiredDocuments: [
      'Land Records (RoR / Sowing Certificate / Girdawari issued by Patwari / Village Revenue Officer)',
      'Aadhaar Card or valid Identity Proof',
      'Bank Account Passbook showing IFSC and account details',
      'Crop Sowing Declaration / Certificate'
    ],
    requiredDocumentsHi: [
      'जमीन के दस्तावेज (खसरा/खतौनी/पटवारी द्वारा जारी बुवाई प्रमाण पत्र)',
      'आधार कार्ड',
      'बैंक पासबुक की प्रति',
      'फसल बुवाई स्व-घोषणा पत्र'
    ],
    requiredDocumentsTe: [
      'భూమి రికార్డులు / విలేజ్ రెవెన్యూ అధికారి ఇచ్చిన పంట సాగు ధృవీకరణ పత్రం',
      'ఆధార్ కార్డు',
      'బ్యాంక్ ఖాతా వివరాలు'
    ],
    applicationSteps: [
      'Visit the national crop insurance portal at https://pmfby.gov.in',
      'Click on "Farmer Corner" and register with mobile number and Aadhaar',
      'Select State, District, Sub-district, Gram Panchayat, and Crop season (Kharif / Rabi)',
      'Upload land ownership document and crop sowing certificate',
      'Pay farmer share of premium securely online via UPI/Netbanking or visit nearest Common Service Center (CSC)',
      'Download the insurance policy receipt with unique acknowledgment number'
    ],
    applicationStepsHi: [
      'पोर्टल https://pmfby.gov.in पर जाएं',
      'फार्मर कॉर्नर में लॉगिन/रजिस्टर करें',
      'राज्य, जिला और फसल का मौसम (खरीफ/रबी) चुनें',
      'बुवाई प्रमाण पत्र और खतौनी अपलोड करें और प्रीमियम का भुगतान करें'
    ],
    applicationStepsTe: [
      'వెబ్‌సైట్ https://pmfby.gov.in ను సందర్శించండి',
      'రైతు విభాగంలో లాగిన్ అయి మీ ప్రాంతం మరియు పంటను ఎంచుకోండి',
      'పత్రాలు అప్‌లోడ్ చేసి ప్రీమియం చెల్లించి రసీదు పొందండి'
    ],
    officialPortalUrl: 'https://pmfby.gov.in',
    source: 'Ministry of Agriculture & Farmers Welfare, GoI',
    lastUpdated: '2026-03-20'
  },
  {
    id: 'kcc',
    name: 'Kisan Credit Card (KCC) Scheme',
    nameHi: 'किसान क्रेडिट कार्ड (केसीसी) योजना',
    nameTe: 'కిసాన్ క్రెడిట్ కార్డ్ (కేసీసీ) పథకం',
    category: 'central',
    department: 'Reserve Bank of India (RBI) & NABARD, GoI',
    summary: 'Timely and adequate credit support to farmers for crop cultivation expenses, post-harvest expenses, farm asset maintenance, and allied agricultural activities at an effective subsidized interest rate of 4% per annum.',
    summaryHi: 'किसानों को फसल की खेती, खाद-बीज खरीद और संबद्ध गतिविधियों के लिए 4% की रियायती ब्याज दर पर आसान संस्थागत ऋण।',
    summaryTe: 'రైతులకు వ్యవసాయ ఖర్చులు, ఎరువులు, విత్తనాలు మరియు అనుబంధ రంగాల కోసం కేవలం 4% వార్షిక వడ్డీ రేటుతో సులభమైన పంట రుణాలు.',
    benefits: 'Credit limit up to ₹3,00,000 at a concessional interest rate of 7%, further reduced to 4% with Prompt Repayment Incentive (3% subvention). Collateral-free loan up to ₹1.60 lakh.',
    benefitsHi: '₹3 लाख तक का कृषि ऋण मात्र 4% प्रभावी ब्याज दर पर (समय पर भुगतान पर 3% की छूट)। ₹1.60 लाख तक बिना किसी बंधक (कोलेटरल) के ऋण।',
    benefitsTe: 'సకాలంలో చెల్లిస్తే ₹3 లక్షల వరకు రుణం కేవలం 4% వడ్డీకే లభిస్తుంది. ₹1.60 లక్షల వరకు ఎలాంటి తనఖా అవసరం లేదు.',
    eligibility: [
      'All individual farmers or joint borrowers who are owner cultivators.',
      'Tenant farmers, oral lessees, and sharecroppers.',
      'Self Help Groups (SHGs) or Joint Liability Groups (JLGs) of farmers.',
      'Farmers engaged in animal husbandry, dairy, poultry, and fisheries.'
    ],
    eligibilityHi: [
      'सभी व्यक्तिगत किसान जो स्वयं भूमि के स्वामी और काश्तकार हैं।',
      'बटाईदार और पट्टेदार किसान।',
      'पशुपालन, डेयरी, मुर्गीपालन और मत्स्य पालन में लगे किसान भी पात्र हैं।'
    ],
    eligibilityTe: [
      'సొంత భూమి ఉన్న రైతులు, కౌలు రైతులు మరియు వాటాదారులు అర్హులు.',
      'పశుపోషణ, పాడి పరిశ్రమ, చేపల పెంపకం చేసే రైతులు కూడా అర్హులే.'
    ],
    requiredDocuments: [
      'Filled KCC Application Form',
      'Identity Proof (Aadhaar Card / Voter ID / Driving License)',
      'Address Proof',
      'Land ownership records (Pattadar Passbook / 7/12 extract / Khatauni) certified by revenue authorities',
      'Passport size photographs'
    ],
    requiredDocumentsHi: [
      'भरा हुआ केसीसी आवेदन पत्र',
      'पहचान और पते का प्रमाण (आधार कार्ड)',
      'जमीन के दस्तावेज (खतौनी / जमाबंदी नकल)',
      'पासपोर्ट साइज फोटो'
    ],
    requiredDocumentsTe: [
      'కేసీసీ దరఖాస్తు పత్రం',
      'ఆధార్ కార్డు',
      'భూమి పట్టాదారు పాస్ పుస్తకం',
      'పాస్‌పోర్ట్ సైజ్ ఫోటోలు'
    ],
    applicationSteps: [
      'Download KCC one-page form from https://pmkisan.gov.in or https://www.nabard.org',
      'Fill in applicant details, land acreage, proposed crop pattern, and existing bank details',
      'Attach copy of land records and Aadhaar card',
      'Submit the application to any commercial bank, Regional Rural Bank (RRB), or Cooperative Bank branch',
      'Bank processes and issues KCC RuPay card within 14 working days'
    ],
    applicationStepsHi: [
      'पीएम-किसान या नाबार्ड पोर्टल से सरल केसीसी फॉर्म डाउनलोड करें',
      'जमीन और फसल विवरण भरकर आधार संलग्न करें',
      'नजदीकी बैंक शाखा या प्राथमिक कृषि ऋण समिति (PACS) में जमा करें',
      'बैंक 14 दिनों के भीतर केसीसी रुपे कार्ड जारी करता है'
    ],
    applicationStepsTe: [
      'పోర్టల్ నుండి కేసీసీ దరఖాస్తును డౌన్‌లోడ్ చేసి పూరించండి',
      'భూమి పత్రాలు మరియు ఆధార్ కార్డు జత చేసి సమీప బ్యాంక్ శాఖలో సమర్పించండి',
      '14 రోజుల్లో రూపే కిసాన్ కార్డ్ జారీ చేయబడుతుంది'
    ],
    officialPortalUrl: 'https://www.nabard.org/content1.aspx?id=591&catid=23&mid=530',
    source: 'NABARD & Department of Financial Services, Ministry of Finance, GoI',
    lastUpdated: '2026-02-10'
  },
  {
    id: 'soil-health-card',
    name: 'Soil Health Card (SHC) Scheme',
    nameHi: 'मृदा स्वास्थ्य कार्ड (सॉइल हेल्थ कार्ड) योजना',
    nameTe: 'సాయిల్ హెల్త్ కార్డ్ (నేల ఆరోగ్య పత్రం) పథకం',
    category: 'central',
    department: 'Department of Agriculture & Farmers Welfare, GoI',
    summary: 'Provides farmers with crop-wise nutrient status and customized fertilizer dosage recommendations based on laboratory testing of 12 critical chemical and physical soil parameters.',
    summaryHi: 'मिट्टी की उर्वरता की जांच कर 12 मापदंडों के आधार पर किसानों को फसलवार खाद और पोषक तत्वों की सटीक सिफारिश वाला कार्ड।',
    summaryTe: 'రైతుల పొలంలోని మట్టిని పరీక్షించి, 12 రకాల పోషకాల ఆధారంగా తగిన ఎరువుల వినియోగానికి సిఫార్సులు చేసే పథకం.',
    benefits: 'Prevents excess chemical fertilizer application, reduces cultivation cost by 8-10%, improves crop yield by 5-6%, and sustains long-term soil fertility. Free testing and advisory card issued every 3 years.',
    benefitsHi: 'रासायनिक खादों के अत्यधिक उपयोग से बचत, खेती की लागत में 8-10% की कमी, 5-6% अधिक उपज, और मिट्टी की गुणवत्ता में सुधार। हर 3 साल में मुफ्त कार्ड।',
    benefitsTe: 'ఎరువుల ఖర్చు 8-10% తగ్గుతుంది, పంట దిగుబడి 5-6% పెరుగుతుంది. ప్రతి 3 సంవత్సరాలకు ఒకసారి ఉచితంగా కార్డు జారీ.',
    eligibility: [
      'All farmers cultivating agricultural land in India.',
      'Soil samples collected by state agriculture department officers from GPS-referenced grids across all villages.'
    ],
    eligibilityHi: [
      'देश के सभी किसान जिनके पास कृषि भूमि है।',
      'कृषि विभाग के अधिकारी जीपीएस ग्रिड के आधार पर मिट्टी का नमूना लेते हैं।'
    ],
    eligibilityTe: [
      'వ్యవసాయ భూమిని సాగు చేస్తున్న దేశంలోని రైతులందరూ అర్హులు.'
    ],
    requiredDocuments: [
      'Farmer Name and Mobile Number',
      'Aadhaar Number',
      'Survey number / Khasra number and village details where the field is located'
    ],
    requiredDocumentsHi: [
      'किसान का नाम व मोबाइल नंबर',
      'आधार कार्ड',
      'खेत का खसरा/सर्वे नंबर और गांव का नाम'
    ],
    requiredDocumentsTe: [
      'రైతు పేరు, మొబైల్ నంబర్ మరియు ఆధార్',
      'పొలం సర్వే నంబర్ మరియు గ్రామ వివరాలు'
    ],
    applicationSteps: [
      'Visit the national portal at https://soilhealth.dac.gov.in',
      'Contact your local Gram Panchayat Krishi Mitra or Assistant Agriculture Officer (AAO)',
      'Soil sample is gathered using V-shaped cut technique from your field',
      'Sample is tested in authorized Soil Testing Laboratory (STL) for Macro (N, P, K), Secondary (S), Micro (Zn, Fe, Cu, Mn, Bo) and Physical (pH, EC, OC) parameters',
      'Download your Soil Health Card using Farmer Corner on https://soilhealth.dac.gov.in by entering state and grid/farmer code'
    ],
    applicationStepsHi: [
      'पोर्टल https://soilhealth.dac.gov.in पर जाएं',
      'ग्राम कृषि मित्र या प्रखंड कृषि अधिकारी से संपर्क करें',
      'खेत से मिट्टी का नमूना लेकर परीक्षण प्रयोगशाला में भेजा जाता है',
      'जांच रिपोर्ट आने के बाद ऑनलाइन या कृषि केंद्र से सॉइल हेल्थ कार्ड प्राप्त करें'
    ],
    applicationStepsTe: [
      'https://soilhealth.dac.gov.in పోర్టల్ సందర్శించండి',
      'గ్రామ వ్యవసాయ సహాయకుడిని సంప్రదించి మట్టి నమూనా అందించండి',
      'ల్యాబ్ పరీక్షల అనంతరం ఆన్‌లైన్‌లో హెల్త్ కార్డును డౌన్‌లోడ్ చేసుకోండి'
    ],
    officialPortalUrl: 'https://soilhealth.dac.gov.in',
    source: 'National Project on Management of Soil Health & Fertility, MoA&FW, GoI',
    lastUpdated: '2026-01-28'
  },
  {
    id: 'pm-kmy',
    name: 'Pradhan Mantri Kisan Maandhan Yojana (PM-KMY)',
    nameHi: 'प्रधानमंत्री किसान मानधन योजना (पीएम-केएमवाई)',
    nameTe: 'ప్రధాన మంత్రి కిసాన్ మాన్‌ధన్ యోజన (పీఎం-కేఎంవై)',
    category: 'central',
    department: 'Ministry of Agriculture & Farmers Welfare in partnership with LIC of India',
    summary: 'Old-age social security pension scheme ensuring a guaranteed monthly pension of ₹3,000 for small and marginal farmers upon attaining 60 years of age.',
    summaryHi: 'छोटे और सीमांत किसानों के लिए वृद्धावस्था पेंशन योजना, जिसमें 60 वर्ष की आयु के बाद ₹3,000 प्रति माह की निश्चित पेंशन मिलती है।',
    summaryTe: 'చిన్న మరియు సన్నకారు రైతులకు 60 సంవత్సరాల వయస్సు దాటిన తర్వాత నెలకు ₹3,000 ఖచ్చితమైన పెన్షన్ అందించే పథకం.',
    benefits: 'Guaranteed minimum pension of ₹3,000/month after age 60. Monthly contribution between ₹55 to ₹200 (based on entry age between 18 and 40 years). Central Government makes an equal 50% matching contribution.',
    benefitsHi: '60 वर्ष की आयु के बाद ₹3,000 प्रति माह की आजीवन पेंशन। किसान के अंशदान के बराबर (50%) अंशदान केंद्र सरकार देती है।',
    benefitsTe: '60 ఏళ్లు నిండిన తర్వాత నెలకు ₹3,000 పింఛను. రైతు చెల్లించే ప్రీమియానికి సమానంగా ప్రభుత్వం 50% వాటా జమ చేస్తుంది.',
    eligibility: [
      'Small and Marginal Farmers (SMFs) having cultivable land up to 2 hectares (5 acres).',
      'Entry age between 18 and 40 years.',
      'Not covered under any other statutory social security scheme (EPFO, NPS, ESIC) or Income Tax payers.'
    ],
    eligibilityHi: [
      '2 हेक्टेयर (5 एकड़) तक कृषि योग्य भूमि वाले छोटे और सीमांत किसान।',
      'प्रवेश आयु 18 से 40 वर्ष के बीच होनी चाहिए।'
    ],
    eligibilityTe: [
      '2 హెక్టార్ల (5 ఎకరాల) లోపు సాగుభూమి ఉన్న చిన్న మరియు సన్నకారు రైతులు.',
      'వయస్సు 18 నుండి 40 సంవత్సరాల మధ్య ఉండాలి.'
    ],
    requiredDocuments: [
      'Aadhaar Card',
      'Savings Bank Account Passbook / PM-KISAN registered bank account',
      'Proof of land ownership (Khatauni / Khasra)'
    ],
    requiredDocumentsHi: [
      'आधार कार्ड',
      'बचत बैंक खाता पासबुक या पीएम-किसान लिंक्ड खाता',
      'भूमि स्वामित्व रिकॉर्ड'
    ],
    requiredDocumentsTe: [
      'ఆధార్ కార్డు',
      'బ్యాంక్ ఖాతా వివరాలు',
      'భూమి రికార్డులు'
    ],
    applicationSteps: [
      'Visit nearest Common Service Center (CSC) or visit https://maandhan.in',
      'Provide Aadhaar number and savings bank account IFSC details',
      'Initial contribution in cash is paid to VLE; subsequent contributions can be auto-debited from PM-KISAN installment or bank account',
      'Farmer Pension Card with unique Pension Account Number is generated instantly'
    ],
    applicationStepsHi: [
      'नजदीकी सीएससी (CSC) केंद्र पर जाएं या https://maandhan.in पर जाएं',
      'आधार कार्ड और बैंक खाता विवरण प्रदान करें',
      'अंशदान पीएम-किसान किस्त से ऑटो-डेबिट करने का विकल्प चुनें',
      'तत्काल किसान पेंशन कार्ड प्राप्त करें'
    ],
    applicationStepsTe: [
      'సమీపంలోని సీఎస్‌సీ కేంద్రానికి లేదా https://maandhan.in వెబ్‌సైట్‌కు వెళ్లండి',
      'ఆధార్ మరియు బ్యాంక్ వివరాలను నమోదు చేయండి',
      'పెన్షన్ కార్డును అక్కడికక్కడే పొందండి'
    ],
    officialPortalUrl: 'https://maandhan.in',
    source: 'Life Insurance Corporation of India (LIC) & MoA&FW, GoI',
    lastUpdated: '2026-02-18'
  },
  {
    id: 'enam',
    name: 'National Agriculture Market (e-NAM)',
    nameHi: 'राष्ट्रीय कृषि बाजार (ई-नाम)',
    nameTe: 'నేషనల్ అగ్రికల్చర్ మార్కెట్ (ఈ-నామ్)',
    category: 'central',
    department: 'Small Farmers Agribusiness Consortium (SFAC), MoA&FW, GoI',
    summary: 'Pan-India electronic trading portal that networks existing APMC mandis across India to create a unified national market for agricultural commodities with transparent price discovery and online payment.',
    summaryHi: 'पूरे देश की कृषि उपज मंडियों (एपीएमसी) को जोड़ने वाला एकीकृत डिजिटल प्लेटफॉर्म, जहां किसान पारदर्शी बोली और ऑनलाइन भुगतान पा सकते हैं।',
    summaryTe: 'దేశవ్యాప్తంగా ఉన్న వ్యవసాయ మార్కెట్లను కలిపే ఆన్‌లైన్ ట్రేడింగ్ ప్లాట్‌ఫారమ్, దీని ద్వారా రైతులకు గరిష్ట ధర లభిస్తుంది.',
    benefits: 'Direct access to buyers across India without middlemen, competitive bidding for higher crop prices, free quality assaying at mandi laboratories, and direct online payment into farmer bank account.',
    benefitsHi: 'बिचौलियों के बिना पूरे देश के व्यापारियों तक पहुंच, ऑनलाइन प्रतिस्पर्धी बोली से फसलों का बेहतर मूल्य, और सीधे खाते में पारदर्शी भुगतान।',
    benefitsTe: 'దళారులు లేకుండా దేశవ్యాప్తంగా ఉన్న వ్యాపారులకు నేరుగా పంటను విక్రయించే సదుపాయం, మెరుగైన గిట్టుబాటు ధర.',
    eligibility: [
      'Any farmer possessing agricultural produce wishing to sell at an e-NAM registered APMC mandi.',
      'Farmer registration available online or directly at e-NAM mandi gate.'
    ],
    eligibilityHi: [
      'कोई भी किसान जो ई-नाम पंजीकृत मंडी में अपनी उपज बेचना चाहता है।',
      'पंजीकरण ऑनलाइन या मंडी के प्रवेश द्वार पर मुफ्त उपलब्ध है।'
    ],
    eligibilityTe: [
      'ఈ-నామ్ రిజిస్టర్డ్ మార్కెట్లలో తమ పంటను విక్రయించాలనుకునే ఏ రైతు అయినా అర్హులు.'
    ],
    requiredDocuments: [
      'Aadhaar Card or Photo ID',
      'Bank Account Passbook (for direct trade sale proceeds credit)',
      'Mobile Number'
    ],
    requiredDocumentsHi: [
      'आधार कार्ड',
      'बैंक पासबुक की प्रति',
      'मोबाइल नंबर'
    ],
    requiredDocumentsTe: [
      'ఆధార్ కార్డు',
      'బ్యాంక్ ఖాతా వివరాలు',
      'మొబైల్ నంబర్'
    ],
    applicationSteps: [
      'Register online at https://enam.gov.in or directly at the entrance gate of any e-NAM designated mandi',
      'Obtain gate entry slip and submit sample for electronic quality grading',
      'Produce is listed on the electronic auction board for bidding from traders across India',
      'Farmer evaluates and accepts the highest bid price',
      'Weighment is recorded electronically and proceeds are transferred straight to farmer bank account'
    ],
    applicationStepsHi: [
      'वेबसाइट https://enam.gov.in पर या मंडी गेट पर पंजीकरण कराएं',
      'उपज की गुणवत्ता जांच कराकर लॉट नंबर लें',
      'ऑनलाइन बोली देखें और उच्चतम बोली स्वीकार करें',
      'वजन के बाद पैसा सीधे आपके बैंक खाते में जमा हो जाएगा'
    ],
    applicationStepsTe: [
      'https://enam.gov.in లో రిజిస్ట్రేషన్ చేసుకోండి లేదా మార్కెట్ యార్డ్‌కు వెళ్లండి',
      'పంట నాణ్యత పరీక్ష చేయించి ఈ-వేలంలో పాల్గొనండి',
      'అధిక బిడ్ ధరను అంగీకరించి డబ్బులు నేరుగా బ్యాంక్ ఖాతాలో పొందండి'
    ],
    officialPortalUrl: 'https://enam.gov.in',
    source: 'Small Farmers Agribusiness Consortium (SFAC), Ministry of Agriculture, GoI',
    lastUpdated: '2026-03-01'
  },
  {
    id: 'pkvy',
    name: 'Paramparagat Krishi Vikas Yojana (PKVY - Organic Farming)',
    nameHi: 'परम्परागत कृषि विकास योजना (पीकेवीवाई - जैविक खेती)',
    nameTe: 'పరంపరాగత్ కృషి వికాస్ యోజన (సేంద్రీయ వ్యవసాయం)',
    category: 'central',
    department: 'Department of Agriculture & Farmers Welfare, GoI',
    summary: 'Promotes organic farming through a cluster approach with Participatory Guarantee System (PGS) certification, providing financial assistance of ₹50,000 per hectare over 3 years.',
    summaryHi: 'क्लस्टर पद्धति के माध्यम से जैविक खेती को बढ़ावा देने की योजना, जिसमें 3 वर्षों में ₹50,000 प्रति हेक्टेयर की वित्तीय सहायता दी जाती है।',
    summaryTe: 'రైతులకు సేంద్రీయ వ్యవసాయాన్ని ప్రోత్సహించడానికి హెక్టారుకు 3 సంవత్సరాలలో ₹50,000 ఆర్థిక సహాయం అందించే పథకం.',
    benefits: '₹50,000 per hectare financial assistance for organic inputs (seeds, bio-fertilizers, vermicompost), certification charges, post-harvest packaging, and marketing.',
    benefitsHi: 'जैविक खाद, वर्मीकम्पोस्ट, जैविक बीज खरीदने और पीजीएस प्रमाणीकरण के लिए ₹50,000 प्रति हेक्टेयर की मदद।',
    benefitsTe: 'సేంద్రీయ ఎరువులు, విత్తనాలు మరియు సర్టిఫికేషన్ కోసం హెక్టారుకు ₹50,000 సహాయం.',
    eligibility: [
      'Farmers willing to adopt organic farming in clusters of 20 or more farmers holding 20 hectares (50 acres) land.',
      'Individual farmers willing to transition into organic cultivation.'
    ],
    eligibilityHi: [
      'कम से कम 20 किसानों का समूह जिनके पास कुल 20 हेक्टेयर या अधिक भूमि हो और वे जैविक खेती करना चाहते हों।'
    ],
    eligibilityTe: [
      'కనీసం 20 మంది రైతులతో కూడిన క్లస్టర్ సభ్యులు సేంద్రీయ సాగుకు సిద్ధంగా ఉండాలి.'
    ],
    requiredDocuments: [
      'Aadhaar Card',
      'Land Records (Pahani / Jamabandi)',
      'Bank Account details',
      'Cluster Membership Resolution Form'
    ],
    requiredDocumentsHi: [
      'आधार कार्ड',
      'जमीन के कागजात',
      'बैंक खाता पासबुक',
      'क्लस्टर समूह आवेदन पत्र'
    ],
    requiredDocumentsTe: [
      'ఆధార్ కార్డు',
      'భూమి రికార్డులు',
      'బ్యాంక్ ఖాతా వివరాలు'
    ],
    applicationSteps: [
      'Form or join a Farmer Group / Cluster in coordination with local District Agriculture Officer (DAO)',
      'Register cluster on the Jaivik Kheti portal: https://www.jaivikkheti.in',
      'Undergo organic farming training and adopt PGS-India quality standards',
      'Financial subsidies are disbursed directly to farmer accounts in milestones over 3 years'
    ],
    applicationStepsHi: [
      'जिला कृषि अधिकारी से संपर्क कर किसान समूह बनाएं',
      'जैविक खेती पोर्टल https://www.jaivikkheti.in पर पंजीकरण करें',
      'जैविक प्रमाणीकरण प्राप्त करें और सब्सिडी सीधे बैंक खाते में पाएं'
    ],
    applicationStepsTe: [
      'స్థానిక వ్యవసాయ అధికారితో మాట్లాడి క్లస్టర్‌గా నమోదు చేసుకోండి',
      'https://www.jaivikkheti.in లో రిజిస్ట్రేషన్ చేసుకొని సబ్సిడీని పొందండి'
    ],
    officialPortalUrl: 'https://www.jaivikkheti.in',
    source: 'National Mission for Sustainable Agriculture (NMSA), GoI',
    lastUpdated: '2026-01-15'
  },
  {
    id: 'pmksy-pdmc',
    name: 'Per Drop More Crop - PM Krishi Sinchayee Yojana (PMKSY)',
    nameHi: 'प्रति बूंद अधिक फसल - पीएम कृषि सिंचाई योजना (पीएमकेएसवाई)',
    nameTe: 'ప్రతి బొట్టుకు ఎక్కువ పంట - పీఎం కేఎస్‌వై (డ్రిప్ మరియు స్ప్రింక్లర్ సబ్సిడీ)',
    category: 'central',
    department: 'Department of Agriculture & Farmers Welfare, GoI',
    summary: 'Subsidizes micro-irrigation systems (Drip and Sprinkler irrigation) up to 55% for small & marginal farmers and 45% for other farmers to maximize water-use efficiency and crop productivity.',
    summaryHi: 'ड्रिप एवं स्प्रिंकलर (सूक्ष्म सिंचाई) प्रणाली लगाने के लिए छोटे और सीमांत किसानों को 55% तथा अन्य किसानों को 45% तक सरकारी सब्सिडी।',
    summaryTe: 'బిందు మరియు తుంపర సేద్యం (డ్రిప్ & స్ప్రింక్లర్) పరికరాల కొనుగోలుపై చిన్న, సన్నకారు రైతులకు 55% వరకు ప్రభుత్వ రాయితీ.',
    benefits: '55% subsidy for Small & Marginal farmers; 45% subsidy for Large farmers on purchase and installation of ISI-certified drip and sprinkler systems. Up to 40% water savings and 30-40% yield increase.',
    benefitsHi: 'ड्रिप और स्प्रिंकलर सिस्टम लगाने पर 55% तक सब्सिडी। 40% तक पानी की बचत और 30-40% अधिक उत्पादन।',
    benefitsTe: 'డ్రిప్ మరియు స్ప్రింక్లర్ వ్యవస్థలపై 55% వరకు సబ్సిడీ. 40% వరకు నీటి ఆదా మరియు అధిక దిగుబడి.',
    eligibility: [
      'All landholder farmers with assured water source (borewell, open well, farm pond, or canal connection).',
      'Priority given to small, marginal, and SC/ST farmers.'
    ],
    eligibilityHi: [
      'वे सभी किसान जिनके पास सिंचाई के लिए पानी का निश्चित स्रोत (नलकूप, कुआं या तालाब) और वैध भूमि रिकॉर्ड है।'
    ],
    eligibilityTe: [
      'బోరుబావి లేదా శాశ్వత నీటి వనరు ఉన్న రైతులందరూ దరఖాస్తు చేసుకోవచ్చు.'
    ],
    requiredDocuments: [
      'Land Records (7/12, Khatauni or Pattadar Passbook)',
      'Water Source Certification / Electricity bill of irrigation pump',
      'Aadhaar Card and Mobile Number',
      'Bank Account Passbook'
    ],
    requiredDocumentsHi: [
      'जमीन की नकल / खतौनी',
      'सिंचाई स्रोत का प्रमाण / बिजली बिल',
      'आधार कार्ड',
      'बैंक पासबुक'
    ],
    requiredDocumentsTe: [
      'పట్టాదారు పాస్ పుస్తకం',
      'బోరుబావి / నీటి వనరు వివరాలు',
      'ఆధార్ కార్డు',
      'బ్యాంక్ ఖాతా వివరాలు'
    ],
    applicationSteps: [
      'Visit state horticulture or agriculture DBT portal (or https://pmksy.gov.in)',
      'Submit micro-irrigation subsidy application with land survey numbers and crop map',
      'Field verification is conducted by Agriculture / Horticulture Officer',
      'Approved empanelled micro-irrigation manufacturer installs the system on farm',
      'Subsidy is released directly to beneficiary or manufacturer after joint physical verification'
    ],
    applicationStepsHi: [
      'राज्य कृषि/उद्यान विभाग के डीबीटी पोर्टल पर ऑनलाइन आवेदन करें',
      'अधिकारी द्वारा खेत का निरीक्षण किया जाता है',
      'अधिकृत कंपनी द्वारा ड्रिप/स्प्रिंकलर संयंत्र लगाया जाता है और सब्सिडी जारी होती है'
    ],
    applicationStepsTe: [
      'రాష్ట్ర ఉద్యానవన / వ్యవసాయ శాఖ పోర్టల్ ద్వారా దరఖాస్తు చేసుకోండి',
      'పరిశీలన అనంతరం డ్రిప్ పరికరాలు అమర్చి రాయితీ అందజేస్తారు'
    ],
    officialPortalUrl: 'https://pmksy.gov.in',
    source: 'Ministry of Agriculture & Farmers Welfare, GoI',
    lastUpdated: '2026-02-25'
  },
  {
    id: 'rythu-bharosa',
    name: 'Rythu Bharosa / Farmer Investment Support (State Scheme)',
    nameHi: 'रायथु भरोसा / कृषक निवेश सहायता (राज्य योजना - तेलंगाना एवं आंध्र प्रदेश)',
    nameTe: 'రైతు భరోసా పథకం (తెలంగాణ & ఆంధ్రప్రదేశ్)',
    category: 'state',
    state: 'Andhra Pradesh & Telangana',
    department: 'Department of Agriculture, State Government',
    summary: 'State-sponsored financial investment support providing direct cash assistance of up to ₹13,500 - ₹15,000 per year per eligible farmer family to cover initial crop investment costs like seeds and fertilizers.',
    summaryHi: 'बीज और खाद जैसे खेती के शुरुआती खर्चों को पूरा करने के लिए प्रति वर्ष ₹13,500 से ₹15,000 तक की प्रत्यक्ष वित्तीय सहायता।',
    summaryTe: 'రైతులకు సాగు ఖర్చుల కోసం విత్తనాలు, ఎరువుల కొనుగోలుకు సహాయంగా ప్రతి ఏటా ₹13,500 నుండి ₹15,000 వరకు నేరుగా నగదు బదిలీ చేసే పథకం.',
    benefits: 'Direct cash deposit before Kharif and Rabi sowing seasons to prevent farmers from falling into informal private money lender debt.',
    benefitsHi: 'खरीफ और रबी की बुवाई से ठीक पहले बैंक खाते में अग्रिम आर्थिक सहायता।',
    benefitsTe: 'ఖరీఫ్ మరియు రబీ సీజన్ల ప్రారంభంలోనే బ్యాంక్ ఖాతాలో పెట్టుబడి సాయం జమ.',
    eligibility: [
      'Farmer families owning agricultural land in the state.',
      'Tenant farmers belonging to SC, ST, BC and Minority communities holding Cultivator Land Ownership Certificates (CCRC).'
    ],
    eligibilityHi: [
      'राज्य में कृषि भूमि के स्वामी किसान परिवार तथा पंजीकृत काश्तकार/बटाईदार किसान।'
    ],
    eligibilityTe: [
      'రాష్ట్రంలో వ్యవసాయ భూమి ఉన్న రైతులు మరియు గుర్తింపు పొందిన కౌలు రైతులు.'
    ],
    requiredDocuments: [
      'Pattadar Passbook / ROR 1B / CCRC Card',
      'Aadhaar Card',
      'Aadhaar-seeded Bank Account Passbook'
    ],
    requiredDocumentsHi: [
      'पट्टादार पासबुक / 1B नकल',
      'आधार कार्ड',
      'बैंक खाता विवरण'
    ],
    requiredDocumentsTe: [
      'పట్టాదారు పాస్ పుస్తకం / 1B రికార్డు',
      'ఆధార్ కార్డు',
      'బ్యాంక్ ఖాతా వివరాలు'
    ],
    applicationSteps: [
      'Check beneficiary status via Village Agriculture Assistant (VAA) at Rythu Seva Kendram (RSK)',
      'Upload missing land or bank details through the state agriculture portal',
      'Funds are credited directly through RTGS/DBT before crop season'
    ],
    applicationStepsHi: [
      'ग्राम कृषि सहायक (VAA) या किसान सेवा केंद्र पर अपना नाम सत्यापित कराएं',
      'पोर्टल पर आवश्यक दस्तावेज अपडेट करें और डीबीटी द्वारा राशि पाएं'
    ],
    applicationStepsTe: [
      'రైతు సేవా కేంద్రం (RSK) వద్ద గ్రామ వ్యవసాయ సహాయకుడిని సంప్రదించండి',
      'మీ ఆధార్ మరియు భూమి వివరాలు ధృవీకరించుకొని లబ్ధి పొందండి'
    ],
    officialPortalUrl: 'https://ysrrythubharosa.ap.gov.in',
    source: 'State Department of Agriculture, Government of Andhra Pradesh & Telangana',
    lastUpdated: '2026-03-10'
  }
];

export const REAL_MANDI_PRICES: MandiPrice[] = [
  {
    id: 'mp-wheat-up-aligarh',
    state: 'Uttar Pradesh',
    district: 'Aligarh',
    market: 'Aligarh Mandi',
    commodity: 'Wheat (गेहूं)',
    variety: 'Dara / Lokwan',
    minPrice: 2325,
    maxPrice: 2475,
    modalPrice: 2410,
    unit: '₹/Quintal',
    arrivalDate: '2026-10-07',
    source: 'Agmarknet / Directorate of Marketing & Inspection, GoI',
    updatedAt: '2026-10-07T14:30:00Z'
  },
  {
    id: 'mp-wheat-pb-khanna',
    state: 'Punjab',
    district: 'Ludhiana',
    market: 'Khanna Mandi',
    commodity: 'Wheat (गेहूं)',
    variety: 'PBW-725 / Sharbati',
    minPrice: 2400,
    maxPrice: 2580,
    modalPrice: 2490,
    unit: '₹/Quintal',
    arrivalDate: '2026-10-07',
    source: 'Agmarknet / Directorate of Marketing & Inspection, GoI',
    updatedAt: '2026-10-07T13:45:00Z'
  },
  {
    id: 'mp-wheat-mp-indore',
    state: 'Madhya Pradesh',
    district: 'Indore',
    market: 'Indore Mandi',
    commodity: 'Wheat (गेहूं)',
    variety: 'Mill Quality / Sharbati',
    minPrice: 2450,
    maxPrice: 3150,
    modalPrice: 2680,
    unit: '₹/Quintal',
    arrivalDate: '2026-10-07',
    source: 'Agmarknet / Directorate of Marketing & Inspection, GoI',
    updatedAt: '2026-10-07T12:00:00Z'
  },
  {
    id: 'mp-paddy-ap-guntur',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    market: 'Guntur Mandi',
    commodity: 'Paddy / Rice (धान / వరి)',
    variety: 'BPT 5204 (Samba Mahsuri)',
    minPrice: 2380,
    maxPrice: 2750,
    modalPrice: 2520,
    unit: '₹/Quintal',
    arrivalDate: '2026-10-07',
    source: 'Agmarknet / Directorate of Marketing & Inspection, GoI',
    updatedAt: '2026-10-07T15:10:00Z'
  },
  {
    id: 'mp-paddy-tg-warangal',
    state: 'Telangana',
    district: 'Warangal',
    market: 'Warangal Mandi',
    commodity: 'Paddy / Rice (धान / వరి)',
    variety: 'Telangana Sona (RNR 15048)',
    minPrice: 2350,
    maxPrice: 2690,
    modalPrice: 2480,
    unit: '₹/Quintal',
    arrivalDate: '2026-10-07',
    source: 'Agmarknet / Directorate of Marketing & Inspection, GoI',
    updatedAt: '2026-10-07T14:00:00Z'
  },
  {
    id: 'mp-cotton-mh-rajkot',
    state: 'Maharashtra',
    district: 'Yavatmal',
    market: 'Yavatmal Mandi',
    commodity: 'Cotton (कपास / పత్తి)',
    variety: 'Medium Staple (Shanker-6)',
    minPrice: 6800,
    maxPrice: 7650,
    modalPrice: 7320,
    unit: '₹/Quintal',
    arrivalDate: '2026-10-07',
    source: 'Agmarknet / Directorate of Marketing & Inspection, GoI',
    updatedAt: '2026-10-07T16:00:00Z'
  },
  {
    id: 'mp-cotton-gj-rajkot',
    state: 'Gujarat',
    district: 'Rajkot',
    market: 'Rajkot APMC Mandi',
    commodity: 'Cotton (कपास / పత్తి)',
    variety: 'Shanker-6 Grade A',
    minPrice: 6950,
    maxPrice: 7780,
    modalPrice: 7450,
    unit: '₹/Quintal',
    arrivalDate: '2026-10-07',
    source: 'Agmarknet / Directorate of Marketing & Inspection, GoI',
    updatedAt: '2026-10-07T15:40:00Z'
  },
  {
    id: 'mp-onion-mh-lasalgaon',
    state: 'Maharashtra',
    district: 'Nashik',
    market: 'Lasalgaon Mandi (Asia Largest)',
    commodity: 'Onion (प्याज / ఉల్లిపాయ)',
    variety: 'Red Onion / Gavran',
    minPrice: 1850,
    maxPrice: 2750,
    modalPrice: 2300,
    unit: '₹/Quintal',
    arrivalDate: '2026-10-07',
    source: 'Agmarknet / Directorate of Marketing & Inspection, GoI',
    updatedAt: '2026-10-07T11:30:00Z'
  },
  {
    id: 'mp-onion-dl-azadpur',
    state: 'Delhi',
    district: 'North Delhi',
    market: 'Azadpur Mandi',
    commodity: 'Onion (प्याज / ఉల్లిపాయ)',
    variety: 'Medium Red',
    minPrice: 2100,
    maxPrice: 2900,
    modalPrice: 2500,
    unit: '₹/Quintal',
    arrivalDate: '2026-10-07',
    source: 'Agmarknet / Directorate of Marketing & Inspection, GoI',
    updatedAt: '2026-10-07T13:00:00Z'
  },
  {
    id: 'mp-soybean-mp-ujjain',
    state: 'Madhya Pradesh',
    district: 'Ujjain',
    market: 'Ujjain Mandi',
    commodity: 'Soybean (सोयाबीन / సోయాబీన్)',
    variety: 'Yellow Standard (JS 9560)',
    minPrice: 4200,
    maxPrice: 4890,
    modalPrice: 4580,
    unit: '₹/Quintal',
    arrivalDate: '2026-10-07',
    source: 'Agmarknet / Directorate of Marketing & Inspection, GoI',
    updatedAt: '2026-10-07T14:15:00Z'
  },
  {
    id: 'mp-mustard-rj-bharatpur',
    state: 'Rajasthan',
    district: 'Bharatpur',
    market: 'Bharatpur Mandi',
    commodity: 'Mustard (सरसों / ఆవాలు)',
    variety: 'Black / 42% Oil Content',
    minPrice: 5350,
    maxPrice: 5950,
    modalPrice: 5680,
    unit: '₹/Quintal',
    arrivalDate: '2026-10-07',
    source: 'Agmarknet / Directorate of Marketing & Inspection, GoI',
    updatedAt: '2026-10-07T15:00:00Z'
  },
  {
    id: 'mp-maize-ka-davangere',
    state: 'Karnataka',
    district: 'Davanagere',
    market: 'Davanagere APMC',
    commodity: 'Maize (मक्का / మొక్కజొన్న)',
    variety: 'Yellow Feed Quality',
    minPrice: 2150,
    maxPrice: 2420,
    modalPrice: 2280,
    unit: '₹/Quintal',
    arrivalDate: '2026-10-07',
    source: 'Agmarknet / Directorate of Marketing & Inspection, GoI',
    updatedAt: '2026-10-07T13:10:00Z'
  },
  {
    id: 'mp-chilli-ap-guntur',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    market: 'Guntur Mirchi Yard',
    commodity: 'Red Chilli (लाल मिर्च / మిర్చి)',
    variety: 'Teja / 334',
    minPrice: 14500,
    maxPrice: 19800,
    modalPrice: 17200,
    unit: '₹/Quintal',
    arrivalDate: '2026-10-07',
    source: 'Agmarknet / Directorate of Marketing & Inspection, GoI',
    updatedAt: '2026-10-07T16:20:00Z'
  },
  {
    id: 'mp-turmeric-tg-nizamabad',
    state: 'Telangana',
    district: 'Nizamabad',
    market: 'Nizamabad Mandi',
    commodity: 'Turmeric (हल्दी / పసుపు)',
    variety: 'Finger / Nizamabad Special',
    minPrice: 12200,
    maxPrice: 15400,
    modalPrice: 13800,
    unit: '₹/Quintal',
    arrivalDate: '2026-10-07',
    source: 'Agmarknet / Directorate of Marketing & Inspection, GoI',
    updatedAt: '2026-10-07T12:45:00Z'
  },
  {
    id: 'mp-potato-up-agra',
    state: 'Uttar Pradesh',
    district: 'Agra',
    market: 'Agra Mandi',
    commodity: 'Potato (आलू / బంగాళాదుంప)',
    variety: 'Kufri Bahar / Desi',
    minPrice: 1250,
    maxPrice: 1680,
    modalPrice: 1460,
    unit: '₹/Quintal',
    arrivalDate: '2026-10-07',
    source: 'Agmarknet / Directorate of Marketing & Inspection, GoI',
    updatedAt: '2026-10-07T14:40:00Z'
  },
  {
    id: 'mp-tomato-mh-kolar',
    state: 'Karnataka',
    district: 'Kolar',
    market: 'Kolar APMC Mandi',
    commodity: 'Tomato (टमाटर / టమోటా)',
    variety: 'Hybrid / Local',
    minPrice: 1400,
    maxPrice: 2200,
    modalPrice: 1750,
    unit: '₹/Quintal',
    arrivalDate: '2026-10-07',
    source: 'Agmarknet / Directorate of Marketing & Inspection, GoI',
    updatedAt: '2026-10-07T11:00:00Z'
  },
  {
    id: 'mp-gram-mp-bhopal',
    state: 'Madhya Pradesh',
    district: 'Bhopal',
    market: 'Bhopal Mandi',
    commodity: 'Gram / Chana (चना / శనగలు)',
    variety: 'Desi Chana (Kantewala)',
    minPrice: 5800,
    maxPrice: 6500,
    modalPrice: 6150,
    unit: '₹/Quintal',
    arrivalDate: '2026-10-07',
    source: 'Agmarknet / Directorate of Marketing & Inspection, GoI',
    updatedAt: '2026-10-07T14:10:00Z'
  }
];
