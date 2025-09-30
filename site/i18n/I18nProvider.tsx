"use client";

import { createContext, ReactNode, useContext, useMemo } from "react";

type Messages = Record<string, string>;

const I18nContext = createContext<Messages>({});

export function I18nProvider({ messages, children }: { messages: Messages; children: ReactNode }) {
  const value = useMemo(() => messages, [messages]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useT() {
  const messages = useContext(I18nContext);
  return (key: string, fallback?: string) => messages[key] ?? fallback ?? key;
}


