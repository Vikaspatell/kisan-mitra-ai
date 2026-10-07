import React from 'react';
import { Sprout, ShieldCheck, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { language } = useLanguage();

  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-20 lg:pb-12 border-t border-stone-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3 text-white">
              <div className="w-9 h-9 rounded-xl bg-kisan-600 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">Kisan Mitra AI</span>
            </div>
            <p className="text-stone-400 text-sm max-w-md leading-relaxed">
              {language === 'hi'
                ? 'भारतीय किसानों को वास्तविक समय मौसम, प्रामाणिक मंडी भाव, सरकारी योजनाओं और बहुभाषी AI कृषि सलाहकार से सशक्त बनाने वाला डिजिटल मंच।'
                : language === 'te'
                ? 'భారతీయ రైతులకు తాజా వాతావరణం, నిజమైన మార్కెట్ ధరలు, ప్రభుత్వ పథకాలు మరియు AI సలహాలను అందించే విశ్వసనీయ వేదిక.'
                : 'Dedicated full-stack agricultural companion providing verified live weather forecasts, real Agmarknet mandi commodity rates, and authentic Central & State government farmer schemes.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-kisan-400 bg-stone-800/80 px-3 py-1.5 rounded-lg border border-stone-700 w-fit">
              <ShieldCheck className="w-4 h-4 text-kisan-400" />
              <span>Strictly authentic datasets. Never fabricated.</span>
            </div>
          </div>

          {/* Official Portals */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs tracking-wider uppercase">
              Official Government Portals
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <a
                  href="https://pmkisan.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>PM-KISAN Samman Nidhi</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://pmfby.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>PM Fasal Bima Yojana (PMFBY)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://enam.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>National Agriculture Market (e-NAM)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://agmarknet.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Agmarknet Mandi Network</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://myscheme.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>myScheme Portal (GoI)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Data Sources */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs tracking-wider uppercase">
              Real Data Attributions
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <strong className="text-stone-300">Weather API:</strong> Open-Meteo & IMD Numerical Weather Prediction Models
              </li>
              <li>
                <strong className="text-stone-300">Mandi Prices:</strong> Agmarknet & Directorate of Marketing & Inspection (MoA&FW)
              </li>
              <li>
                <strong className="text-stone-300">Schemes:</strong> Ministry of Agriculture & Farmers Welfare, GoI
              </li>
              <li>
                <strong className="text-stone-300">AI Intelligence:</strong> Multilingual Agronomy Engine with Gemini Pro/Flash
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
          <div>
            © {new Date().getFullYear()} Kisan Mitra AI. Made for Indian Farmers (जय जवान, जय किसान).
          </div>
          <div className="flex items-center gap-4">
            <span>English • हिन्दी • తెలుగు</span>
            <span>•</span>
            <span>Mobile & Voice Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
