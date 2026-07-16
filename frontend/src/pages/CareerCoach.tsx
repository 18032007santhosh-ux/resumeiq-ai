import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { Navbar } from '../components/dashboard/Navbar';
import { 
  Compass, Send, Plus, Trash2, Edit2, Check, X as CloseIcon, 
  Bot, User, Sparkles, AlertCircle, RefreshCw, ChevronRight, HelpCircle,
  History as HistoryIcon 
} from 'lucide-react';
import { 
  getCareerHistory, getCareerConversation, sendMessage, 
  startNewConversation, renameConversation, deleteConversation 
} from '../services/careerService';

// Basic markdown formatter to keep interface clean
const renderMessageContent = (content: string) => {
  const lines = content.split('\n');
  return lines.map((line, index) => {
    let formattedLine = line;
    
    // Bold formatting
    const boldRegex = /\*\*(.*?)\*\*/g;
    formattedLine = formattedLine.replace(boldRegex, '<strong class="font-bold text-white">$1</strong>');
    
    // Inline code formatting
    const codeRegex = /`(.*?)`/g;
    formattedLine = formattedLine.replace(codeRegex, '<code class="px-1.5 py-0.5 bg-slate-950/80 rounded text-indigo-300 font-mono text-xs">$1</code>');

    // Headings
    if (line.startsWith('### ')) {
      return (
        <h4 key={index} className="text-base font-bold text-slate-100 mt-4 mb-2 first:mt-0" dangerouslySetInnerHTML={{ __html: formattedLine.replace('### ', '') }} />
      );
    }
    if (line.startsWith('## ')) {
      return (
        <h3 key={index} className="text-lg font-extrabold text-indigo-400 mt-5 mb-2.5 first:mt-0" dangerouslySetInnerHTML={{ __html: formattedLine.replace('## ', '') }} />
      );
    }
    
    // Bullet lists
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      const bulletText = line.trim().replace(/^[-*]\s+/, '');
      let formattedBullet = bulletText.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-100">$1</strong>');
      formattedBullet = formattedBullet.replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 bg-slate-950/80 rounded text-indigo-300 font-mono text-xs">$1</code>');
      return (
        <ul key={index} className="list-disc pl-5 space-y-1.5 my-1.5 text-slate-300">
          <li dangerouslySetInnerHTML={{ __html: formattedBullet }} />
        </ul>
      );
    }
    
    // Numbered lists
    if (/^\d+\.\s+/.test(line.trim())) {
      const numText = line.trim().replace(/^\d+\.\s+/, '');
      let formattedNum = numText.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-100">$1</strong>');
      formattedNum = formattedNum.replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 bg-slate-950/80 rounded text-indigo-300 font-mono text-xs">$1</code>');
      return (
        <ol key={index} className="list-decimal pl-5 space-y-1.5 my-1.5 text-slate-300">
          <li dangerouslySetInnerHTML={{ __html: formattedNum }} />
        </ol>
      );
    }

    if (line.trim() === '') {
      return <div key={index} className="h-3" />;
    }

    return (
      <p key={index} className="leading-relaxed mb-2 text-slate-300 text-sm md:text-base" dangerouslySetInnerHTML={{ __html: formattedLine }} />
    );
  });
};

