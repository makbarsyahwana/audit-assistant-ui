"use client";

import { usePathname } from "next/navigation";
import { ModeProvider } from "@/contexts/ModeContext";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isChat = pathname === "/chat";

  return (
    <ModeProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          {!isChat && <Header />}
          <main className={isChat ? "flex-1 overflow-hidden" : "flex-1 overflow-y-auto p-6 scrollbar-thin"}>
            {children}
          </main>
        </div>
      </div>
    </ModeProvider>
  );
}
