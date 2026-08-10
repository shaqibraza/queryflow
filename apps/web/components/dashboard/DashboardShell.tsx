"use client";

import { MetadataService } from "@/src/services/metadata.service";

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

const SELECTED_CONNECTION_KEY = "queryflow-selected-connection";

export function DashboardShell() {
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [activeConversationId, setActiveConversationId] = useState<string | undefined>();

  const [conversationRefreshKey, setConversationRefreshKey] = useState(0);

  const [connectionDialogOpen, setConnectionDialogOpen] = useState(false);

  const [connections, setConnections] = useState<DatabaseConnection[]>([]);

  const [selectedConnection, setSelectedConnection] = useState<DatabaseConnection | null>(null);

  const [loadingConnections, setLoadingConnections] = useState(true);

  const [chatResetKey, setChatResetKey] = useState(0);

  const [restoringAuth, setRestoringAuth] = useState(true);

  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  const setUser = useAuthStore((state) => state.setUser);

  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const logout = useAuthStore((state) => state.logout);

  const metadata = useMetadataStore((state) => state.metadata);

  const getCachedMetadata = useMetadataStore((state) => state.getMetadata);

  const setMetadata = useMetadataStore((state) => state.setMetadata);

  const setMetadataLoading = useMetadataStore((state) => state.setLoading);

  /*
   * Load metadata for selected connection.
   */
  async function loadMetadata(connectionId: string) {
    const cached = getCachedMetadata(connectionId);

    if (cached) {
      setMetadata(connectionId, cached);

      return;
    }

    try {
      setMetadataLoading(true);

      const metadata = await MetadataService.getMetadata(connectionId);

      setMetadata(connectionId, metadata);
    } catch (error) {
      console.error("Failed to load metadata:", error);
    } finally {
      setMetadataLoading(false);
    }
  }

  /*
   * Load all database connections and restore
   * the previously selected connection.
   */
  async function loadConnections() {
    console.log("🔥 loadConnections CALLED");

    try {
      setLoadingConnections(true);

      const list = await ConnectionService.getConnections();

      console.log("Connections restored:", list);

      setConnections(list);

      // No database connections available
      if (list.length === 0) {
        setSelectedConnection(null);

        window.localStorage.removeItem(SELECTED_CONNECTION_KEY);

        return;
      }

      // Read persisted selected connection
      const savedConnectionId = window.localStorage.getItem(SELECTED_CONNECTION_KEY);

      console.log("Saved connection ID:", savedConnectionId);

      // Find the previously selected connection
      const savedConnection = savedConnectionId
        ? list.find((connection) => connection.id === savedConnectionId)
        : undefined;

      // Restore saved connection.
      // If it no longer exists, use the first connection.
      const connectionToSelect = savedConnection ?? list[0];

      console.log("Connection selected:", connectionToSelect);

      // Safety check
      if (!connectionToSelect) {
        setSelectedConnection(null);
        return;
      }

      // Update React state
      setSelectedConnection(connectionToSelect);

      // Persist selected connection
      window.localStorage.setItem(SELECTED_CONNECTION_KEY, connectionToSelect.id);

      console.log("Selected connection persisted:", connectionToSelect.id);

      // Restore metadata
      await loadMetadata(connectionToSelect.id);
    } catch (error) {
      console.error("Failed to load connections:", error);

      setConnections([]);
      setSelectedConnection(null);
    } finally {
      setLoadingConnections(false);
    }
  }

  /*
   * Restore authentication and connections.
   */
  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    let cancelled = false;

    const restoreSession = async () => {
      try {
        console.log("===== RESTORING AUTH SESSION =====");

        const currentAccessToken = useAuthStore.getState().accessToken;

        /*
         * After a full browser refresh the access token is
         * intentionally gone from Zustand memory.
         *
         * Restore it using the HttpOnly refresh-token cookie.
         */
        if (!currentAccessToken) {
          console.log("No access token in memory → refreshing session");

          const refreshResponse = await AuthService.refresh();

          if (!refreshResponse?.accessToken) {
            throw new Error("Failed to restore access token");
          }

          setAccessToken(refreshResponse.accessToken);

          console.log("Access token restored successfully");
        }

        /*
         * Now that we have a valid access token,
         * restore the authenticated user.
         */
        const user = await AuthService.me();

        if (cancelled) {
          return;
        }

        setUser(user);

        console.log("Authenticated user restored:", user);

        /*
         * Now restore database connections.
         */
        await loadConnections();

        console.log("Connections restored successfully");
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error("Failed to restore authentication session:", error);

        logout();

        router.replace("/login");
      } finally {
        if (!cancelled) {
          setRestoringAuth(false);
        }
      }
    };

    void restoreSession();

    return () => {
      cancelled = true;
    };
  }, [hasHydrated, logout, router, setAccessToken, setUser]);

  /*
   * Debug metadata state.
   */
  useEffect(() => {
    console.log("Metadata Store:", metadata);
  }, [metadata]);

  /*
   * Called when QueryService creates a
   * new conversation.
   */
  function handleConversationCreated(conversationId: string) {
    setActiveConversationId(conversationId);

    setConversationRefreshKey((previous) => previous + 1);
  }

  /*
   * New Chat:
   * - clear current conversation
   * - remount ChatWorkspace
   * - keep selected database
   */
  function handleNewChat() {
    setActiveConversationId(undefined);

    setChatResetKey((previous) => previous + 1);
  }

  /*
   * Database selection:
   * - persist selected DB
   * - clear current conversation
   * - reset chat
   * - load new DB metadata
   */
  async function handleConnectionSelect(connection: DatabaseConnection) {
    setSelectedConnection(connection);

    window.localStorage.setItem(SELECTED_CONNECTION_KEY, connection.id);

    // Changing database = new empty chat
    setActiveConversationId(undefined);

    setChatResetKey((previous) => previous + 1);

    await loadMetadata(connection.id);
  }

  const hasConnections = connections.length > 0;

  const connectionsResolved = !loadingConnections;

  if (!hasHydrated || restoringAuth) {
    return null;
  }

  return (
    <div className="flex h-screen min-h-0 overflow-hidden bg-black">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeConversationId={activeConversationId}
        onSelectConversation={(conversationId) => {
          setActiveConversationId(conversationId);
          setSidebarOpen(false);
        }}
        onNewChat={() => {
          handleNewChat();
          setSidebarOpen(false);
        }}
        conversationRefreshKey={conversationRefreshKey}
      />

      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col",
          connectionsResolved && !hasConnections && "pointer-events-none blur-sm opacity-40"
        )}
      >
        <header className="flex min-h-[57px] shrink-0 items-center justify-between border-b border-border px-3 py-2.5 sm:px-4 sm:py-3 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-white/[0.05] hover:text-foreground lg:hidden"
              aria-label="Open navigation"
            >
              <Menu size={18} />
            </button>

            <ConnectionSelector
              connections={connections}
              selected={selectedConnection}
              onSelect={handleConnectionSelect}
              onRefresh={loadConnections}
              onAddConnection={() => setConnectionDialogOpen(true)}
            />
          </div>
        </header>

        <main className="min-h-0 flex-1">
          <ConnectionGate hasConnection={hasConnections}>
            <ChatWorkspace
              key={chatResetKey}
              selectedConnection={selectedConnection}
              activeConversationId={activeConversationId}
              onConversationCreated={handleConversationCreated}
            />
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
