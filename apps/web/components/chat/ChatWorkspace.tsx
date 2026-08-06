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

  sql?: string;

  result?: any;

  analysis?: {
    type: string;
    requiresConfirmation: boolean;
    firstKeyword: string;
  };
}

let idCounter = 0;

function nextId() {
  idCounter += 1;

  const id = `msg-${idCounter}`;

  console.log("Generated ID:", id);

  return id;
}

interface ChatWorkspaceProps {
  selectedConnection: DatabaseConnection | null;
}

export function ChatWorkspace({ selectedConnection }: ChatWorkspaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    console.group("Messages State");

    console.table(
      messages.map((m, index) => ({
        index,
        id: m.id,
        role: m.role,
        content: m.content
      }))
    );

    const ids = messages.map((m) => m.id);

    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);

    if (duplicates.length > 0) {
      console.error("Duplicate IDs Found:", duplicates);
    }

    console.groupEnd();
  }, [messages]);

  async function sendMessage(content: string) {
    if (!selectedConnection) {
      return;
    }

    const userMessage: Message = {
      id: nextId(),
      role: "user",
      content
    };

    console.log("User Message:", userMessage);

    setMessages((prev) => {
      const updated = [...prev, userMessage];

      console.log("After User Message:", updated);

      return updated;
    });

    setIsTyping(true);

    try {
      console.log("Sending question:", content);

      const response = await ChatService.query(selectedConnection.id, content);

      console.log("Backend Response:", response);

      const assistantMessage: Message = {
        id: nextId(),
        role: "assistant",
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
      console.error(error);

      const errorMessage: Message = {
        id: nextId(),
        role: "assistant",
        content: "Something went wrong."
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
    sendMessage(suggestion.label);
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
