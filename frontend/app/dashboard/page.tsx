"use client";

import { Topbar } from "@/components/dashboard/Topbar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { useAppStore } from "@/store/useAppStore";

export default function DashboardPage() {
  const { isSidebarOpen } = useAppStore();

  return (
    <div className="min-h-screen bg-background">
      <Topbar />
      <Sidebar />
      <main
        className={`pt-16 transition-all duration-300 ${
          isSidebarOpen ? "ml-[320px]" : "ml-0"
        }`}
      >
        <div className="relative h-[calc(100vh-4rem)]">
          <ChatWindow />
        </div>
      </main>
    </div>
  );
}
