import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({ onTranscript, className = '' }) => {
  const { language, t } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    // Set voice recognition language
    if (language === 'hi') {
      recognition.lang = 'hi-IN';
    } else if (language === 'te') {
      recognition.lang = 'te-IN';
    } else {
      recognition.lang = 'en-IN';
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript && transcript.trim().length > 0) {
        onTranscript(transcript.trim());
      }
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, [language, onTranscript]);

  const toggleListening = () => {
    if (!supported) {
      alert(
        language === 'hi'
          ? 'आपके ब्राउज़र में वॉइस इनपुट समर्थित नहीं है। कृपया Chrome या Edge का उपयोग करें।'
          : language === 'te'
          ? 'మీ బ్రౌజర్‌లో వాయిస్ ఇన్‌పుట్ అందుబాటులో లేదు. దయచేసి Chrome లేదా Edge ఉపయోగించండి.'
          : 'Voice speech recognition is not supported in this browser. Please use Chrome or Edge.'
      );
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch {}
      setIsListening(false);
    } else {
      try {
        if (recognitionRef.current) {
          if (language === 'hi') recognitionRef.current.lang = 'hi-IN';
          else if (language === 'te') recognitionRef.current.lang = 'te-IN';
          else recognitionRef.current.lang = 'en-IN';

          recognitionRef.current.start();
          setIsListening(true);
        }
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
        setIsListening(false);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={`relative inline-flex items-center justify-center p-2.5 rounded-full transition-all focus:outline-none ${
        isListening
          ? 'bg-red-600 text-white animate-voice-pulse shadow-md ring-2 ring-red-300'
          : 'bg-kisan-50 text-kisan-700 hover:bg-kisan-100 border border-kisan-300'
      } ${className}`}
      title={isListening ? t('aiListening') : t('aiVoiceInput')}
      aria-label="Voice Input"
    >
      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
    </button>
  );
};
