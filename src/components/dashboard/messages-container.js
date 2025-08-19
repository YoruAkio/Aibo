import { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from './message-bubble';
import { WelcomeScreen } from './welcome-screen';

// @note main messages container with auto-scroll
export function MessagesContainer({
  messages,
  activeTab,
  setActiveTab,
  onQuestionSelect,
}) {
  const endRef = useRef(null);

  // @note auto scroll to bottom when messages change
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="flex flex-col gap-3 max-w-3xl mx-auto px-3 py-3">
          {messages.length === 0 ? (
            <WelcomeScreen
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onQuestionSelect={onQuestionSelect}
            />
          ) : (
            messages.map(message => (
              <MessageBubble key={message.id} message={message} />
            ))
          )}
          <div ref={endRef} />
        </div>
      </ScrollArea>
    </div>
  );
}
