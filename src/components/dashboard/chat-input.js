import { useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

// @note enhanced chat input component with auto-resize and modern styling
export function ChatInput({
  input,
  setInput,
  handleSend,
  isLoading,
  messages,
}) {
  const textareaRef = useRef(null);

  // @note auto resize textarea based on content with min 1 line and max 7 lines
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // @note reset height to auto to get proper scrollHeight
    textarea.style.height = 'auto';

    // @note calculate line height (approximately 20px per line)
    const lineHeight = 20;
    const minHeight = lineHeight * 1; // @note 1 line minimum
    const maxHeight = lineHeight * 7; // @note 7 lines maximum

    // @note set height based on content, with min/max constraints
    const scrollHeight = textarea.scrollHeight;
    const newHeight = Math.max(minHeight, Math.min(maxHeight, scrollHeight));

    textarea.style.height = `${newHeight}px`;

    // @note enable scrolling when content exceeds max height
    if (scrollHeight > maxHeight) {
      textarea.style.overflowY = 'auto';
    } else {
      textarea.style.overflowY = 'hidden';
    }
  }, []);

  // @note trigger resize when input changes
  useEffect(() => {
    adjustTextareaHeight();
  }, [input, adjustTextareaHeight]);

  const handleKeyDown = useCallback(
    e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  return (
    <div className="shrink-0">
      <div className="max-w-4xl mx-auto pt-4 px-4">
        {/* @note input container with glass morphism effect */}
        <div className="relative bg-card/50 backdrop-blur-md border border-border/60 rounded-t-xl border-b-0 shadow-lg hover:shadow-xl transition-all duration-300 p-3 pb-6">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              {/* @note enhanced textarea with modern styling and auto-resize */}
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Ketik pesan Anda di sini..."
                className="resize-none min-h-[48px] max-h-[140px] pr-16 pl-4 py-3 border-0 bg-transparent text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-0 leading-relaxed overflow-y-auto scrollbar-primary"
                style={{
                  height: '48px',
                  scrollbarWidth: 'thin',
                  scrollbarColor:
                    'hsl(var(--primary) / 0.7) hsl(var(--muted) / 0.2)',
                }}
              />

              {/* @note character count indicator for longer messages */}
              {input.length > 100 && (
                <div className="absolute top-2 right-16 text-xs text-muted-foreground/60">
                  {input.length}
                </div>
              )}

              {/* @note enhanced send button with better positioning */}
              <div className="absolute right-2 bottom-2 flex items-center gap-2">
                {/* @note typing indicator */}
                {input.trim() && !isLoading && (
                  <div className="text-xs text-muted-foreground/60 hidden sm:block">
                    Enter
                  </div>
                )}
                <Button
                  onClick={handleSend}
                  size="sm"
                  className="h-8 w-8 rounded-lg bg-primary hover:bg-primary/90 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!input.trim() || isLoading}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin"></div>
                    </div>
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* @note enhanced status message with better typography */}
          <StatusMessage messages={messages} />
        </div>

        {/* @note quick action buttons for mobile */}
        {messages.length === 0 && (
          <div className="pb-4">
            <QuickActions onActionClick={setInput} />
          </div>
        )}
      </div>
    </div>
  );
}

// @note status message component
function StatusMessage({ messages }) {
  return (
    <div className="flex items-center justify-between mt-2 px-1">
      <div className="text-xs text-muted-foreground/70">
        {messages.length === 0 ? (
          'Mulai percakapan pertama Anda dengan Aibo'
        ) : (
          <span className="hidden sm:inline">
            Tekan Enter untuk kirim, Shift + Enter untuk baris baru
          </span>
        )}
      </div>
    </div>
  );
}

// @note quick action buttons for mobile users
function QuickActions({ onActionClick }) {
  return (
    <div className="flex justify-center mt-3 sm:hidden px-3">
      <div className="flex gap-2 text-xs">
        <button
          onClick={() => onActionClick('Halo Aibo!')}
          className="px-3 py-1.5 bg-secondary/50 hover:bg-secondary/70 rounded-full transition-colors"
        >
          👋 Sapa
        </button>
        <button
          onClick={() => onActionClick('Apa yang bisa kamu bantu?')}
          className="px-3 py-1.5 bg-secondary/50 hover:bg-secondary/70 rounded-full transition-colors"
        >
          ❓ Bantuan
        </button>
      </div>
    </div>
  );
}
