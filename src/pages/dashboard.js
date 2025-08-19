import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  MessageSquare,
  Plus,
  Search,
  Settings,
  User,
  Brain,
  Send,
  History,
  Trash2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BookOpen,
  Code,
  GraduationCap,
} from 'lucide-react';

export default function Dashboard() {
  const [isMounted, setIsMounted] = useState(false);

  const [activeTab, setActiveTab] = useState('Create');

  // @note sample questions organized by category
  const sampleQuestions = {
    Create: [
      'Buatkan cerita pendek tentang robot yang menemukan perasaan',
      'Buatkan rencana bisnis untuk kedai kopi dengan konsep eco-friendly',
      'Rancang konsep aplikasi mobile untuk belajar bahasa',
      'Berikan 5 ide kreatif untuk menulis novel fantasi',
    ],
    Explore: [
      'Jelaskan bagaimana cara kerja quantum computing dengan sederhana',
      'Apa saja tren terbaru dalam teknologi AI di tahun 2024?',
      'Jelaskan konsep metaverse dan dampaknya pada masa depan',
      'Sebutkan 5 sumber energi terbarukan yang paling efisien',
    ],
    Code: [
      'Jelaskan perbedaan antara var, let, dan const di JavaScript',
      'Buatkan contoh komponen React untuk menampilkan daftar tugas',
      'Jelaskan apa itu REST API dan berikan contoh penggunaannya',
      'Buatkan fungsi Python untuk mengurutkan array angka secara ascending',
    ],
    Learn: [
      'Jelaskan dasar-dasar machine learning untuk pemula',
      'Berikan 7 tips untuk meningkatkan kemampuan komunikasi',
      'Jelaskan strategi investasi yang aman untuk pemula',
      'Jelaskan proses fotosintesis dengan bahasa yang mudah dipahami',
    ],
  };

  // @note system prompt state with default value
  const [systemPrompt, setSystemPrompt] = useState(
    'You are Aibo, a helpful and friendly AI assistant. Respond in Indonesian language naturally and conversationally.',
  );
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);

  // @note initialize empty chat history - no default chat
  const [chatHistory, setChatHistory] = useState([]);

  // @note load from localStorage after component mounts
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('aibo-chat-history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setChatHistory(parsed);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    }
  }, []);

  // @note get current active chat and its messages
  const activeChat = useMemo(
    () => chatHistory.find(chat => chat.active),
    [chatHistory],
  );

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef(null);

  // @note save chat history to localStorage whenever it changes
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('aibo-chat-history', JSON.stringify(chatHistory));
    }
  }, [chatHistory, isMounted]);

  // @note update messages when active chat changes
  useEffect(() => {
    if (activeChat) {
      setMessages(activeChat.messages || []);
    } else {
      setMessages([]);
    }
  }, [activeChat]);

  // @note auto scroll to bottom when messages change
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // @note generate chat title from first user message
  const generateChatTitle = useCallback(messages => {
    const firstUserMessage = messages.find(msg => msg.role === 'user');
    if (firstUserMessage) {
      const title = firstUserMessage.content.slice(0, 20);
      return title.length < firstUserMessage.content.length
        ? `${title}...`
        : title;
    }
    return 'Percakapan Baru';
  }, []);

  // @note update chat history with current messages
  const updateChatMessages = useCallback(
    newMessages => {
      setChatHistory(prev => {
        const updated = prev.map(chat =>
          chat.active
            ? {
                ...chat,
                messages: newMessages,
                title: generateChatTitle(newMessages),
              }
            : chat,
        );
        // @note immediately save to localStorage to ensure persistence
        if (isMounted) {
          localStorage.setItem('aibo-chat-history', JSON.stringify(updated));
        }
        return updated;
      });
    },
    [isMounted, generateChatTitle],
  );

  // @note send message to ai with system prompt
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { id: Date.now(), text: input, sender: 'user' };
    const currentMessages = [...getCurrentMessages(), userMessage];
    updateChatMessages(activeChatId, currentMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          system_prompt: systemPrompt, // @note include system prompt
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // @note add ai response to messages
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content:
          data.reply?.response ||
          data.message ||
          'Maaf, terjadi kesalahan. Silakan coba lagi.',
      };

      // @note remove loading message and add real response
      const finalMessages = [...newMessages, assistantMessage];
      setMessages(finalMessages);
      updateChatMessages(finalMessages);
    } catch (error) {
      console.error('Error calling AI API:', error);

      // @note add error message
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content:
          'Maaf, terjadi kesalahan saat menghubungi AI. Silakan coba lagi.',
      };

      // @note remove loading message and add error response
      const finalMessages = [...newMessages, errorMessage];
      setMessages(finalMessages);
      updateChatMessages(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    // @note create new chat if no active chat exists
    if (!activeChat) {
      const newChatId = Math.floor(Math.random() * 1000000) + Date.now();
      const currentTime = new Date();

      const newChat = {
        id: newChatId,
        title: 'Percakapan Baru',
        createdAt: currentTime.toISOString(),
        active: true,
        messages: [],
      };

      setChatHistory([newChat]);
    }

    const userMessage = { id: Date.now(), role: 'user', content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    // @note add loading message
    const loadingMessage = {
      id: 'loading',
      role: 'assistant',
      content: '...',
      isLoading: true,
    };
    const messagesWithLoading = [...newMessages, loadingMessage];
    setMessages(messagesWithLoading);

    try {
      // @note prepare messages for api call
      const apiMessages = [
        {
          role: 'system',
          content: systemPrompt,
        },
        ...newMessages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
      ];

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: apiMessages,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // @note add ai response to messages
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content:
          data.reply?.response ||
          data.message ||
          'Maaf, terjadi kesalahan. Silakan coba lagi.',
      };

      // @note remove loading message and add real response
      const finalMessages = [...newMessages, assistantMessage];
      setMessages(finalMessages);
      updateChatMessages(finalMessages);
    } catch (error) {
      console.error('Error calling AI API:', error);

      // @note add error message
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content:
          'Maaf, terjadi kesalahan saat menghubungi AI. Silakan coba lagi.',
      };

      // @note remove loading message and add error response
      const finalMessages = [...newMessages, errorMessage];
      setMessages(finalMessages);
      updateChatMessages(finalMessages);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, updateChatMessages, activeChat]);

  const handleKeyDown = useCallback(
    e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const handleChatSelect = useCallback(chatId => {
    setChatHistory(prev =>
      prev.map(chat => ({ ...chat, active: chat.id === chatId })),
    );
  }, []);

  const handleNewChat = useCallback(() => {
    const newChatId = Math.floor(Math.random() * 1000000) + Date.now();
    const currentTime = new Date();

    const newChat = {
      id: newChatId,
      title: 'Percakapan Baru',
      createdAt: currentTime.toISOString(),
      active: true,
      messages: [],
    };
    setChatHistory(prev => [
      newChat,
      ...prev.map(chat => ({ ...chat, active: false })),
    ]);
  }, []);

  const handleDeleteChat = useCallback(
    (chatId, e) => {
      e.stopPropagation();
      // @note prevent deleting if only one chat remains
      if (chatHistory.length <= 1) return;

      setChatHistory(prev => {
        const filtered = prev.filter(chat => chat.id !== chatId);
        // @note if we deleted the active chat, make the first remaining chat active
        const deletedChatWasActive = prev.find(
          chat => chat.id === chatId,
        )?.active;
        if (deletedChatWasActive && filtered.length > 0) {
          filtered[0].active = true;
        }
        return filtered;
      });
    },
    [chatHistory.length],
  );

  // @note handle system prompt updates
  const handleSystemPromptChange = value => {
    setSystemPrompt(value);
  };

  const togglePromptEditor = () => {
    setIsEditingPrompt(!isEditingPrompt);
  };

  // @note group chats by date
  const groupChatsByDate = useCallback(chats => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const groups = {
      today: [],
      yesterday: [],
      older: [],
    };

    chats.forEach(chat => {
      const chatDate = new Date(chat.createdAt || Date.now());
      const isToday = chatDate.toDateString() === today.toDateString();
      const isYesterday = chatDate.toDateString() === yesterday.toDateString();

      if (isToday) {
        groups.today.push(chat);
      } else if (isYesterday) {
        groups.yesterday.push(chat);
      } else {
        groups.older.push(chat);
      }
    });

    return groups;
  }, []);

  // @note memoized grouped chats
  const groupedChats = useMemo(
    () => groupChatsByDate(chatHistory),
    [chatHistory, groupChatsByDate],
  );

  // @note prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return (
      <div className="flex h-screen w-full bg-background items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
            <Brain className="size-4 text-primary-foreground" />
          </div>
          <span className="text-sm text-muted-foreground">Loading Aibo...</span>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        {/* @note sidebar for chat history */}
        <Sidebar className="border-r border-border bg-sidebar">
          <SidebarHeader className="border-b border-sidebar-border bg-sidebar">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Brain className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-semibold text-sm text-sidebar-foreground">
                  Aibo Dashboard
                </h1>
                <p className="text-xs text-sidebar-foreground/70">
                  AI Assistant
                </p>
              </div>
            </div>
            <div className="px-3 pb-3">
              <Button
                onClick={handleNewChat}
                className="w-full justify-start gap-2 h-9 text-sm bg-sidebar-accent hover:bg-sidebar-accent/80 text-sidebar-accent-foreground border border-sidebar-border"
                variant="outline"
              >
                <Plus className="w-4 h-4" />
                Percakapan Baru
              </Button>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <div className="px-2">
                {chatHistory.length === 0 ? (
                  <div className="px-2 py-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                      <MessageSquare className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Belum ada riwayat chat
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      Mulai percakapan dengan mengetik pesan
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {groupedChats.today.length > 0 && (
                      <div>
                        <h3 className="text-xs font-medium text-muted-foreground px-2 mb-2">
                          Today
                        </h3>
                        <div className="space-y-1">
                          {groupedChats.today.map(chat => (
                            <div key={chat.id} className="group relative">
                              <button
                                onClick={() => handleChatSelect(chat.id)}
                                className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 hover:bg-sidebar-accent/50 ${
                                  chat.active
                                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                                    : ''
                                }`}
                              >
                                <span className="text-sm truncate">
                                  {chat.title}
                                </span>
                              </button>
                              {chatHistory.length > 1 && (
                                <button
                                  onClick={e => handleDeleteChat(chat.id, e)}
                                  className="absolute top-1/2 right-2 -translate-y-1/2 w-5 h-5 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                                  title="Hapus percakapan"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {groupedChats.yesterday.length > 0 && (
                      <div>
                        <h3 className="text-xs font-medium text-muted-foreground px-2 mb-2">
                          Yesterday
                        </h3>
                        <div className="space-y-1">
                          {groupedChats.yesterday.map(chat => (
                            <div key={chat.id} className="group relative">
                              <button
                                onClick={() => handleChatSelect(chat.id)}
                                className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 hover:bg-sidebar-accent/50 ${
                                  chat.active
                                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                                    : ''
                                }`}
                              >
                                <span className="text-sm truncate">
                                  {chat.title}
                                </span>
                              </button>
                              {chatHistory.length > 1 && (
                                <button
                                  onClick={e => handleDeleteChat(chat.id, e)}
                                  className="absolute top-1/2 right-2 -translate-y-1/2 w-5 h-5 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                                  title="Hapus percakapan"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {groupedChats.older.length > 0 && (
                      <div>
                        <h3 className="text-xs font-medium text-muted-foreground px-2 mb-2">
                          Previous 7 days
                        </h3>
                        <div className="space-y-1">
                          {groupedChats.older.map(chat => (
                            <div key={chat.id} className="group relative">
                              <button
                                onClick={() => handleChatSelect(chat.id)}
                                className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 hover:bg-sidebar-accent/50 ${
                                  chat.active
                                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                                    : ''
                                }`}
                              >
                                <span className="text-sm truncate">
                                  {chat.title}
                                </span>
                              </button>
                              {chatHistory.length > 1 && (
                                <button
                                  onClick={e => handleDeleteChat(chat.id, e)}
                                  className="absolute top-1/2 right-2 -translate-y-1/2 w-5 h-5 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                                  title="Hapus percakapan"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* @note main chat area */}
        <SidebarInset className="flex flex-col h-screen overflow-hidden">
          {/* @note fixed header */}
          <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-3 bg-background z-10">
            <SidebarTrigger className="ml-1" />
            <div className="flex items-center gap-2 flex-1">
              <h2 className="font-semibold text-sm">Ruang Obrolan</h2>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">Aktif</span>
            </div>
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingPrompt(!isEditingPrompt)}
                className="h-8 w-8 p-0"
              >
                <Settings className="size-3" />
              </Button>
            </div>
          </header>

          {/* @note system prompt editor - fixed */}
          {isEditingPrompt && (
            <div className="p-3 border-b border-border bg-muted/30 flex-shrink-0">
              <label className="block text-xs font-medium text-foreground mb-1">
                System Prompt
              </label>
              <Textarea
                value={systemPrompt}
                onChange={e => handleSystemPromptChange(e.target.value)}
                className="w-full text-sm"
                placeholder="Enter system prompt..."
                rows={2}
              />
            </div>
          )}

          {/* @note scrollable chat messages only */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="flex flex-col gap-3 max-w-3xl mx-auto px-3 py-3">
                {chatHistory.length === 0 ||
                (activeChat && messages.length === 0) ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <h1 className="text-4xl font-bold mb-6 text-foreground">
                      How can I help you?
                    </h1>

                    {/* @note category tabs */}
                    <div className="flex flex-wrap gap-2 mb-8 justify-center">
                      {Object.keys(sampleQuestions).map(category => {
                        const icons = {
                          Create: Sparkles,
                          Explore: BookOpen,
                          Code: Code,
                          Learn: GraduationCap,
                        };
                        const Icon = icons[category];

                        return (
                          <button
                            key={category}
                            onClick={() => setActiveTab(category)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                              activeTab === category
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'border-border hover:bg-muted/50'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="text-sm">{category}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* @note sample questions for active tab */}
                    <div className="space-y-3 w-full max-w-lg">
                      {sampleQuestions[activeTab].map((question, index) => (
                        <button
                          key={index}
                          onClick={() => setInput(question)}
                          className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                        >
                          <span className="text-sm text-muted-foreground">
                            {question}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map(m => (
                    <div
                      key={m.id}
                      className={
                        m.role === 'user'
                          ? 'self-end max-w-[80%]'
                          : 'self-start max-w-[80%]'
                      }
                    >
                      <div className="flex items-start gap-2">
                        {m.role === 'assistant' && (
                          <Avatar className="size-6">
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                              <Brain className="size-3" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={
                            m.role === 'user'
                              ? 'rounded-xl bg-primary text-primary-foreground px-3 py-2 shadow-sm'
                              : 'rounded-xl bg-muted text-foreground px-3 py-2 shadow-sm'
                          }
                        >
                          {m.isLoading ? (
                            <div className="flex items-center gap-1">
                              <div className="flex space-x-1">
                                <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"></div>
                              </div>
                              <span className="text-xs text-muted-foreground ml-2">
                                Aibo sedang mengetik...
                              </span>
                            </div>
                          ) : (
                            <p className="whitespace-pre-wrap text-xs leading-relaxed">
                              {m.content}
                            </p>
                          )}
                        </div>
                        {m.role === 'user' && (
                          <Avatar className="size-6">
                            <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                              U
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>
                  ))
                )}
                <div ref={endRef} />
              </div>
            </ScrollArea>
          </div>

          {/* @note fixed input area */}
          <div className="shrink-0 border-t border-border p-3 bg-background">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <Textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    placeholder="Ketik pesan Anda..."
                    className="resize-none min-h-10 max-h-24 pr-10 text-sm"
                  />{' '}
                  <Button
                    onClick={handleSend}
                    size="sm"
                    className="absolute right-1 bottom-1 size-6"
                    disabled={!input.trim() || isLoading}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-3 w-3 border-2 border-current border-t-transparent" />
                    ) : (
                      <Send className="size-3" />
                    )}
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1 text-center">
                {isLoading
                  ? 'Aibo sedang mengetik...'
                  : chatHistory.length === 0
                  ? 'Mulai percakapan pertama Anda dengan Aibo'
                  : 'Tekan Enter untuk kirim, Shift + Enter untuk baris baru'}
              </p>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
