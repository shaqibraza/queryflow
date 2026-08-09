"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { type Suggestion } from "@/lib/mock-data";
import { AssistantMessage } from "./AssistantMessage";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { UserMessage } from "./UserMessage";
import { WelcomeScreen } from "./WelcomeScreen";

import type { DatabaseConnection } from "@/components/connection/ConnectionSelector";

import { ChatService } from "@/src/services/chat.service";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;

  connectionId?: string;

  sql?: string;

  result?: unknown;

  analysis?: {
    type: string;
    requiresConfirmation: boolean;
    firstKeyword: string;
  };
}

function nextId(): string {
  return crypto.randomUUID();
}

interface ChatWorkspaceProps {
  selectedConnection: DatabaseConnection | null;
  activeConversationId?: string;
  onConversationCreated: (conversationId: string) => void;
}

export function ChatWorkspace({
  selectedConnection,
  activeConversationId,
  onConversationCreated
}: ChatWorkspaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);

  const [conversationId, setConversationId] = useState<string | undefined>();

  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    console.group("Messages State");

    console.table(
      messages.map((message, index) => ({
        index,
        id: message.id,
        role: message.role,
        content: message.content
      }))
    );

    const ids = messages.map((message) => message.id);

    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);

    if (duplicates.length > 0) {
      console.error("Duplicate IDs Found:", duplicates);
    }

    console.groupEnd();
  }, [messages]);

  async function sendMessage(content: string) {
    if (!selectedConnection || isTyping) {
      return;
    }

    const userMessage: Message = {
      id: nextId(),
      role: "user",
      content
    };

    setMessages((previous) => [...previous, userMessage]);

    setIsTyping(true);

    try {
      const response = await ChatService.query(selectedConnection.id, content, conversationId);

      if (response.conversationId) {
        setConversationId(response.conversationId);

        onConversationCreated(response.conversationId);
      }

      const assistantMessage: Message = {
        id: nextId(),
        role: "assistant",
        connectionId: selectedConnection.id,
        content:
          (response.message ?? response.analysis?.requiresConfirmation)
            ? "This query modifies data and requires confirmation before execution."
            : "Query generated successfully.",
        sql: response.generatedQuery ?? undefined,
        result: response.result,
        analysis: response.analysis
      };

      setMessages((previous) => [...previous, assistantMessage]);
    } catch (error) {
      console.error("Failed to process query:", error);

      setMessages((previous) => [
        ...previous,
        {
          id: nextId(),
          role: "assistant",
          content: "Something went wrong."
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  function handleSuggestion(suggestion: Suggestion) {
    void sendMessage(suggestion.label);
  }

  async function executeMessage(message: Message) {
    if (!message.sql || !message.connectionId) {
      return;
    }

    try {
      const response = await ChatService.execute(message.connectionId, message.sql);

      setMessages((previous) =>
        previous.map((current) =>
          current.id === message.id
            ? {
                ...current,
                result: response.result
              }
            : current
        )
      );
    } catch (error) {
      console.error("Execution Failed:", error);
    }
  }

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        {!hasMessages ? (
          <WelcomeScreen onSelectSuggestion={handleSuggestion} />
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-5 px-4 py-6">
            <AnimatePresence initial={false}>
              {messages.map((message) =>
                message.role === "user" ? (
                  <UserMessage key={message.id} content={message.content} />
                ) : (
                  <AssistantMessage
                    key={message.id}
                    reply={message.content}
                    sql={message.sql}
                    result={message.result}
                    analysis={message.analysis}
                    onExecute={() => executeMessage(message)}
                  />
                )
              )}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{
                  opacity: 0
                }}
                animate={{
                  opacity: 1
                }}
                exit={{
                  opacity: 0
                }}
                className="flex"
              >
                <TypingIndicator />
              </motion.div>
            )}
          </div>
        )}
      </div>

      <ChatInput onSend={sendMessage} disabled={isTyping} />
    </div>
  );
}
