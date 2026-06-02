"use client";

import { motion } from "framer-motion";
import { Menu, Activity, User } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function Topbar() {
  const { toggleSidebar } = useAppStore();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center justify-between border-b border-border/40 bg-background/80 backdrop-blur-xl px-6"
    >
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-2 w-2 rounded-full bg-emerald-500">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping absolute" />
          </div>
          <Badge variant="secondary" className="text-xs font-normal">
            <Activity className="mr-1 h-3 w-3" />
            Online
          </Badge>
        </div>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
            U
          </AvatarFallback>
        </Avatar>
      </div>
    </motion.header>
  );
}
