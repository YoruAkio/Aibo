import { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
} from 'lucide-react';

export default function Dashboard() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Halo! Ada yang bisa Aibo bantu hari ini?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      title: 'Percakapan Hari Ini',
      timestamp: '2 menit lalu',
      active: true,
    },
  ]);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || isLoading) return;

    const userMessage = { id: Date.now(), role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // @note add loading message
    const loadingMessage = {
      id: 'loading',
      role: 'assistant',
      content: '...',
      isLoading: true,
    };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      // @note prepare messages for api call
      const currentMessages = [...messages, userMessage];
      const apiMessages = [
        {
          role: 'system',
          content:
            'You are Aibo, a helpful and friendly AI assistant. Respond in Indonesian language naturally and conversationally.',
        },
        ...currentMessages.map(msg => ({
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
      setMessages(prev =>
        prev.filter(msg => msg.id !== 'loading').concat(assistantMessage),
      );
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
      setMessages(prev =>
        prev.filter(msg => msg.id !== 'loading').concat(errorMessage),
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleChatSelect(chatId) {
    setChatHistory(prev =>
      prev.map(chat => ({ ...chat, active: chat.id === chatId })),
    );
    // @note reset to initial message when switching chats
    setMessages([
      {
        id: 1,
        role: 'assistant',
        content: 'Halo! Ada yang bisa Aibo bantu hari ini?',
      },
    ]);
  }

  function handleNewChat() {
    const newChat = {
      id: Date.now(),
      title: 'Percakapan Baru',
      timestamp: 'Sekarang',
      active: true,
    };
    setChatHistory(prev => [
      newChat,
      ...prev.map(chat => ({ ...chat, active: false })),
    ]);
    setMessages([
      {
        id: 1,
        role: 'assistant',
        content: 'Halo! Ada yang bisa Aibo bantu hari ini?',
      },
    ]);
  }

  function handleDeleteChat(chatId, e) {
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
        // @note reset messages for the new active chat
        setMessages([
          {
            id: 1,
            role: 'assistant',
            content: 'Halo! Ada yang bisa Aibo bantu hari ini?',
          },
        ]);
      }
      return filtered;
    });
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        {/* @note sidebar for chat history */}
        <Sidebar className="border-r border-border">
          <SidebarHeader className="border-b border-border">
            <div className="flex items-center gap-2 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
                  <Brain className="size-4 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-semibold text-sm">Aibo Dashboard</h1>
                  <p className="text-xs text-muted-foreground">AI Assistant</p>
                </div>
              </div>
            </div>
            <Button
              onClick={handleNewChat}
              className="mx-4 mb-2 justify-start gap-2"
              variant="outline"
            >
              <Plus className="size-4" />
              Percakapan Baru
            </Button>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>
                <History className="size-4" />
                Riwayat Chat
              </SidebarGroupLabel>
              <SidebarMenu>
                {chatHistory.map(chat => (
                  <SidebarMenuItem key={chat.id}>
                    <div className="flex items-center group w-full relative">
                      <SidebarMenuButton
                        isActive={chat.active}
                        onClick={() => handleChatSelect(chat.id)}
                        className="flex-1 hover:bg-sidebar-accent/50 transition-colors duration-200"
                      >
                        <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <MessageSquare className="size-4 text-primary" />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <div className="text-sm font-medium truncate leading-tight">
                            {chat.title}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {chat.timestamp}
                          </div>
                        </div>
                      </SidebarMenuButton>
                      {chatHistory.length > 1 && (
                        <div
                          className="size-8 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer hover:bg-destructive/10 absolute right-2"
                          onClick={e => handleDeleteChat(chat.id, e)}
                          title="Hapus percakapan"
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </div>
                      )}
                    </div>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* @note main chat area */}
        <SidebarInset className="flex flex-col h-screen">
          {/* @note fixed header */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-4 bg-background z-10">
            <SidebarTrigger className="ml-1" />
            <div className="flex items-center gap-2 flex-1">
              <h2 className="font-semibold">Ruang Obrolan</h2>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">Aktif</span>
            </div>
            <Button variant="ghost" size="sm">
              <Search className="size-4" />
            </Button>
          </header>

          {/* @note scrollable chat messages */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="flex flex-col gap-4 max-w-4xl mx-auto px-4 py-4">
                {messages.map(m => (
                  <div
                    key={m.id}
                    className={
                      m.role === 'user'
                        ? 'self-end max-w-[85%]'
                        : 'self-start max-w-[85%]'
                    }
                  >
                    <div className="flex items-start gap-3">
                      {m.role === 'assistant' && (
                        <Avatar className="size-8">
                          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                            <Brain className="size-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={
                          m.role === 'user'
                            ? 'rounded-2xl bg-primary text-primary-foreground px-4 py-3 shadow-sm'
                            : 'rounded-2xl bg-muted text-foreground px-4 py-3 shadow-sm'
                        }
                      >
                        {m.isLoading ? (
                          <div className="flex items-center gap-1">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                              <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                              <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                            </div>
                            <span className="text-sm text-muted-foreground ml-2">
                              Aibo sedang mengetik...
                            </span>
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap text-sm leading-relaxed">
                            {m.content}
                          </p>
                        )}
                      </div>
                      {m.role === 'user' && (
                        <Avatar className="size-8">
                          <AvatarFallback className="bg-secondary text-secondary-foreground text-sm">
                            U
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={endRef} />
              </div>
            </ScrollArea>
          </div>

          {/* @note fixed input area */}
          <div className="shrink-0 border-t border-border p-4 bg-background">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <Textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    placeholder="Ketik pesan Anda..."
                    className="resize-none min-h-12 max-h-32 pr-12"
                  />{' '}
                  <Button
                    onClick={handleSend}
                    size="sm"
                    className="absolute right-2 bottom-2 size-8"
                    disabled={!input.trim() || isLoading}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                    ) : (
                      <Send className="size-4" />
                    )}
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                {isLoading
                  ? 'Aibo sedang mengetik...'
                  : 'Tekan Enter untuk kirim, Shift + Enter untuk baris baru'}
              </p>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
