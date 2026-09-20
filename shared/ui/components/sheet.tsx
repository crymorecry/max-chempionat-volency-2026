"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/shared/ui/utils/cn";
import { Text } from "./text";

interface SheetProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string | React.ReactNode;
    children: React.ReactNode;
    className?: string;
    headerClassName?: string;
    contentClassName?: string;
    showCloseButton?: boolean;
    enableSwipeToClose?: boolean;
    swipeExcludeSelectors?: string[];
    contentHeader?: React.ReactNode;
}

export default function Sheet({
    isOpen,
    onClose,
    title,
    children,
    className,
    headerClassName,
    contentClassName,
    showCloseButton = true,
    enableSwipeToClose = true,
    swipeExcludeSelectors = [
        "[data-swiper]",
        "[data-radix-popper-content-wrapper]",
    ],
}: SheetProps) {
    const [mounted, setMounted] = useState(false);
    const [shouldRender, setShouldRender] = useState(isOpen);
    const [isClosing, setIsClosing] = useState(false);

    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            setIsClosing(false);
            return;
        }

        if (shouldRender) {
            setIsClosing(true);

            const timer = setTimeout(() => {
                setShouldRender(false);
                setIsClosing(false);
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [isOpen, shouldRender]);

    useEffect(() => {
        if (shouldRender) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [shouldRender]);

    const handleClose = () => {
        if (!isOpen) return;
        setIsClosing(true);
        onClose();
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (!enableSwipeToClose) return;

        const target = e.target as Element;

        const isExcluded = swipeExcludeSelectors.some((selector) =>
            target.closest(selector),
        );

        if (isExcluded) return;

        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!enableSwipeToClose) return;

        const target = e.target as Element;

        const isExcluded = swipeExcludeSelectors.some((selector) =>
            target.closest(selector),
        );

        if (isExcluded) return;

        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (
            !enableSwipeToClose ||
            touchStart === null ||
            touchEnd === null
        ) {
            return;
        }

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance < -100;

        if (isLeftSwipe && isOpen) {
            handleClose();
        }
    };

    if (!mounted || !shouldRender) {
        return null;
    }

    return createPortal(
        <div
            className={cn(
                "fixed inset-0 flex flex-col bg-white dark:bg-volen-900 h-screen w-screen z-[999]",
                isClosing ? "animate-slideOut" : "animate-slideIn",
                className,
            )}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {(title || showCloseButton) && (
                <div
                    className={cn(
                        "w-full fixed top-0 left-0 right-0 z-50 bg-white dark:bg-volen-900 border-b border-volen-200 dark:border-volen-700",
                        headerClassName,
                    )}
                >
                    <div className="flex items-center h-10">
                        <div
                            className={`flex items-center max-w-full gap-x-3 w-11/12 mx-auto ${showCloseButton
                                ? "grid grid-cols-3"
                                : "justify-center"
                                }`}
                        >
                            {showCloseButton && (
                                <button
                                    onClick={handleClose}
                                    className="px-2 py-1 rounded-full transition-colors duration-200 min-w-[56px] flex w-fit"
                                    aria-label="Закрыть"
                                >
                                    <ArrowLeft className="w-5 h-5 text-volen-800 dark:text-volen-200" />
                                </button>
                            )}

                            {title && (
                                <Text
                                    size="base"
                                    variant="primary"
                                    className="leading-none text-center"
                                >
                                    {title}
                                </Text>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div
                className={cn(
                    "flex-1 flex flex-col overflow-hidden",
                    title || showCloseButton ? "pt-10" : "",
                    contentClassName,
                )}
            >
                {children}
            </div>
        </div>,
        document.body,
    );
}