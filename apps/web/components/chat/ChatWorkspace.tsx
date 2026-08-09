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
}

export function ChatWorkspace({ selectedConnection }: ChatWorkspaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);

  const [isTyping, setIsTyping] = useState(false);

  const [conversationId, setConversationId] = useState<string | undefined>(undefined);

  useEffect(() => {
    setConversationId(undefined);
    setMessages([]);
  }, [selectedConnection?.id]);

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
    if (!selectedConnection) {
      console.warn("Cannot send message: no database connection selected.");

      return;
    }

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      return;
    }

    const userMessage: Message = {
      id: nextId(),
      role: "user",
      content: trimmedContent
    };

    console.log("User Message:", userMessage);

    setMessages((prev) => {
      const updated = [...prev, userMessage];

      console.log("After User Message:", updated);

      return updated;
    });

    setIsTyping(true);

    try {
      console.group("Chat Request");

      console.log("Connection ID:", selectedConnection.id);

      console.log("Conversation ID:", conversationId ?? "NEW");

      console.log("Question:", trimmedContent);

      const response = await ChatService.query(
        selectedConnection.id,
        trimmedContent,
        conversationId
      );

      console.log("Backend Response:", response);

      console.groupEnd();

      if (response.conversationId) {
        setConversationId(response.conversationId);

        console.log("Conversation ID:", response.conversationId);
      }

      const assistantMessage: Message = {
        id: nextId(),

        role: "assistant",

        connectionId: selectedConnection.id,

        content: response.message ?? "Query generated successfully.",

        sql: response.generatedQuery ?? undefined,

        result: response.result,

        analysis: response.analysis
      };

      console.log("Assistant Message:", assistantMessage);

      setMessages((prev) => {
        const updated = [...prev, assistantMessage];

        console.log("After Assistant Message:", updated);

        return updated;
      });
    } catch (error) {
      console.error("Failed to process chat request:", error);

      const errorMessage: Message = {
        id: nextId(),

        role: "assistant",

        content: "Something went wrong while processing your request."
      };

      console.log("Error Message:", errorMessage);

      setMessages((prev) => {
        const updated = [...prev, errorMessage];

        console.log("After Error Message:", updated);

        return updated;
      });
    } finally {
      setIsTyping(false);
    }
  }

  function handleSuggestion(suggestion: Suggestion) {
    void sendMessage(suggestion.label);
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
                    onExecute={async () => {
                      if (!message.sql || !message.connectionId) {
                        return;
                      }

                      try {
                        console.log("Executing Query:", message.sql);

                        console.log("Connection ID:", message.connectionId);

                        const response = await ChatService.execute(
                          message.connectionId,
                          message.sql
                        );

                        console.log("Execution Response:", response);

                        setMessages((prev) =>
                          prev.map((currentMessage) =>
                            currentMessage.id === message.id
                              ? {
                                  ...currentMessage,
                                  result: response.result
                                }
                              : currentMessage
                          )
                        );
                      } catch (error) {
                        console.error("Execution Failed:", error);
                      }
                    }}
                  />
                )
              )}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
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
