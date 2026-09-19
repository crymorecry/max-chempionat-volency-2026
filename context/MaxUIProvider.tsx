"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";

const MaxUI = dynamic(() => import("@maxhub/max-ui").then((mod) => mod.MaxUI), { ssr: false });

export default function MaxUIProvider({ children }: { children: React.ReactNode }) {
    const { resolvedTheme } = useTheme();
    return <MaxUI colorScheme={resolvedTheme === "dark" ? "dark" : "light"}>{children}</MaxUI>;
}