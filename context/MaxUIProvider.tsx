"use client";

import dynamic from "next/dynamic";
import { useTheme } from "@teispace/next-themes";
import '@maxhub/max-ui/dist/styles.css';
import { useEffect } from "react";

const MaxUI = dynamic(() => import("@maxhub/max-ui").then((mod) => mod.MaxUI), { ssr: false });

export default function MaxUIProvider({ children }: { children: React.ReactNode }) {
    const { resolvedTheme } = useTheme();
    useEffect(() => {
        console.log(resolvedTheme);
    }, [resolvedTheme]);
    return <MaxUI colorScheme={resolvedTheme === "dark" ? "dark" : "light"}>{children}</MaxUI>;
}