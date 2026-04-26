"use client";

import { usePathname } from "next/navigation";

import { AuthGate } from "@/components/auth/AuthGate";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { OfflineIndicator } from "@/components/common/OfflineIndicator";
import { BottomNav } from "@/components/layout/BottomNav";
import { ThemeSync } from "@/components/layout/ThemeSync";
import { ToastViewport } from "@/components/ui/toast";

export function ClientShell({ children }: { children: React.ReactNode }): React.JSX.Element {
  const pathname = usePathname();
  const isLogin = pathname === "/login";
  return (
    <ErrorBoundary>
      <AuthGate>
        <ThemeSync />
        {isLogin ? (
          <>{children}</>
        ) : (
          <>
            <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-24 pt-4">
              <OfflineIndicator />
              {children}
            </main>
            <BottomNav />
          </>
        )}
        <ToastViewport />
      </AuthGate>
    </ErrorBoundary>
  );
}

