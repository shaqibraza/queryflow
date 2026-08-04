"use client";

import { Menu } from "lucide-react";
import { useState } from "react";
import { ConnectionSelector } from "@/components/connection/ConnectionSelector";
import { ChatWorkspace } from "@/components/chat/ChatWorkspace";
import { Sidebar } from "./Sidebar";

export function DashboardShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeConversationId={activeConversationId}
        onSelectConversation={setActiveConversationId}
        onNewChat={() => setActiveConversationId(undefined)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              suppressHydrationWarning
              className="focus-ring rounded-lg p-1.5 text-muted hover:text-foreground lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu size={18} />
            </button>
            <ConnectionSelector />
          </div>
        </header>

        <main className="min-h-0 flex-1">
          <ChatWorkspace />
        </main>
      </div>
    </div>
  );
}
