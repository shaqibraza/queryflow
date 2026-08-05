"use client";

import { ReactNode } from "react";

interface ConnectionGateProps {
  hasConnection: boolean;
  children: ReactNode;
}

export function ConnectionGate({ hasConnection, children }: ConnectionGateProps) {
  if (!hasConnection) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
