"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

const PUBLIC_ROUTES = ["/login", "/register", "/api/auth"];

export default function SessionGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const isPublicRoute = PUBLIC_ROUTES.some((route) =>
      pathname.startsWith(route)
    );

    if (isPublicRoute) {
      setReady(true);
      return;
    }

    const active = sessionStorage.getItem("pg_auth") === "1";

    if (!active) {
      signOut({ redirect: false }).finally(() => {
        router.replace("/login");
      });
      return;
    }

    setReady(true);
  }, [pathname, router]);

  if (!ready && !PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return <div className="min-h-screen bg-black" />;
  }

  return <>{children}</>;
}