import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Textarea } from '@/components/ui/textarea';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Settings } from 'lucide-react';

// @note main header component with theme toggle and settings
export function ChatHeader({ isEditingPrompt, setIsEditingPrompt }) {
  return (
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
  );
}

// @note system prompt editor component
export function SystemPromptEditor({
  isVisible,
  systemPrompt,
  onSystemPromptChange,
}) {
  if (!isVisible) return null;

  return (
    <div className="p-3 border-b border-border bg-muted/30 flex-shrink-0">
      <label className="block text-xs font-medium text-foreground mb-1">
        System Prompt
      </label>
      <Textarea
        value={systemPrompt}
        onChange={e => onSystemPromptChange(e.target.value)}
        className="w-full text-sm"
        placeholder="Enter system prompt..."
        rows={2}
      />
    </div>
  );
}
