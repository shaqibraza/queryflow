"use client";

import { motion } from "framer-motion";
import { Database, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { UserProfileCard } from "@/components/profile/UserProfileCard";
import { SidebarItem } from "./SidebarItem";
import { useAuthStore } from "@/src/stores/auth.store";
import { useRouter } from "next/navigation";
import { AuthService } from "@/src/services/auth.service";
import { Conversation, ConversationService } from "@/src/services/conversation.service";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  activeConversationId?: string;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  conversationRefreshKey: number;
  className?: string;
}

export function Sidebar({
  open,
  onClose,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  conversationRefreshKey,
  className
}: SidebarProps) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const router = useRouter();

  const [conversations, setConversations] = useState<Conversation[]>([]);

  const [isLoadingConversations, setIsLoadingConversations] = useState(true);

  async function loadConversations() {
    try {
      setIsLoadingConversations(true);

      const data = await ConversationService.getConversations();

      setConversations(data);
    } catch (error) {
      console.error("Failed to load conversations:", error);

      setConversations([]);
    } finally {
      setIsLoadingConversations(false);
    }
  }

  useEffect(() => {
    const loadConversations = async () => {
      try {
        setIsLoadingConversations(true);

        const data = await ConversationService.getConversations();

        setConversations(data);
      } catch (error) {
        console.error("Failed to load conversations:", error);

        setConversations([]);
      } finally {
        setIsLoadingConversations(false);
      }
    };

    void loadConversations();
  }, [conversationRefreshKey]);

  async function handleLogout() {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error(error);
    } finally {
      logout();
      router.replace("/login");
    }
  }

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <motion.aside
        initial={false}
        animate={{ x: 0 }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[264px] shrink-0 flex-col border-r border-border bg-[#0a0a0d]/95 backdrop-blur-xl transition-transform duration-300 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-5">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-deep">
              <Database size={14} className="text-white" />
            </div>

            <span className="text-[14.5px] font-semibold tracking-tight text-foreground">
              QueryFlow
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            suppressHydrationWarning
            className="focus-ring rounded-lg p-1.5 text-muted hover:text-foreground lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        </div>

        {/* New Chat */}
        <div className="px-3 pt-5">
          <motion.button
            type="button"
            onClick={onNewChat}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            suppressHydrationWarning
            className="focus-ring flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-white/[0.03] px-3 py-2.5 text-[13px] font-medium text-foreground transition-colors duration-200 hover:border-accent/40 hover:bg-white/[0.06]"
          >
            <Plus size={15} />
            New Chat
          </motion.button>
        </div>

        {/* Conversations */}
        <div className="mt-6 flex-1 overflow-y-auto px-3">
          <p className="px-2.5 text-[11px] font-medium uppercase tracking-wider text-muted/70">
            Recent
          </p>

          <div className="mt-2 space-y-0.5">
            {isLoadingConversations ? (
              <div className="px-2.5 py-3 text-xs text-muted">Loading conversations...</div>
            ) : conversations.length === 0 ? (
              <div className="px-2.5 py-3 text-xs text-muted">No conversations yet</div>
            ) : (
              conversations.map((conversation) => (
                <SidebarItem
                  key={conversation.id}
                  label={conversation.title}
                  meta={formatConversationDate(conversation.updatedAt)}
                  active={conversation.id === activeConversationId}
                  onClick={() => onSelectConversation(conversation.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* User */}
        <div className="border-t border-border p-3">
          <UserProfileCard
            name={user ? `${user.firstName} ${user.lastName}` : "Loading..."}
            email={user?.email ?? ""}
            avatar={user?.avatar}
            onLogout={handleLogout}
          />
        </div>
      </motion.aside>
    </>
  );
}

function formatConversationDate(date: string): string {
  const conversationDate = new Date(date);

  if (Number.isNaN(conversationDate.getTime())) {
    return "";
  }

  const now = new Date();

  const difference = now.getTime() - conversationDate.getTime();

  const minutes = Math.floor(difference / (1000 * 60));

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days}d ago`;
  }

  return conversationDate.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short"
  });
}
