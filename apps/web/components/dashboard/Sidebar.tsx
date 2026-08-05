"use client";

import { motion } from "framer-motion";
import { Cable, Clock, Database, Plus, Settings, X } from "lucide-react";
import { recentConversations } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { UserProfileCard } from "@/components/profile/UserProfileCard";
import { SidebarItem } from "./SidebarItem";
import { useAuthStore } from "@/src/stores/auth.store";
import { useRouter } from "next/navigation";
import { AuthService } from "@/src/services/auth.service";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  activeConversationId?: string;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  className?: string;
}

export function Sidebar({
  open,
  onClose,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  className
}: SidebarProps) {
  const user = useAuthStore((state) => state.user);

  const router = useRouter();

  const logout = useAuthStore((state) => state.logout);

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
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
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

        <div className="mt-6 flex-1 overflow-y-auto px-3">
          <p className="px-2.5 text-[11px] font-medium uppercase tracking-wider text-muted/70">
            Recent
          </p>
          <div className="mt-2 space-y-0.5">
            {recentConversations.map((conversation) => (
              <SidebarItem
                key={conversation.id}
                label={conversation.title}
                meta={conversation.timestamp}
                active={conversation.id === activeConversationId}
                onClick={() => onSelectConversation(conversation.id)}
              />
            ))}
          </div>
        </div>

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
