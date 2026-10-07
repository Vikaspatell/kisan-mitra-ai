import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Bot,
  Send,
  Trash2,
  Sparkles,
  User as UserIcon,
  HelpCircle,
  ShieldCheck,
  RefreshCw,
  MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { aiApi } from '../services/api';
import { ChatMessage } from '../types';
import { VoiceInputButton } from '../components/VoiceInputButton';
import { SpeechOutputButton } from '../components/SpeechOutputButton';

export const AICopilot: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { language, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Suggested prompts
  const suggestedPrompts = [
    t('aiSuggestedPrompt1'),
    t('aiSuggestedPrompt2'),
    t('aiSuggestedPrompt3'),
    t('aiSuggestedPrompt4'),
  ];

  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    async function loadHistory() {
      if (!isAuthenticated) {
        setHistoryLoading(false);
        return;
      }
      try {
        setHistoryLoading(true);
        const res = await aiApi.getHistory();
        setMessages(res.messages);
      } catch (err) {
        console.warn('Failed to load chat history:', err);
      } finally {
        setHistoryLoading(false);
      }
    }

    loadHistory();
  }, [isAuthenticated]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Handle auto-ask from URL query parameter
  useEffect(() => {
    const query = searchParams.get('q');
    if (query && !loading) {
      setInputText(query);
      handleSendMessage(query);
      searchParams.delete('q');
      setSearchParams(searchParams);
    }
  }, [searchParams]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || loading) return;

    setInputText('');
    setLoading(true);

    // Optimistically add user message
    const tempUserMsg: ChatMessage = {
      id: `temp_${Date.now()}`,
      userId: user?.id || 'guest',
      role: 'user',
      content: text,
      language,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      const res = await aiApi.sendMessage(text, language);
      // Replace with actual messages from server
      setMessages(prev => [...prev.filter(m => m.id !== tempUserMsg.id), res.userMessage, res.assistantMessage]);
    } catch (err: any) {
      console.error('Failed to get AI response:', err);
      const errMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        userId: user?.id || 'guest',
        role: 'assistant',
        content:
          language === 'hi'
            ? 'क्षमा करें, उत्तर प्राप्त करने में समस्या आई। कृपया पुनः प्रयास करें।'
            : language === 'te'
            ? 'క్షమించండి, సమాధానం పొందడంలో సమస్య ఎదురైంది. దయచేసి మళ్ళీ ప్రయత్నించండి.'
            : 'Sorry, could not process your query at this moment. Please check your connection and try again.',
        language,
        createdAt: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = async () => {
    if (!window.confirm(t('aiClearConfirm'))) return;
    try {
      await aiApi.clearHistory();
      setMessages([]);
    } catch (err) {
      console.error('Failed to clear history:', err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-kisan-700 to-kisan-500 text-white flex items-center justify-center shadow-md shadow-kisan-700/20">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
              <span>{t('aiTitle')}</span>
              <span className="text-[11px] font-bold uppercase tracking-wider bg-kisan-100 text-kisan-800 px-2 py-0.5 rounded-full border border-kisan-200">
                Active
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-500">
              {t('aiSubtitle')}
            </p>
          </div>
        </div>

        {/* Farmer Profile Pill & Action */}
        <div className="flex items-center gap-2">
          {user && (
            <div className="hidden md:flex items-center gap-1.5 text-xs text-kisan-800 bg-kisan-50 px-3 py-1.5 rounded-xl border border-kisan-200">
              <MapPin className="w-3.5 h-3.5 text-kisan-600" />
              <span>{user.district}, {user.state}</span>
              {user.crops && user.crops.length > 0 && (
                <span className="text-stone-500">• {user.crops.slice(0, 2).join(', ')}</span>
              )}
            </div>
          )}

          {messages.length > 0 && (
            <button
              type="button"
              onClick={handleClearChat}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-stone-200"
              title={t('aiClearChat')}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('aiClearChat')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm flex flex-col h-[650px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Welcome Intro message if history is empty */}
          {messages.length === 0 && !historyLoading && (
            <div className="text-center py-10 max-w-xl mx-auto space-y-5">
              <div className="w-16 h-16 rounded-3xl bg-kisan-50 border border-kisan-200 text-kisan-700 flex items-center justify-center mx-auto shadow-inner">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-stone-900">
                  {language === 'hi'
                    ? 'नमस्ते किसान साथी! मैं आपका किसान मित्र AI हूँ।'
                    : language === 'te'
                    ? 'నమస్కారం రైతు మిత్రమా! నేను మీ వ్యవసాయ AI సహాయకుడిని.'
                    : `Namaste ${user?.name || 'Farmer'}! I am your Kisan Mitra AI Advisor.`}
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
                  {language === 'hi'
                    ? 'अपनी फसलों, मंडी भाव, मौसम की मार से सुरक्षा या सरकारी योजनाओं के बारे में कोई भी प्रश्न पूछें या माइक बटन दबाकर बोलें।'
                    : language === 'te'
                    ? 'మీ పంటల రక్షణ, మార్కెట్ ధరలు, వాతావరణం లేదా ప్రభుత్వ పథకాల గురించి ఏవైనా ప్రశ్నలను అడగండి.'
                    : 'Ask any question regarding crop care, weather protection, mandi rates, or government subsidies in English, Hindi, or Telugu.'}
                </p>
              </div>

              {/* Suggestions Grid */}
              <div className="space-y-2 text-left pt-2">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
                  Quick Topics to Ask:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {suggestedPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(prompt)}
                      className="text-left text-xs p-3 rounded-2xl bg-stone-50 hover:bg-kisan-50 hover:text-kisan-900 border border-stone-200 transition-colors leading-snug"
                    >
                      🌱 {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Chat Messages */}
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                    isUser
                      ? 'bg-stone-900 text-white'
                      : 'bg-kisan-700 text-white'
                  }`}
                >
                  {isUser ? <UserIcon className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 sm:p-5 shadow-sm text-sm sm:text-base leading-relaxed ${
                    isUser
                      ? 'bg-kisan-700 text-white rounded-tr-none'
                      : 'bg-stone-50 text-stone-900 border border-stone-200 rounded-tl-none space-y-3'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>

                  {/* Actions on Assistant Message: Voice read out */}
                  {!isUser && (
                    <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs text-stone-500">
                      <SpeechOutputButton text={msg.content} />
                      <span className="text-[10px] text-stone-400">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing/Thinking indicator */}
          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-2xl bg-kisan-700 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-stone-50 border border-stone-200 rounded-3xl rounded-tl-none p-4 flex items-center gap-2 text-stone-500 text-sm">
                <div className="w-2 h-2 rounded-full bg-kisan-600 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-kisan-600 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-kisan-600 animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs ml-1 font-medium">
                  {language === 'hi' ? 'उत्तर तैयार किया जा रहा है...' : language === 'te' ? 'సమాధానం సిద్ధం అవుతోంది...' : 'Analyzing agronomy guidelines...'}
                </span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-stone-50 border-t border-stone-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Voice Input Button */}
            <VoiceInputButton
              onTranscript={(text) => {
                setInputText(text);
                handleSendMessage(text);
              }}
            />

            {/* Text Input */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t('aiPlaceholder')}
              disabled={loading}
              className="flex-1 bg-white border border-stone-300 rounded-2xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-kisan-500 shadow-inner disabled:bg-stone-100"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="bg-kisan-700 hover:bg-kisan-800 disabled:opacity-50 text-white font-bold p-3 sm:px-5 sm:py-3 rounded-2xl text-sm transition-colors shadow-sm flex items-center gap-1.5"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">{t('aiSend')}</span>
            </button>
          </form>

          <div className="flex items-center justify-between pt-2 px-2 text-[11px] text-stone-400">
            <span>🎙️ Press microphone to speak in {language === 'hi' ? 'हिन्दी' : language === 'te' ? 'తెలుగు' : 'English'}</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-kisan-600" />
              Private & Isolated Chat
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
