"use client";

import { ReactNode } from "react";
import { EmptyConnectionCard } from "./EmptyConnectionCard";

interface ConnectionGateProps {
  children: ReactNode;
}

const connections: unknown[] = [];

export function ConnectionGate({ children }: ConnectionGateProps) {
  if (connections.length === 0) {
    return (
      <div className="relative h-full w-full">
        {/* Blurred Background */}
        <div className="pointer-events-none h-full w-full blur-sm opacity-40 select-none">
          {children}
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
          <EmptyConnectionCard
            onCreateConnection={() => {
              console.log("Open Create Connection Dialog");
            }}
          />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
