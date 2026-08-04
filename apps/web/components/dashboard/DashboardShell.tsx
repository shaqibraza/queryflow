"use client";

import { Menu } from "lucide-react";
import {} from "react";
import { useState, useEffect } from "react";
import { ConnectionSelector } from "@/components/connection/ConnectionSelector";
import { ChatWorkspace } from "@/components/chat/ChatWorkspace";
import { Sidebar } from "./Sidebar";
import { useRouter } from "next/navigation";
import { AuthService } from "@/src/services/auth.service";
import { useAuthStore } from "@/src/stores/auth.store";
import { ConnectionGate } from "@/components/connection/ConnectionGate";
import { EmptyConnectionCard } from "@/components/connection/EmptyConnectionCard";
import { cn } from "@/lib/utils";
import { CreateConnectionDialog } from "@/components/connection/CreateConnectionDialog";

export function DashboardShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>();

  const router = useRouter();

  const [connectionDialogOpen, setConnectionDialogOpen] = useState(false);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    console.log("isAuthenticated:", isAuthenticated);
    if (!isAuthenticated) {
      console.log("Redirecting because not authenticated");
      router.replace("/login");
      return;
    }

    const syncUser = async () => {
      try {
        const user = await AuthService.me();

        setUser(user);
      } catch (error) {
        console.error("ME ERROR", error);
        await AuthService.logout().catch(() => {});

        logout();

        router.replace("/login");
      }
    };

    syncUser();
  }, [isAuthenticated, logout, router, setUser]);

  // TODO: Backend se replace karenge
  const hasConnections = false;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeConversationId={activeConversationId}
        onSelectConversation={setActiveConversationId}
        onNewChat={() => setActiveConversationId(undefined)}
        className={!hasConnections ? "pointer-events-none blur-sm opacity-40" : ""}
      />

      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col",
          !hasConnections && "pointer-events-none blur-sm opacity-40"
        )}
      >
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
          <ConnectionGate>
            <ChatWorkspace />
          </ConnectionGate>
        </main>
      </div>
      {!hasConnections && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
          <EmptyConnectionCard
            onCreateConnection={() => {
              setConnectionDialogOpen(true);
            }}
          />
        </div>
      )}
      <CreateConnectionDialog
        open={connectionDialogOpen}
        onClose={() => setConnectionDialogOpen(false)}
        onCreated={() => {
          setConnectionDialogOpen(false);

          // TODO:
          // Refresh connections here
        }}
      />
    </div>
  );
}
