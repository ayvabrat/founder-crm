"use client";

import { BarChart3, Bell, Settings, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ru } from "@/constants/i18n/ru";
import { cn } from "@/lib/utils/helpers";

const items = [
  { href: "/contacts", label: ru.nav.contacts, icon: Users },
  { href: "/followups", label: ru.nav.followUps, icon: Bell },
  { href: "/analysis", label: ru.nav.analysis, icon: BarChart3 },
  { href: "/settings", label: ru.nav.settings, icon: Settings },
];

export function BottomNav(): React.JSX.Element {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 mx-auto flex w-full max-w-md items-center justify-around border-t border-zinc-800 bg-background/95 px-2 py-3 backdrop-blur">
      {items.map((item) => {
        const active = pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link key={item.href} href={item.href} className={cn("flex flex-col items-center text-xs text-zinc-500", active && "text-primary")}>
            <Icon className="mb-1 h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
