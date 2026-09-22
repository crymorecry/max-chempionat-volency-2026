'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { XIcon } from 'lucide-react'

type DrawerProps = {
    children: ReactNode
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    placement?: 'top' | 'bottom' | 'left' | 'right'
    showCloseButton?: boolean
    contentClassName?: string
}

const ANIMATION_DURATION = 300

const placementClasses = {
    bottom: {
        position: 'inset-x-0 bottom-0 max-h-[90dvh] rounded-t-2xl',
        opened: 'translate-y-0',
        closed: 'translate-y-full',
    },
    top: {
        position: 'inset-x-0 top-0 max-h-[90dvh] rounded-b-2xl',
        opened: 'translate-y-0',
        closed: '-translate-y-full',
    },
    left: {
        position: 'inset-y-0 left-0 h-full w-[min(90vw,420px)] rounded-r-2xl',
        opened: 'translate-x-0',
        closed: '-translate-x-full',
    },
    right: {
        position: 'inset-y-0 right-0 h-full w-[min(90vw,420px)] rounded-l-2xl',
        opened: 'translate-x-0',
        closed: 'translate-x-full',
    },
} as const

export default function Drawer({
    children,
    isOpen,
    onOpenChange,
    placement = 'bottom',
    showCloseButton = true,
    contentClassName = '',
}: DrawerProps) {
    const [mounted, setMounted] = useState(false)
    const [shouldRender, setShouldRender] = useState(isOpen)

    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return

        if (isOpen) {
            setShouldRender(true)
            setIsVisible(false)

            let frame1 = 0
            let frame2 = 0

            frame1 = requestAnimationFrame(() => {
                frame2 = requestAnimationFrame(() => {
                    setIsVisible(true)
                })
            })

            return () => {
                cancelAnimationFrame(frame1)
                cancelAnimationFrame(frame2)
            }
        }

        setIsVisible(false)

        const timer = window.setTimeout(() => {
            setShouldRender(false)
        }, ANIMATION_DURATION)

        return () => window.clearTimeout(timer)
    }, [isOpen, mounted])

    useEffect(() => {
        if (!isOpen) return

        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && showCloseButton === true) {
                onOpenChange(false)
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            document.body.style.overflow = previousOverflow
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [isOpen, onOpenChange, showCloseButton])

    if (!mounted || !shouldRender) return null

    const classes = placementClasses[placement]

    return createPortal(
        <div
            className="fixed inset-0 z-[99999]"
            aria-hidden={!isVisible}
        >
            <button
                type="button"
                aria-label="Закрыть drawer"
                onClick={() => showCloseButton && onOpenChange(false)}
                className={`
          absolute inset-0
          bg-black/45 backdrop-blur-[2px]
          transition-opacity duration-300 ease-out
          ${isVisible ? 'opacity-100' : 'opacity-0'}
        `}
            />

            <div
                role="dialog"
                aria-modal="true"
                className={`
          absolute flex flex-col overflow-hidden
          bg-white shadow-2xl dark:bg-zinc-950
          transform-gpu
          transition-transform duration-300 ease-out
          ${classes.position}
          ${isVisible ? classes.opened : classes.closed}
          ${contentClassName}
        `}
            >
                {placement === 'bottom' && (
                    <div className="flex justify-center py-2">
                        <div className="h-1 w-10 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                    </div>
                )}

                {showCloseButton && (
                    <button
                        type="button"
                        aria-label="Закрыть"
                        onClick={() => onOpenChange(false)}
                        className="
              absolute right-3 top-3 z-20
              grid h-9 w-9 place-items-center
              rounded-full bg-white/80 text-zinc-700 shadow-sm
              backdrop-blur-md transition
              hover:bg-white
              dark:bg-zinc-900/80 dark:text-zinc-200 dark:hover:bg-zinc-900
            "
                    >
                        <XIcon size={20} />
                    </button>
                )}

                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pt-8 pb-16 w-11/12 mx-auto">
                    {children}
                </div>
            </div>
        </div>,
        document.body,
    )
}
