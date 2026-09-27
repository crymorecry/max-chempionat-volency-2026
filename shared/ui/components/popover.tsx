'use client'

import React, { useState, useRef, useEffect, ReactNode } from "react"
import { cn } from "../utils/cn"

export type PopoverPosition = 'top' | 'bottom' | 'left' | 'right'
export type PopoverAlign = 'start' | 'center' | 'end'

export interface PopoverProps {
    children: ReactNode
    content: ReactNode
    isOpen?: boolean
    onOpenChange?: (open: boolean) => void
    position?: PopoverPosition
    align?: PopoverAlign
    trigger?: 'click' | 'hover' | 'manual'
    closeOnClickOutside?: boolean
    closeOnEscape?: boolean
    className?: string
    contentClassName?: string
    offset?: number
    disabled?: boolean
}

const Popover: React.FC<PopoverProps> = ({
    children,
    content,
    isOpen: controlledIsOpen,
    onOpenChange,
    position = 'bottom',
    align = 'end',
    trigger = 'click',
    closeOnClickOutside = true,
    closeOnEscape = true,
    className,
    contentClassName,
    offset = 8,
    disabled = false
}) => {
    const [internalIsOpen, setInternalIsOpen] = useState(false)
    const [triggerWidth, setTriggerWidth] = useState<number | null>(null)
    const popoverRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const triggerRef = useRef<HTMLDivElement>(null)

    // Управление состоянием: controlled или uncontrolled
    const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen
    const setIsOpen = (open: boolean) => {
        if (controlledIsOpen === undefined) {
            setInternalIsOpen(open)
        }
        onOpenChange?.(open)
    }

    // Синхронизация ширины с триггером
    useEffect(() => {
        if (isOpen && triggerRef.current) {
            const width = triggerRef.current.offsetWidth
            setTriggerWidth(width)
        }
    }, [isOpen])

    // Обработка клика вне элемента
    useEffect(() => {
        if (!isOpen || !closeOnClickOutside || trigger === 'manual') return

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node
            if (
                popoverRef.current &&
                !popoverRef.current.contains(target) &&
                contentRef.current &&
                !contentRef.current.contains(target)
            ) {
                setIsOpen(false)
            }
        }

        // Используем небольшую задержку, чтобы клики внутри успели обработаться
        const timeoutId = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside, true)
        }, 0)

        return () => {
            clearTimeout(timeoutId)
            document.removeEventListener('mousedown', handleClickOutside, true)
        }
    }, [isOpen, closeOnClickOutside, trigger])

    // Обработка Escape
    useEffect(() => {
        if (!isOpen || !closeOnEscape) return

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false)
            }
        }

        document.addEventListener('keydown', handleEscape)
        return () => {
            document.removeEventListener('keydown', handleEscape)
        }
    }, [isOpen, closeOnEscape])

    // Обработка триггеров
    const handleTriggerClick = () => {
        if (disabled || trigger !== 'click') return
        setIsOpen(!isOpen)
    }

    const handleMouseEnter = () => {
        if (disabled || trigger !== 'hover') return
        setIsOpen(true)
    }

    const handleMouseLeave = () => {
        if (disabled || trigger !== 'hover') return
        setIsOpen(false)
    }

    // Позиционирование
    const getPositionClasses = () => {
        const positionMap = {
            top: 'bottom-full mb-2',
            bottom: 'top-full mt-2',
            left: 'right-full mr-2',
            right: 'left-full ml-2'
        }

        const alignMap = {
            top: {
                start: 'left-0',
                center: 'left-1/2 -translate-x-1/2',
                end: 'right-0'
            },
            bottom: {
                start: 'left-0',
                center: 'left-1/2 -translate-x-1/2',
                end: 'right-0'
            },
            left: {
                start: 'top-0',
                center: 'top-1/2 -translate-y-1/2',
                end: 'bottom-0'
            },
            right: {
                start: 'top-0',
                center: 'top-1/2 -translate-y-1/2',
                end: 'bottom-0'
            }
        }

        return cn(
            positionMap[position],
            alignMap[position][align]
        )
    }

    const getTransformOrigin = () => {
        const originMap = {
            top: 'bottom',
            bottom: 'top',
            left: 'right',
            right: 'left'
        }
        return originMap[position]
    }

    const triggerProps = {
        onClick: handleTriggerClick,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave
    }

    return (
        <div
            ref={popoverRef}
            className={cn('relative inline-block w-full', className)}
            {...(trigger !== 'manual' ? triggerProps : {})}
        >
            <div ref={triggerRef} className="w-full">
                {children}
            </div>
            
            {isOpen && (
                <div
                    ref={contentRef}
                    className={cn(
                        'absolute z-50 flex w-full',
                        'bg-popover-background border border-popover-border rounded-lg shadow-lg',
                        'overflow-hidden',
                        getPositionClasses()
                    )}
                    style={{
                        backgroundColor: 'var(--color-popover-background)',
                        borderColor: 'var(--color-popover-border)',
                        color: 'var(--color-popover-text)',
                        animation: 'fadeInScale 0.2s ease-out forwards',
                        transformOrigin: getTransformOrigin(),
                        marginTop: position === 'bottom' ? `${offset}px` : undefined,
                        marginBottom: position === 'top' ? `${offset}px` : undefined,
                        marginLeft: position === 'right' ? `${offset}px` : undefined,
                        marginRight: position === 'left' ? `${offset}px` : undefined,
                        minWidth: '11rem' // min-w-44 = 11rem = 176px
                    }}
                    role="dialog"
                    aria-modal="false"
                >
                    <div className={cn('p-1', contentClassName)}>
                        {content}
                    </div>
                </div>
            )}
        </div>
    )
}

// Popover Content Component
export interface PopoverContentProps {
    children: ReactNode
    className?: string
}

const PopoverContent: React.FC<PopoverContentProps> = ({ children, className }) => (
    <div className={cn(className)}>
        {children}
    </div>
)

// Popover Trigger Component (для более гибкого использования)
export interface PopoverTriggerProps {
    children: ReactNode
    asChild?: boolean
    className?: string
}

const PopoverTrigger: React.FC<PopoverTriggerProps> = ({ children, asChild, className }) => {
    if (asChild && React.isValidElement(children)) {
        const childProps = children.props as { className?: string }
        return React.cloneElement(children, {
            className: cn(className, childProps.className)
        } as any)
    }
    
    return <div className={cn(className)}>{children}</div>
}

export { Popover, PopoverContent, PopoverTrigger }

