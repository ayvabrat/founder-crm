"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { FullPageLoader } from "@/components/common/LoadingStates";
import { AuthService } from "@/lib/auth/auth-service";

export function AuthGate({ children }: { children: React.ReactNode }): React.JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    const check = async () => {
      const auth = await AuthService.isAuthenticated();
      if (!active) return;
      if (!auth && pathname !== "/login") {
        router.replace("/login");
        setReady(true);
        return;
      }
      if (auth && pathname === "/login") {
        router.replace("/contacts");
        setReady(true);
        return;
      }
      setReady(true);
    };
    void check();
    return () => {
      active = false;
    };
  }, [pathname, router]);

  if (!ready) return <FullPageLoader message="Проверяем сессию..." />;
  return <>{children}</>;
}

