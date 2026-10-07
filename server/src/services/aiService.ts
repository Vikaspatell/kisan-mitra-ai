import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/env';
import { User, Language, ChatMessage } from '../types';

let genAI: GoogleGenerativeAI | null = null;
if (config.geminiApiKey && config.geminiApiKey.trim().length > 0) {
  try {
    genAI = new GoogleGenerativeAI(config.geminiApiKey);
  } catch (err) {
    console.warn('[AI] Failed to initialize Google Generative AI client:', err);
  }
}

// Built-in intelligent agronomy advisor when Gemini key is not configured or offline
function getAgronomyKnowledgeResponse(
  query: string,
  farmer: User,
  lang: Language
): string {
  const q = query.toLowerCase();

  // Language specific greetings & closings
  const greeting =
    lang === 'hi'
      ? `नमस्ते ${farmer.name} जी! किसान मित्र AI में आपका स्वागत है।`
      : lang === 'te'
      ? `నమస్కారం ${farmer.name} గారు! కిసాన్ మిత్ర AI కి స్వాగతం.`
      : `Hello ${farmer.name}, welcome to Kisan Mitra AI!`;

  const cropsStr = farmer.crops.length > 0 ? farmer.crops.join(', ') : 'fasal';

  // 1. Weather and rain advisory
  if (q.includes('weather') || q.includes('rain') || q.includes('mausam') || q.includes('barish') || q.includes('varsham') || q.includes('వాతావరణం')) {
    if (lang === 'hi') {
      return `${greeting}\n\nआपके क्षेत्र (${farmer.district}, ${farmer.state}) में मौसम के अनुसार सलाह:\n- यदि आगामी 48 घंटों में बारिश की संभावना है, तो खड़ी फसलों (${cropsStr}) में तुरंत सिंचाई और कीटनाशक का छिड़काव रोक दें।\n- खेतों में जल-निकासी (drainage) की नालियां साफ रखें ताकि जलभराव (waterlogging) न हो।\n- कटी हुई फसल या अनाजों को सुरक्षित तिरपाल या शेड के नीचे रखें।\n\nआप हमारे 'Weather' टैब में जाकर 7 दिनों का सटीक पूर्वानुमान और मौसम चेतावनी देख सकते हैं।`;
    }
    if (lang === 'te') {
      return `${greeting}\n\nమీ ప్రాంతం (${farmer.district}, ${farmer.state}) కోసం వాతావరణ సలహా:\n- రాబోయే రోజుల్లో వర్షం కురిసే అవకాశం ఉన్నట్లయితే, మీ పంటలకు (${cropsStr}) నీటిపారుదల మరియు మందుల పిచికారీని తాత్కాలికంగా ఆపండి.\n- పొలంలో నీరు నిల్వ ఉండకుండా మురుగు కాలువలను సిద్ధం చేసుకోండి.\n- కోసిన పంటను సురక్షిత ప్రాంతానికి లేదా టార్పాలిన్ కవర్ల కిందకి తరలించండి.\n\nపూర్తి వివరాల కోసం 'Weather' విభాగంలో 7 రోజుల సమాచారాన్ని చూడవచ్చు.`;
    }
    return `${greeting}\n\nWeather Advisory for ${farmer.district}, ${farmer.state}:\n- If rainfall is expected in the next 2-3 days, pause scheduled irrigation and avoid foliar spraying on your crops (${cropsStr}).\n- Clear drainage channels around your fields to prevent root waterlogging.\n- Secure harvested crops under tarpaulins.\n\nCheck the dedicated 'Weather' page for live 7-day forecasts and alert advisories.`;
  }

  // 2. Mandi prices / selling crops
  if (q.includes('mandi') || q.includes('price') || q.includes('bhav') || q.includes('rate') || q.includes('dhar') || q.includes('ధర') || q.includes('మార్కెట్')) {
    if (lang === 'hi') {
      return `${greeting}\n\nमंडी भाव और विपणन परामर्श:\n- आपकी मुख्य फसलों (${cropsStr}) के लिए नजदीकी मंडियों के ताजा मॉडल भाव 'Market Prices' टैब में उपलब्ध हैं।\n- बेहतर मूल्य पाने के लिए उपज को सुखाकर (नमी 12% से कम) और ग्रेडिंग करके ही मंडी लाएं।\n- आप राष्ट्रीय कृषि बाजार (e-NAM) पोर्टल पर पंजीकरण कराकर देश भर के व्यापारियों से प्रतिस्पर्धी ऑनलाइन बोली भी प्राप्त कर सकते हैं।\n- न्यूनतम समर्थन मूल्य (MSP) और नजदीकी सरकारी उपार्जन केंद्रों की जानकारी के लिए अपने स्थानीय विपणन केंद्र से संपर्क करें।`;
    }
    if (lang === 'te') {
      return `${greeting}\n\nమార్కెట్ ధరల సమాచారం:\n- మీ పంటల (${cropsStr}) తాజా మార్కెట్ ధరలను మా 'Market Prices' విభాగంలో చూడవచ్చు.\n- మంచి ధర పొందడానికి పంటలో తేమ శాతం 12% లోపు ఉండేలా ఆరబెట్టి, నాణ్యతా ప్రమాణాల ప్రకారం గ్రేడింగ్ చేయండి.\n- e-NAM పోర్టల్ ద్వారా దేశవ్యాప్తంగా ఉన్న వ్యాపారుల నుండి ఎక్కువ బిడ్ ధరను పొందవచ్చు.`;
    }
    return `${greeting}\n\nMandi Market Price Insights:\n- Real Agmarknet mandi rates for your crops (${cropsStr}) are tracked live in the 'Market Prices' section.\n- To fetch the highest price, ensure grain moisture is below 12% and properly clean/grade your harvest before entering the APMC market.\n- Consider trading via e-NAM (National Agriculture Market) for pan-India transparent electronic bidding directly to your bank account.`;
  }

  // 3. Government schemes / PM-Kisan / KCC
  if (q.includes('scheme') || q.includes('pm kisan') || q.includes('pmkisan') || q.includes('kcc') || q.includes('yojana') || q.includes('subsidy') || q.includes('పథకం') || q.includes('రుణం') || q.includes('సబ్సిడీ')) {
    if (lang === 'hi') {
      return `${greeting}\n\nसरकारी योजनाओं की जानकारी:\n1. **पीएम-किसान (PM-KISAN):** सालाना ₹6,000 तीन किस्तों में। इसके लिए आधार ई-केवाईसी (e-KYC) और भू-अभिलेख लिंकिंग आवश्यक है।\n2. **किसान क्रेडिट कार्ड (KCC):** समय पर भुगतान पर मात्र 4% ब्याज पर ₹3 लाख तक का सस्ता कृषि ऋण।\n3. **पीएम फसल बीमा योजना (PMFBY):** प्राकृतिक आपदाओं से सुरक्षा के लिए खरीफ में 2% और रबी में 1.5% प्रीमियम पर पूर्ण फसल सुरक्षा।\n\nपात्रता और ऑनलाइन आवेदन के आधिकारिक लिंक देखने के लिए कृपया 'Government Schemes' टैब देखें।`;
    }
    if (lang === 'te') {
      return `${greeting}\n\nప్రభుత్వ పథకాల సమాచారం:\n1. **పీఎం-కిసాన్:** ఏడాదికి ₹6,000 నేరుగా బ్యాంక్ ఖాతాలో జమ. e-KYC తప్పనిసరి.\n2. **కిసాన్ క్రెడిట్ కార్డ్ (KCC):** కేవలం 4% వార్షిక వడ్డీతో సులభమైన పంట రుణాలు.\n3. **ఫసల్ బీమా యోజన:** ఖరీఫ్ పంటకు 2%, రబీ పంటకు 1.5% తక్కువ ప్రీమియంతో సమగ్ర పంట బీమా.\n\nఅన్ని ప్రభుత్వ పథకాల వివరాలు మరియు దరఖాస్తు లింకులు 'Government Schemes' విభాగంలో ఉన్నాయి.`;
    }
    return `${greeting}\n\nTop Government Agricultural Schemes for You:\n1. **PM-KISAN:** ₹6,000/year direct financial assistance across 3 installments. Complete Aadhaar e-KYC on pmkisan.gov.in.\n2. **Kisan Credit Card (KCC):** Subsidized institutional credit up to ₹3 Lakh at an effective 4% interest rate.\n3. **PM Fasal Bima Yojana (PMFBY):** Comprehensive insurance covering natural crop losses at nominal 1.5%-2% premium.\n\nBrowse full eligibility criteria and official government portal links in our 'Government Schemes' page.`;
  }

  // 4. Crop advisory (Wheat, Rice, Cotton, etc.)
  if (lang === 'hi') {
    return `${greeting}\n\nआपकी खेती (${cropsStr}) और क्षेत्र (${farmer.district}, ${farmer.state}) के लिए कृषि परामर्श:\n- **मिट्टी की जांच:** बुवाई से पहले मृदा स्वास्थ्य कार्ड (Soil Health Card) के अनुसार ही संतुलित मात्रा में गोबर की सड़ी खाद (FYM) और जैव-उर्वरक का प्रयोग करें।\n- **बीज उपचार (Seed Treatment):** बुवाई से पहले बीजों का ट्राइकोडर्मा या अनुशंसित फफूंदनाशक से उपचार अवश्य करें ताकि शुरुआती रोगों से बचाव हो सके।\n- **जल प्रबंधन:** फसल के क्रांतिक अवस्थाओं (जैसे कल्ले फूटते समय, फूल आते समय और दाना बनते समय) में नमी बनाए रखना सर्वाधिक महत्वपूर्ण है।\n\nआप मौसम, मंडी भाव या किसी विशिष्ट योजना के संबंध में कोई भी प्रश्न सीधे पूछ सकते हैं!`;
  }
  if (lang === 'te') {
    return `${greeting}\n\nమీ పంటల (${cropsStr}) సాగు కోసం (${farmer.district}, ${farmer.state}) వ్యవసాయ సలహా:\n- **విత్తన శుద్ధి:** విత్తే ముందు ట్రైకోడెర్మా లేదా సిఫార్సు చేసిన మందులతో విత్తన శుద్ధి చేసుకోవడం ద్వారా నేల ద్వారా వచ్చే తెగుళ్ళను నివారించవచ్చు.\n- **సేంద్రీయ ఎరువులు:** పశువుల ఎరువు, వర్మీకంపోస్ట్ వాడటం వల్ల నేల సారం పెరుగుతుంది.\n- **నీటి యాజమాన్యం:** పూత మరియు గింజ పాలు పోసుకునే దశల్లో నేలలో తగినంత తేమ ఉండేలా చూసుకోండి.\n\nవాతావరణం, మార్కెట్ ధరలు లేదా ప్రభుత్వ పథకాల గురించి ఏవైనా సందేహాలు ఉంటే అడగండి!`;
  }
  return `${greeting}\n\nTailored Agronomy Insights for ${farmer.crops.join(', ') || 'your farm'} in ${farmer.district}, ${farmer.state}:\n- **Seed Treatment:** Always perform seed treatment with Trichoderma or certified bio-fungicides prior to sowing to prevent seedling rot and wilt.\n- **Soil Health:** Rely on a recent Soil Health Card test to apply organic manure, vermicompost, and micronutrients accurately.\n- **Critical Stages:** Ensure adequate moisture during vegetative tillering, flowering, and grain filling stages.\n\nFeel free to ask questions regarding live weather forecasts, mandi market rates, or government subsidies!`;
}

