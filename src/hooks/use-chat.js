import { useState, useEffect, useCallback, useMemo } from 'react';

// @note backend api base url
// const API_BASE_URL = 'https://aibo-backend.yuv.workers.dev/api';
const API_BASE_URL = 'http://localhost:8787/api';

// @note custom hook for chat management
export function useChatManager() {
  const [isMounted, setIsMounted] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Create');

  // @note system prompt state with default value
  const [systemPrompt, setSystemPrompt] = useState(
    'You are Aibo, a helpful and friendly AI assistant. Respond in Indonesian language naturally and conversationally.',
  );
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);

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

  // @note generate chat title from first user message
  const generateChatTitle = useCallback(async (chatId, messages) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chats/${chatId}/title`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.title || 'Percakapan Baru';
      }
    } catch (error) {
      console.error('Error generating chat title:', error);
    }

    // @note fallback to local generation
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
    (newMessages, chatId = null) => {
      setChatHistory(prev => {
        const updated = prev.map(chat =>
          chat.active
            ? {
                ...chat,
                messages: newMessages,
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
    [isMounted],
  );

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

  return {
    // @note state
    isMounted,
    chatHistory,
    setChatHistory,
    messages,
    setMessages,
    input,
    setInput,
    isLoading,
    setIsLoading,
    activeTab,
    setActiveTab,
    systemPrompt,
    setSystemPrompt,
    isEditingPrompt,
    setIsEditingPrompt,

    // @note computed values
    activeChat,
    groupedChats,

    // @note functions
    updateChatMessages,
    generateChatTitle,
  };
}

// @note custom hook for chat actions
export function useChatActions({
  input,
  setInput,
  isLoading,
  setIsLoading,
  messages,
  setMessages,
  activeChat,
  setChatHistory,
  updateChatMessages,
  generateChatTitle,
  systemPrompt,
}) {
  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { id: Date.now(), role: 'user', content: input.trim() };
    let newMessages;
    let chatId;

    setInput('');
    setIsLoading(true);

    // @note create new chat if no active chat exists
    if (!activeChat) {
      chatId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const currentTime = new Date();

      // @note start with the user message
      newMessages = [userMessage];

      // @note add loading message immediately
      const loadingMessage = {
        id: 'loading',
        role: 'assistant',
        content: '...',
        isLoading: true,
      };
      const messagesWithLoading = [...newMessages, loadingMessage];

      const newChat = {
        id: chatId,
        title: 'Percakapan Baru',
        createdAt: currentTime.toISOString(),
        active: true,
        messages: messagesWithLoading,
      };

      // @note update chat history and messages state immediately
      setChatHistory(prev => [
        newChat,
        ...prev.map(chat => ({ ...chat, active: false })),
      ]);
      setMessages(messagesWithLoading);
    } else {
      chatId = activeChat.id;
      newMessages = [...messages, userMessage];

      // @note add loading message immediately for existing chat
      const loadingMessage = {
        id: 'loading',
        role: 'assistant',
        content: '...',
        isLoading: true,
      };
      const messagesWithLoading = [...newMessages, loadingMessage];
      setMessages(messagesWithLoading);
    }

    try {
      // @note prepare message parts for backend api
      const parts = [{ text: userMessage.content }];

      console.log('Sending to backend:', {
        parts,
        chatId,
        url: `${API_BASE_URL}/chats/${chatId}/messages/stream`,
      });

      // @note use streaming endpoint
      const streamResponse = await fetch(
        `${API_BASE_URL}/chats/${chatId}/messages/stream`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            parts,
            chatId,
          }),
        },
      );

      console.log(
        'Response status:',
        streamResponse.status,
        'OK:',
        streamResponse.ok,
      );

      if (!streamResponse.ok) {
        const errorText = await streamResponse.text();
        console.error('Response error:', errorText);
        throw new Error(
          `HTTP error! status: ${streamResponse.status} - ${errorText}`,
        );
      }

      if (streamResponse.body) {
        // @note handle streaming response
        const reader = streamResponse.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedResponse = '';

        const assistantMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: '',
        };

        // @note start with user message and empty assistant message
        const streamMessages = [...newMessages, assistantMessage];
        setMessages(streamMessages);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          accumulatedResponse += chunk;

          // @note update assistant message content in real-time
          const updatedMessages = [
            ...newMessages,
            {
              ...assistantMessage,
              content: accumulatedResponse,
            },
          ];
          setMessages(updatedMessages);
        }

        // @note final update with complete response
        const finalMessages = [
          ...newMessages,
          {
            ...assistantMessage,
            content:
              accumulatedResponse ||
              'Maaf, terjadi kesalahan. Silakan coba lagi.',
          },
        ];

        setMessages(finalMessages);
        updateChatMessages(finalMessages, chatId);

        // @note generate chat title only for first message in new chat
        if (newMessages.length === 1 && !activeChat) {
          try {
            const titleResponse = await fetch(
              `${API_BASE_URL}/chats/${chatId}/title`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
              },
            );

            if (titleResponse.ok) {
              const titleData = await titleResponse.json();
              if (titleData.success && titleData.title) {
                setChatHistory(prev =>
                  prev.map(chat =>
                    chat.id === chatId
                      ? { ...chat, title: titleData.title }
                      : chat,
                  ),
                );
              }
            }
          } catch (titleError) {
            console.error('Error generating title:', titleError);
          }
        }
      }
    } catch (error) {
      console.error('Error calling AI API:', error);

      // @note add more detailed error message
      let errorContent =
        'Maaf, terjadi kesalahan saat menghubungi AI. Silakan coba lagi.';

      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorContent =
          'Tidak dapat terhubung ke server AI. Periksa koneksi internet Anda.';
      } else if (error.message.includes('HTTP error')) {
        errorContent = `Server error: ${error.message}. Silakan coba lagi nanti.`;
      }

      // @note add error message
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: errorContent,
      };

      // @note remove loading message and add error response
      const finalMessages = [...newMessages, errorMessage];
      setMessages(finalMessages);
      updateChatMessages(finalMessages, chatId);
    } finally {
      setIsLoading(false);
    }
  }, [
    input,
    isLoading,
    messages,
    updateChatMessages,
    activeChat,
    systemPrompt,
    setInput,
    setIsLoading,
    setMessages,
    setChatHistory,
    generateChatTitle,
  ]);

  const handleChatSelect = useCallback(
    chatId => {
      setChatHistory(prev =>
        prev.map(chat => ({ ...chat, active: chat.id === chatId })),
      );
    },
    [setChatHistory],
  );

  const handleNewChat = useCallback(() => {
    // @note deactivate all existing chats instead of creating a new one immediately
    setChatHistory(prev => prev.map(chat => ({ ...chat, active: false })));
  }, [setChatHistory]);

  const handleDeleteChat = useCallback(
    (chatId, e) => {
      e.stopPropagation();
      // @note prevent deleting if only one chat remains
      setChatHistory(prev => {
        if (prev.length <= 1) return prev;

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
    [setChatHistory],
  );

  return {
    handleSend,
    handleChatSelect,
    handleNewChat,
    handleDeleteChat,
  };
}
