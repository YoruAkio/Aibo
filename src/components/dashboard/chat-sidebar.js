import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { MessageSquare, Plus, Brain, Trash2 } from 'lucide-react';

// @note sidebar component for chat history management
export function ChatSidebar({
  chatHistory,
  groupedChats,
  handleNewChat,
  handleChatSelect,
  handleDeleteChat,
}) {
  return (
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
              <EmptyState />
            ) : (
              <ChatGroups
                groupedChats={groupedChats}
                chatHistory={chatHistory}
                handleChatSelect={handleChatSelect}
                handleDeleteChat={handleDeleteChat}
              />
            )}
          </div>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

// @note empty state when no chat history exists
function EmptyState() {
  return (
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
  );
}

// @note chat groups component for organizing chats by date
function ChatGroups({
  groupedChats,
  chatHistory,
  handleChatSelect,
  handleDeleteChat,
}) {
  const groups = [
    { key: 'today', label: 'Today', chats: groupedChats.today },
    { key: 'yesterday', label: 'Yesterday', chats: groupedChats.yesterday },
    { key: 'older', label: 'Previous 7 days', chats: groupedChats.older },
  ];

  return (
    <div className="space-y-4">
      {groups.map(
        group =>
          group.chats.length > 0 && (
            <div key={group.key}>
              <h3 className="text-xs font-medium text-muted-foreground px-2 mb-2">
                {group.label}
              </h3>
              <div className="space-y-1">
                {group.chats.map(chat => (
                  <ChatItem
                    key={chat.id}
                    chat={chat}
                    canDelete={chatHistory.length > 1}
                    onSelect={() => handleChatSelect(chat.id)}
                    onDelete={e => handleDeleteChat(chat.id, e)}
                  />
                ))}
              </div>
            </div>
          ),
      )}
    </div>
  );
}

// @note individual chat item component
function ChatItem({ chat, canDelete, onSelect, onDelete }) {
  return (
    <div className="group relative">
      <button
        onClick={onSelect}
        className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 hover:bg-sidebar-accent/50 ${
          chat.active ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''
        }`}
      >
        <span className="text-sm truncate">{chat.title}</span>
      </button>
      {canDelete && (
        <button
          onClick={onDelete}
          className="absolute top-1/2 right-2 -translate-y-1/2 w-5 h-5 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
          title="Hapus percakapan"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
