"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function SessionGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("pg_auth");

    // Public routes
    const publicRoutes = ["/login", "/register"];

    if (!isLoggedIn && !publicRoutes.includes(pathname)) {
      router.replace("/login");
    } else {
      setChecking(false);
    }
  }, [pathname, router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}