"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { mockExplanation, mockSql, type Suggestion } from "@/lib/mock-data";
import { AssistantMessage } from "./AssistantMessage";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { UserMessage } from "./UserMessage";
import { WelcomeScreen } from "./WelcomeScreen";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `msg-${idCounter}`;
}

export function ChatWorkspace() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  function sendMessage(content: string) {
    const userMessage: Message = { id: nextId(), role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const assistantMessage: Message = {
        id: nextId(),
        role: "assistant",
        content: mockExplanation
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1100);
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
                  <AssistantMessage key={message.id} reply={message.content} sql={mockSql} />
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