export const CareerCoach: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [activeSession, setActiveSession] = useState<any | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [historyOpen, setHistoryOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Suggested Prompts
  const suggestedQuestions = [
    { label: 'Improve Resume', text: 'How can I improve my resume to match high-paying jobs in my field?' },
    { label: 'Boost ATS Score', text: 'Why is my ATS score low and what specific changes can I make to increase it?' },
    { label: 'Learning Roadmap', text: 'Can you build a customized learning roadmap for missing skills?' },
    { label: 'Certifications', text: 'Which industry-recognized certifications should I focus on next?' },
    { label: 'Interview Prep', text: 'How should I prepare for technical interviews based on my experience?' },
    { label: 'Skill Gap Analysis', text: 'Which of my missing keywords are the most critical to add first?' }
  ];

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [activeSession?.messages, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
      const res = await getCareerHistory();
      if (res.status === 'success') {
        setHistory(res.data || []);
      }
    } catch (err: any) {
      console.error('Failed to fetch career history', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const loadConversation = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await getCareerConversation(id);
      if (res.status === 'success') {
        setActiveSession(res.data);
      }
    } catch (err: any) {
      setError('Failed to load conversation details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await startNewConversation();
      if (res.status === 'success') {
        setActiveSession(res.data);
        await fetchHistory();
      }
    } catch (err: any) {
      setError('Failed to start a new coaching session.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    const trimmedMessage = textToSend.trim();
    if (!trimmedMessage) return;

    setInputMessage('');
    setError(null);
    setLoading(true);

    // Optimistically update UI if session exists
    let tempSession = activeSession ? { ...activeSession } : null;
    if (tempSession) {
      tempSession.messages = [
        ...tempSession.messages,
        { role: 'user', content: trimmedMessage, timestamp: new Date().toISOString() }
      ];
      setActiveSession(tempSession);
    }

    try {
      const res = await sendMessage(trimmedMessage, activeSession?._id);
      if (res.status === 'success') {
        setActiveSession(res.data);
        await fetchHistory();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to get career guidance. Please try again.');
      console.error(err);
      // Rollback optimism
      if (tempSession) {
        tempSession.messages.pop();
        setActiveSession(tempSession);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this conversation?')) return;

    try {
      const res = await deleteConversation(id);
      if (res.status === 'success') {
        if (activeSession?._id === id) {
          setActiveSession(null);
        }
        await fetchHistory();
      }
    } catch (err) {
      console.error('Failed to delete chat', err);
    }
  };

  const startRename = (id: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(id);
    setEditingTitle(currentTitle);
  };

  const saveRename = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editingTitle.trim()) return;

    try {
      const res = await renameConversation(id, editingTitle.trim());
      if (res.status === 'success') {
        setEditingId(null);
        if (activeSession?._id === id) {
          setActiveSession({ ...activeSession, title: editingTitle.trim() });
        }
        await fetchHistory();
      }
    } catch (err) {
      console.error('Failed to rename chat', err);
    }
  };

  return (
    <div className="flex h-screen bg-[#070913] text-slate-100 overflow-hidden font-sans selection:bg-indigo-500/30">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col h-full min-h-0 relative overflow-hidden bg-slate-950/50">
        {/* Ambient background glows */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <div className="flex-1 flex overflow-hidden z-10 min-h-0">
          {/* Conversation History Sidebar */}
          <div className="hidden md:flex flex-col w-80 bg-slate-900/40 border-r border-slate-800/80 backdrop-blur-md shrink-0 min-h-0">
            <div className="p-4 border-b border-slate-850 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-400">History</span>
              <button 
                onClick={handleCreateNew}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                New Chat
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
              {historyLoading ? (
                <div className="flex justify-center items-center py-10">
                  <RefreshCw className="w-5 h-5 text-indigo-400 animate-spin" />
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">
                  No coaching history yet.
                </div>
              ) : (
                history.map((chat) => (
                  <div
                    key={chat._id}
                    onClick={() => loadConversation(chat._id)}
                    className={`group relative flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      activeSession?._id === chat._id
                        ? 'bg-indigo-500/10 border-indigo-500/30 text-white'
                        : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    {editingId === chat._id ? (
                      <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          className="bg-slate-950 text-white text-xs px-2 py-1 rounded border border-slate-800 focus:outline-none focus:border-indigo-500 flex-1"
                        />
                        <button onClick={(e) => saveRename(chat._id, e)} className="p-1 text-emerald-400 hover:bg-slate-800 rounded">
                          <Check className="w-3 h-3" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setEditingId(null); }} className="p-1 text-rose-400 hover:bg-slate-800 rounded">
                          <CloseIcon className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-xs font-medium truncate pr-16">{chat.title}</span>
                        <div className="absolute right-2 opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                          <button 
                            onClick={(e) => startRename(chat._id, chat.title, e)}
                            className="p-1 text-slate-400 hover:text-indigo-400 hover:bg-slate-850 rounded-lg transition"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={(e) => handleDelete(chat._id, e)}
                            className="p-1 text-slate-400 hover:text-red-400 hover:bg-slate-850 rounded-lg transition"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat main space */}
          <div className="flex-1 flex flex-col h-full min-h-0 bg-[#080b16]/30">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-800/80 bg-slate-900/20 backdrop-blur-md flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                  <Compass className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">AI Career Coach</h2>
                  <p className="text-xs text-slate-400">Get context-aware career and ATS guidance</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setHistoryOpen(true)}
                  className="md:hidden flex items-center justify-center p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg transition"
                  title="Chat History"
                >
                  <HistoryIcon className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleCreateNew}
                  className="md:hidden flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Chat
                </button>
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar">
              {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/25 rounded-2xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div className="text-sm text-rose-350">
                    <p className="font-semibold">Error occurred</p>
                    <p>{error}</p>
                  </div>
                </div>
              )}

              {!activeSession || activeSession.messages.length === 0 ? (
                // Empty state / welcome prompts
                <div className="max-w-3xl mx-auto py-10 md:py-16 space-y-8">
                  <div className="text-center space-y-3">
                    <div className="inline-flex p-4 bg-indigo-500/10 border border-indigo-500/25 rounded-3xl mb-2 text-indigo-400 shadow-xl shadow-indigo-500/5">
                      <Compass className="w-8 h-8 animate-pulse" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-extrabold text-white">Ask your Career Coach</h3>
                    <p className="text-sm text-slate-400 max-w-lg mx-auto">
                      Receive personalized learning roadmaps, resume improvement plans, and target job tips based on your profile metadata.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {suggestedQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(q.text)}
                        className="group flex items-start justify-between p-4 bg-slate-900/30 hover:bg-indigo-500/5 border border-slate-800/80 hover:border-indigo-500/20 rounded-2xl text-left transition-all duration-350 cursor-pointer shadow-md"
                      >
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 text-purple-400" />
                            {q.label}
                          </span>
                          <p className="text-xs md:text-sm text-slate-400 group-hover:text-slate-200 transition-colors leading-relaxed">
                            {q.text}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors mt-0.5 shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>

                  <div className="bg-slate-900/20 border border-slate-800/60 p-4 rounded-2xl text-center flex items-center justify-center gap-2 text-xs text-slate-500">
                    <HelpCircle className="w-4 h-4 text-slate-600" />
                    First question automatically creates and saves your conversation session.
                  </div>
                </div>
              ) : (
                // Messages List
                <div className="max-w-4xl mx-auto space-y-6">
                  {activeSession.messages.map((msg: any, idx: number) => {
                    const isUser = msg.role === 'user';
                    return (
                      <div
                        key={idx}
                        className={`flex gap-4 items-start ${isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        {/* Bot Avatar */}
                        {!isUser && (
                          <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0 shadow-lg mt-1">
                            <Bot className="w-4 h-4 text-indigo-400" />
                          </div>
                        )}

                        <div className={`max-w-[85%] rounded-3xl p-4 md:p-5 border shadow-lg ${
                          isUser
                            ? 'bg-indigo-600/10 border-indigo-500/35 text-slate-100 rounded-tr-none'
                            : 'bg-slate-900/30 border-slate-800/80 text-slate-100 rounded-tl-none'
                        }`}>
                          {/* Message meta */}
                          <div className="flex items-center gap-2 mb-2 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                            <span>{isUser ? 'You' : 'Career Coach'}</span>
                            <span>•</span>
                            <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>

                          <div className="space-y-1">
                            {isUser ? (
                              <p className="text-sm md:text-base text-slate-200 leading-relaxed white-space-pre-wrap">{msg.content}</p>
                            ) : (
                              renderMessageContent(msg.content)
                            )}
                          </div>
                        </div>

                        {/* User Avatar */}
                        {isUser && (
                          <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 shadow-lg mt-1">
                            <User className="w-4 h-4 text-slate-400" />
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Typing animation indicator */}
                  {loading && (
                    <div className="flex gap-4 items-start justify-start">
                      <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0 animate-pulse">
                        <Bot className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div className="bg-slate-900/30 border border-slate-800/80 rounded-3xl rounded-tl-none p-4 shadow-lg flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-4 md:p-6 border-t border-slate-800/80 bg-[#070913]/40 backdrop-blur-md shrink-0">
              <div className="max-w-4xl mx-auto">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage(inputMessage);
                  }}
                  className="flex gap-3 bg-slate-950/80 border border-slate-850 p-2 rounded-2xl shadow-xl focus-within:border-indigo-500/60 transition"
                >
                  <textarea
                    rows={1}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(inputMessage);
                      }
                    }}
                    placeholder="Ask about improving resume, learning roadmap, job targets..."
                    className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none custom-scrollbar min-h-[38px] max-h-[120px]"
                  />
                  <button
                    type="submit"
                    disabled={loading || !inputMessage.trim()}
                    className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white rounded-xl shadow-lg transition flex items-center justify-center self-end cursor-pointer disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile History Drawer overlay */}
      {historyOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setHistoryOpen(false)}
          />
          
          {/* Drawer Content */}
          <div className="relative w-80 max-w-[85vw] h-full bg-[#090d1a] border-l border-slate-800/80 flex flex-col z-10 animate-fade-in shadow-2xl">
            <div className="p-4 border-b border-slate-850 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-400">Chat History</span>
              <button 
                onClick={() => setHistoryOpen(false)}
                className="p-1 hover:bg-slate-850 rounded-lg text-slate-400 hover:text-white"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
              {historyLoading ? (
                <div className="flex justify-center items-center py-10">
                  <RefreshCw className="w-5 h-5 text-indigo-400 animate-spin" />
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">
                  No coaching history yet.
                </div>
              ) : (
                history.map((chat) => (
                  <div
                    key={chat._id}
                    onClick={() => {
                      loadConversation(chat._id);
                      setHistoryOpen(false); // Close drawer after selection
                    }}
                    className={`group relative flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      activeSession?._id === chat._id
                        ? 'bg-indigo-500/10 border-indigo-500/30 text-white'
                        : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    {editingId === chat._id ? (
                      <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          className="bg-slate-950 text-white text-xs px-2 py-1 rounded border border-slate-800 focus:outline-none focus:border-indigo-500 flex-1"
                        />
                        <button onClick={(e) => saveRename(chat._id, e)} className="p-1 text-emerald-400 hover:bg-slate-800 rounded">
                          <Check className="w-3 h-3" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setEditingId(null); }} className="p-1 text-rose-400 hover:bg-slate-800 rounded">
                          <CloseIcon className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-xs font-medium truncate pr-16">{chat.title}</span>
                        <div className="absolute right-2 opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                          <button 
                            onClick={(e) => startRename(chat._id, chat.title, e)}
                            className="p-1 text-slate-400 hover:text-indigo-400 hover:bg-slate-850 rounded-lg transition"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={(e) => handleDelete(chat._id, e)}
                            className="p-1 text-slate-400 hover:text-red-400 hover:bg-slate-850 rounded-lg transition"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