export async function generateCopilotResponse(
  userQuery: string,
  farmer: User,
  chatHistory: ChatMessage[],
  lang: Language = 'en'
): Promise<string> {
  // If Gemini API is configured, call Gemini
  if (genAI && config.geminiApiKey) {
    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 1000,
        },
      });

      const languageInstruction =
        lang === 'hi'
          ? 'Respond entirely in pure, conversational, respectful Hindi (हिन्दी) using Devanagari script. Use clear terminology suitable for Indian farmers.'
          : lang === 'te'
          ? 'Respond entirely in pure, conversational, respectful Telugu (తెలుగు) script. Use clear terminology suitable for Telugu farmers.'
          : 'Respond in clear, simple, practical English suitable for an Indian farmer.';

      const systemPrompt = `You are "Kisan Mitra AI" (किसान मित्र / రైతు మిత్ర), an expert, compassionate, and practical agricultural AI assistant designed specifically for Indian farmers.

Farmer Context:
- Name: ${farmer.name}
- Location: Village: ${farmer.village || 'Local Village'}, District: ${farmer.district}, State: ${farmer.state}, India
- Land Holding: ${farmer.landSize} acres
- Primary Cultivated Crops: ${farmer.crops.join(', ') || 'General agricultural crops'}
- Preferred Language: ${lang}

Guidelines:
1. ${languageInstruction}
2. Always address the farmer respectfully (e.g., in Hindi use 'आप / नमस्ते ${farmer.name} जी', in Telugu use 'నమస్కారం ${farmer.name} గారు').
3. Provide practical, timely, agronomic advice tailored to Indian seasons (Kharif, Rabi, Zaid) and local climate conditions of ${farmer.state}.
4. Cover agriculture guidance, mandi market selling tips (eNAM / Agmarknet), government schemes (PM-KISAN, KCC, PMFBY, Soil Health Card), organic practices, and weather resilience.
5. STRICT SCOPE NOTICE: Do NOT discuss IoT sensors, automated smart valve controllers, motor pump IoT hardware, or image-based disease scanning algorithms. Keep advice strictly focused on practical farming, weather protection, mandi market intelligence, and government schemes.
6. Keep answers structured, concise, and easy to read on mobile phones.`;

      // Build message context
      const recentHistory = chatHistory.slice(-4).map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));

      const chat = model.startChat({
        history: recentHistory,
        systemInstruction: systemPrompt,
      });

      const result = await chat.sendMessage(userQuery);
      const text = result.response.text();
      if (text && text.trim().length > 0) {
        return text.trim();
      }
    } catch (err) {
      console.warn('[AI] Gemini call encountered an issue, falling back to local agronomy advisor:', err);
    }
  }

  // Graceful local agronomy intelligence response
  return getAgronomyKnowledgeResponse(userQuery, farmer, lang);
}
