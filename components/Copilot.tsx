import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { generateCopilotResponse } from '../services/geminiService';
import { Bot, X, Send, ChevronRight, FileText, AlertTriangle, ShieldAlert, Sparkles } from 'lucide-react';
import { ChatMessage, AppTab } from '../types';

interface CopilotProps {
  currentTab: AppTab;
}

export const Copilot: React.FC<CopilotProps> = ({ currentTab }) => {
  const { people, selectedPersonId, t, language } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize greeting message when language changes
  useEffect(() => {
      setMessages([{ 
          id: 'init', 
          role: 'model', 
          text: t('cp_greeting'),
          suggestions: [t('cp_btn_summarize'), t('cp_btn_risks')] 
      }]);
  }, [language, t]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Determine Context
    let contextData: any = null;
    let contextType: 'directory' | 'person' = 'directory';

    if (currentTab === AppTab.PERSON_360 && selectedPersonId) {
      contextType = 'person';
      contextData = people.find(p => p.residency_id === selectedPersonId);
    } else {
        // Pass summary stats for directory view
        contextData = {
            totalPeople: people.length,
            flaggedCount: people.filter(p => p.flags.length > 0).length,
            flagTypes: ['Suspended License', 'Flagged Vehicle', 'Address Mismatch']
        };
    }

    const history = messages.filter(m => m.id !== 'init').concat(userMsg).map(m => ({ role: m.role, text: m.text }));
    
    // Call Gemini with language
    const responseText = await generateCopilotResponse(history, { type: contextType, data: contextData }, language);
    
    const botMsg: ChatMessage = { 
      id: (Date.now() + 1).toString(), 
      role: 'model', 
      text: responseText
    };

    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  const handleSuggestionClick = (text: string) => {
    handleSend(text);
  };

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl flex items-center justify-center transition-all duration-300 z-30 hover:scale-105 group ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'} rtl:left-6 rtl:right-auto`}
      >
        <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20 group-hover:opacity-40"></div>
        <Bot size={28} />
      </button>

      {/* Drawer Container */}
      <div className={`fixed right-0 top-16 bottom-0 bg-white border-l border-slate-200 shadow-2xl transition-transform duration-300 z-40 flex flex-col w-96 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} rtl:left-0 rtl:right-auto rtl:border-l-0 rtl:border-r rtl:${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        {/* Header */}
        <div className="p-4 border-b border-slate-100 bg-navy-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-full">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{t('cp_title')}</h3>
              <p className="text-xs text-slate-400">{t('cp_genai')}</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/10 rounded-full transition-colors text-slate-300 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-lg text-sm shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-navy-800 text-white rounded-br-none rtl:rounded-bl-none rtl:rounded-br-lg' 
                  : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none rtl:rounded-br-none rtl:rounded-bl-lg'
              }`}>
                {/* Simple Markdown Rendering Support (Bold/Bullets) */}
                <div className="prose prose-sm" dangerouslySetInnerHTML={{ 
                    __html: msg.text
                    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
                    .replace(/\n/g, '<br/>') 
                }} />
                
                {/* Suggestions Chips */}
                {msg.suggestions && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {msg.suggestions.map(s => (
                      <button 
                        key={s} 
                        onClick={() => handleSuggestionClick(s)}
                        className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100 hover:bg-blue-100 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
             <div className="flex justify-start">
               <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm rounded-bl-none flex items-center gap-2 rtl:rounded-br-none rtl:rounded-bl-lg">
                 <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                 <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100" />
                 <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200" />
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions (Context Aware) */}
        {!isLoading && (
          <div className="px-4 py-2 bg-white border-t border-slate-100 overflow-x-auto whitespace-nowrap scrollbar-hide">
             <div className="flex gap-2">
               <ActionBtn icon={<FileText size={12}/>} text={t('cp_btn_summarize')} onClick={() => handleSend("Summarize this profile in 5 bullets.")} />
               <ActionBtn icon={<ShieldAlert size={12}/>} text={t('cp_btn_risks')} onClick={() => handleSend("Identify any risks or flags in this profile.")} />
               <ActionBtn icon={<AlertTriangle size={12}/>} text={t('cp_btn_inconsistencies')} onClick={() => handleSend("Are there any inconsistencies in the data?")} />
             </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-200">
          <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 border border-slate-200 focus-within:ring-2 focus-within:ring-navy-800/20 transition-all">
            <input 
              type="text" 
              className="flex-1 bg-transparent text-sm focus:outline-none text-slate-800 placeholder:text-slate-400"
              placeholder={t('cp_placeholder')}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            />
            <button 
              onClick={() => handleSend(input)}
              disabled={isLoading || !input.trim()}
              className="text-navy-800 hover:text-blue-700 disabled:opacity-50 rtl:rotate-180"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const ActionBtn = ({icon, text, onClick}: {icon: React.ReactNode, text: string, onClick: () => void}) => (
  <button onClick={onClick} className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full text-xs font-medium text-slate-700 transition-colors">
    {icon} {text}
  </button>
);