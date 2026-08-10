"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Database, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { UserProfileCard } from "@/components/profile/UserProfileCard";
import { SidebarItem } from "./SidebarItem";
import { useAuthStore } from "@/src/stores/auth.store";
import { useRouter } from "next/navigation";
import { Conversation, ConversationService } from "@/src/services/conversation.service";
import { AuthService } from "@/src/services/auth.service";
import Link from "next/link";

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

  const [editingConversationId, setEditingConversationId] = useState<string | null>(null);

  const [editingTitle, setEditingTitle] = useState("");

  const [actionConversationId, setActionConversationId] = useState<string | null>(null);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadConversations = async () => {
      try {
        setIsLoadingConversations(true);

        const data = await ConversationService.getConversations();

        if (!cancelled) {
          setConversations(data);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load conversations:", error);

          setConversations([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingConversations(false);
        }
      }
    };

    void loadConversations();

    return () => {
      cancelled = true;
    };
  }, [conversationRefreshKey]);

  async function handleLogout() {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      logout();
      router.replace("/login");
    }
  }

  function handleConversationSelect(id: string) {
    onSelectConversation(id);

    // Close drawer after selecting a conversation
    // on mobile/tablet. On desktop this has no effect.
    onClose();
  }

  function handleNewChat() {
    onNewChat();

    // Close drawer after starting a new chat.
    onClose();
  }

  async function handleRename(conversationId: string, title: string) {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    try {
      setActionConversationId(conversationId);

      const updatedConversation = await ConversationService.renameConversation(
        conversationId,
        trimmedTitle
      );

      setConversations((previous) =>
        previous.map((conversation) =>
          conversation.id === conversationId ? updatedConversation : conversation
        )
      );

      setEditingConversationId(null);
      setEditingTitle("");
      setOpenMenuId(null);
    } catch (error) {
      console.error("Failed to rename conversation:", error);
    } finally {
      setActionConversationId(null);
    }
  }

  async function handleDelete(conversationId: string) {
    const confirmed = window.confirm("Are you sure you want to delete this conversation?");

    if (!confirmed) {
      return;
    }

    try {
      setActionConversationId(conversationId);

      await ConversationService.deleteConversation(conversationId);

      setConversations((previous) =>
        previous.filter((conversation) => conversation.id !== conversationId)
      );

      setOpenMenuId(null);

      /*
       * If the currently active conversation was deleted,
       * start a fresh chat.
       */
      if (conversationId === activeConversationId) {
        onNewChat();
      }
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    } finally {
      setActionConversationId(null);
    }
  }

  return (
    <>
      {/* Mobile / Tablet overlay */}
      <AnimatePresence>
        {open && (
          <motion.button
            type="button"
            aria-label="Close navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[264px] shrink-0 flex-col",
          "border-r border-border bg-[#0a0a0d]/95 backdrop-blur-xl",
          "transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full",
          "lg:static lg:translate-x-0",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-5">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-2 rounded-lg focus-ring"
            aria-label="Go to QueryFlow home"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-deep">
              <Database size={14} className="text-white" />
            </div>

            <span className="text-[14.5px] font-semibold tracking-tight text-foreground">
              QueryFlow
            </span>
          </Link>

          {/* Mobile / Tablet close button */}
          <button
            type="button"
            onClick={onClose}
            suppressHydrationWarning
            className="focus-ring flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-white/[0.05] hover:text-foreground lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        </div>

        {/* New Chat */}
        <div className="px-3 pt-5">
          <motion.button
            type="button"
            onClick={handleNewChat}
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
                  isLoading={actionConversationId === conversation.id}
                  onClick={() => handleConversationSelect(conversation.id)}
                  onRename={(title) => handleRename(conversation.id, title)}
                  onDelete={() => handleDelete(conversation.id)}
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
