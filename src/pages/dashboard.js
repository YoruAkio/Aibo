import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Brain } from 'lucide-react';
import { ChatSidebar } from '@/components/dashboard/chat-sidebar';
import {
  ChatHeader,
  SystemPromptEditor,
} from '@/components/dashboard/chat-header';
import { MessagesContainer } from '@/components/dashboard/messages-container';
import { ChatInput } from '@/components/dashboard/chat-input';
import { useChatManager, useChatActions } from '@/hooks/use-chat';

export default function Dashboard() {
  // @note use custom hooks for chat management
  const chatManager = useChatManager();
  const {
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
    activeChat,
    groupedChats,
    updateChatMessages,
    generateChatTitle,
  } = chatManager;

  // @note use custom hook for chat actions
  const { handleSend, handleChatSelect, handleNewChat, handleDeleteChat } =
    useChatActions({
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
    });

  // @note handle system prompt updates
  const handleSystemPromptChange = value => {
    setSystemPrompt(value);
  };

  // @note handle question selection from welcome screen
  const handleQuestionSelect = question => {
    setInput(question);
  };

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
        <ChatSidebar
          chatHistory={chatHistory}
          groupedChats={groupedChats}
          handleNewChat={handleNewChat}
          handleChatSelect={handleChatSelect}
          handleDeleteChat={handleDeleteChat}
        />

        {/* @note main chat area */}
        <SidebarInset className="flex flex-col h-screen overflow-hidden">
          {/* @note header with settings */}
          <ChatHeader
            isEditingPrompt={isEditingPrompt}
            setIsEditingPrompt={setIsEditingPrompt}
          />

          {/* @note system prompt editor */}
          <SystemPromptEditor
            isVisible={isEditingPrompt}
            systemPrompt={systemPrompt}
            onSystemPromptChange={handleSystemPromptChange}
          />

          {/* @note messages container */}
          <MessagesContainer
            messages={messages}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onQuestionSelect={handleQuestionSelect}
          />

          {/* @note chat input */}
          <ChatInput
            input={input}
            setInput={setInput}
            handleSend={handleSend}
            isLoading={isLoading}
            messages={messages}
          />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
