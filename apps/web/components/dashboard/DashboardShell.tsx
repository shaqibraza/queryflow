"use client";

import { MetadataService, type DatabaseMetadata } from "@/src/services/metadata.service";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMetadataStore } from "@/src/stores/metadata.store";
import { Sidebar } from "./Sidebar";
import { ChatWorkspace } from "@/components/chat/ChatWorkspace";
import { ConnectionGate } from "@/components/connection/ConnectionGate";
import { ConnectionSelector } from "@/components/connection/ConnectionSelector";
import { EmptyConnectionCard } from "@/components/connection/EmptyConnectionCard";
import { CreateConnectionDialog } from "@/components/connection/CreateConnectionDialog";

import { cn } from "@/lib/utils";

import { AuthService } from "@/src/services/auth.service";
import { ConnectionService, type DatabaseType } from "@/src/services/connection.service";
import { useAuthStore } from "@/src/stores/auth.store";

interface DatabaseConnection {
  id: string;
  name: string;
  databaseType: DatabaseType;
  ownerId?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export function DashboardShell() {
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [activeConversationId, setActiveConversationId] = useState<string | undefined>();

  const [connectionDialogOpen, setConnectionDialogOpen] = useState(false);

  const [connections, setConnections] = useState<DatabaseConnection[]>([]);

  const [selectedConnection, setSelectedConnection] = useState<DatabaseConnection | null>(null);

  const [loadingConnections, setLoadingConnections] = useState(true);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const setUser = useAuthStore((state) => state.setUser);

  const logout = useAuthStore((state) => state.logout);

  async function loadConnections() {
    try {
      setLoadingConnections(true);

      const list = await ConnectionService.getConnections();

      setConnections(list);

      setSelectedConnection((prev) => {
        if (list.length === 0) {
          return null;
        }

        if (!prev) {
          return list[0];
        }

        const exists = list.find((connection) => connection.id === prev.id);

        console.log("connections state:", connections);

        console.log("connections.length:", connections.length);

        console.log("hasConnections:", hasConnections);

        return exists ?? list[0];
      });
      if (list.length > 0) {
        await loadMetadata(list[0].id);
      }
    } catch (error) {
      console.error("Failed to load connections", error);
    } finally {
      setLoadingConnections(false);
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    const syncUser = async () => {
      try {
        const user = await AuthService.me();

        setUser(user);

        await loadConnections();
      } catch (error) {
        console.error(error);

        await AuthService.logout().catch(() => {});

        logout();

        router.replace("/login");
      }
    };

    syncUser();
  }, [isAuthenticated, logout, router, setUser]);

  const hasConnections = connections.length > 0;

  const metadata = useMetadataStore((state) => state.metadata);

  const getCachedMetadata = useMetadataStore((state) => state.getMetadata);

  const setMetadata = useMetadataStore((state) => state.setMetadata);

  const setMetadataLoading = useMetadataStore((state) => state.setLoading);

  async function loadMetadata(connectionId: string) {
    const cached = getCachedMetadata(connectionId);

    if (cached) {
      console.log("Metadata loaded from cache.");

      setMetadata(connectionId, cached);

      return;
    }

    try {
      setMetadataLoading(true);

      const metadata = await MetadataService.getMetadata(connectionId);

      setMetadata(connectionId, metadata);

      console.log("Metadata fetched from server.");
    } catch (error) {
      console.error("Failed to load metadata", error);
    } finally {
      setMetadataLoading(false);
    }
  }

  useEffect(() => {
    console.log("Metadata Store:", metadata);
  }, [metadata]);

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
              className="focus-ring rounded-lg p-1.5 text-muted hover:text-foreground lg:hidden"
            >
              <Menu size={18} />
            </button>

            <ConnectionSelector
              connections={connections}
              selected={selectedConnection}
              onSelect={async (connection) => {
                setSelectedConnection(connection);
                await loadMetadata(connection.id);
              }}
              onRefresh={loadConnections}
              onAddConnection={() => setConnectionDialogOpen(true)}
            />
          </div>
        </header>

        <main className="min-h-0 flex-1">
          <ConnectionGate hasConnection={hasConnections}>
            <ChatWorkspace selectedConnection={selectedConnection} />
          </ConnectionGate>
        </main>
      </div>

      {!loadingConnections && !hasConnections && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
          <EmptyConnectionCard onCreateConnection={() => setConnectionDialogOpen(true)} />
        </div>
      )}

      <CreateConnectionDialog
        open={connectionDialogOpen}
        onClose={() => setConnectionDialogOpen(false)}
        onCreated={async () => {
          setConnectionDialogOpen(false);

          await loadConnections();
        }}
      />
    </div>
  );
}
