import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SpeechOutputButtonProps {
  text: string;
  className?: string;
}

export const SpeechOutputButton: React.FC<SpeechOutputButtonProps> = ({ text, className = '' }) => {
  const { language, t } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [synthSupported, setSynthSupported] = useState(true);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setSynthSupported(false);
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggleSpeak = () => {
    if (!synthSupported) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean markdown stars/hashtags before reading
    const cleanText = text
      .replace(/[*#_`>]/g, '')
      .replace(/https?:\/\/\S+/g, 'link')
      .replace(/\n+/g, '. ');

    const utterance = new SpeechSynthesisUtterance(cleanText);

    if (language === 'hi') {
      utterance.lang = 'hi-IN';
      utterance.rate = 0.9;
    } else if (language === 'te') {
      utterance.lang = 'te-IN';
      utterance.rate = 0.9;
    } else {
      utterance.lang = 'en-IN';
      utterance.rate = 0.95;
    }

    // Try to find native voice
    const voices = window.speechSynthesis.getVoices();
    const targetLangCode = language === 'hi' ? 'hi' : language === 'te' ? 'te' : 'en';
    const matchedVoice = voices.find(v => v.lang.startsWith(targetLangCode));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  if (!synthSupported) return null;

  return (
    <button
      type="button"
      onClick={handleToggleSpeak}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
        isSpeaking
          ? 'bg-amber-100 text-amber-800 border border-amber-300'
          : 'bg-stone-100 text-stone-600 hover:bg-stone-200 border border-stone-200'
      } ${className}`}
      title={isSpeaking ? t('aiStopSpeaking') : t('aiSpeakResponse')}
      aria-label="Speech Output"
    >
      {isSpeaking ? (
        <>
          <VolumeX className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
          <span>{t('aiStopSpeaking')}</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-stone-600" />
          <span>{t('aiSpeakResponse')}</span>
        </>
      )}
    </button>
  );
};
