'use client'

import { useEffect } from "react";

export default function ScreenDeviceProvider() {
    useEffect(() => {
        const updateFontSize = () => {
            const base = 16;
            const ratio = window.innerWidth / 440;
            document.documentElement.style.fontSize = `${base * ratio}px`;
        };
        updateFontSize();
        window.addEventListener("resize", updateFontSize);
        return () => window.removeEventListener("resize", updateFontSize);
    }, []);
    return null
}