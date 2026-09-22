'use client'

import React, { useState, useRef, useEffect, ReactNode } from "react"
import ReactDOM from "react-dom"
import { cn } from "../utils/cn"
import { Text } from "./text"
export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right'
export type TooltipVariant = 'primary' | 'secondary'

export interface TooltipProps {
    children: ReactNode
    content: ReactNode
    position?: TooltipPosition
    variant?: TooltipVariant
    delay?: number
    disabled?: boolean
    className?: string
    contentClassName?: string
}

const Tooltip: React.FC<TooltipProps> = ({
    children,
    content,
    position = 'bottom',
    variant = 'primary',
    delay = 200,
    disabled = false,
    className,
    contentClassName
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const triggerRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)

    const updatePosition = () => {
        if (!triggerRef.current || !contentRef.current) return

        const triggerRect = triggerRef.current.getBoundingClientRect()
        const tooltipRect = contentRef.current.getBoundingClientRect()
        const gap = 8

        let top = 0
        let left = 0
        let transform = ''

        switch (position) {
            case 'top':
                top = triggerRect.top - tooltipRect.height - gap
                left = triggerRect.left + triggerRect.width / 2
                transform = 'translateX(-50%)'
                break
            case 'bottom':
                top = triggerRect.bottom + gap
                left = triggerRect.left + triggerRect.width / 2
                transform = 'translateX(-50%)'
                break
            case 'left':
                top = triggerRect.top + triggerRect.height / 2
                left = triggerRect.left - tooltipRect.width - gap
                transform = 'translateY(-50%)'
                break
            case 'right':
                top = triggerRect.top + triggerRect.height / 2
                left = triggerRect.right + gap
                transform = 'translateY(-50%)'
                break
        }

        setTooltipPosition({ top, left })
    }

    const handleMouseEnter = () => {
        if (disabled) return

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
            setIsOpen(true)
            requestAnimationFrame(() => {
                updatePosition()
                setIsVisible(true)
            })
        }, delay)
    }

    const handleMouseLeave = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }

        setIsVisible(false)
        setTimeout(() => {
            setIsOpen(false)
        }, 200)
    }

    useEffect(() => {
        if (!isOpen) return

        const handleScroll = () => {
            updatePosition()
        }

        const handleResize = () => {
            updatePosition()
        }

        window.addEventListener('scroll', handleScroll, true)
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('scroll', handleScroll, true)
            window.removeEventListener('resize', handleResize)
        }
    }, [isOpen, position])

    useEffect(() => {
        if (isOpen) {
            updatePosition()
        }
    }, [isOpen, content])

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    const getTransformOrigin = () => {
        const originMap = {
            top: 'bottom center',
            bottom: 'top center',
            left: 'right center',
            right: 'left center'
        }
        return originMap[position]
    }

    const getVariantStyles = () => {
        if (variant === 'primary') {
            return {
                backgroundColor: 'var(--color-tooltip-background-primary)',
                color: 'var(--color-tooltip-text-primary)'
            }
        } else {
            return {
                backgroundColor: 'var(--color-tooltip-background-secondary)',
                color: 'var(--color-tooltip-text-secondary)'
            }
        }
    }

    const getTransform = () => {
        const baseTransform = position === 'top' || position === 'bottom'
            ? 'translateX(-50%)'
            : 'translateY(-50%)'

        if (isVisible) {
            return `${baseTransform} translateY(0) scale(1)`
        }

        if (position === 'top') {
            return `${baseTransform} translateY(4px) scale(0.95)`
        }
        if (position === 'bottom') {
            return `${baseTransform} translateY(-4px) scale(0.95)`
        }
        if (position === 'left') {
            return `${baseTransform} translateX(4px) scale(0.95)`
        }
        return `${baseTransform} translateX(-4px) scale(0.95)`
    }

    if (!content) {
        return <>{children}</>
    }

    const tooltipContent = isOpen && typeof window !== 'undefined' ? ReactDOM.createPortal(
        <div
            ref={contentRef}
            className={cn(
                'fixed z-[9999] pointer-events-none',
                'px-2 py-1.5 rounded-lg',
                'shadow-lg',
                contentClassName
            )}
            style={{
                ...getVariantStyles(),
                top: `${tooltipPosition.top}px`,
                left: `${tooltipPosition.left}px`,
                opacity: isVisible ? 1 : 0,
                transform: getTransform(),
                transformOrigin: getTransformOrigin(),
                transition: 'opacity 0.2s ease-out, transform 0.2s ease-out'
            }}
            role="tooltip"
        >
            <Text className="max-w-72 w-full" size={'sm'}>
                {content}
            </Text>
        </div>,
        document.body
    ) : null

    return (
        <div
            ref={triggerRef}
            className={cn('inline-block', className)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            {tooltipContent}
        </div>
    )
}

// Tooltip Provider для группировки tooltips (опционально)
export interface TooltipProviderProps {
    children: ReactNode
    delay?: number
}

const TooltipProvider: React.FC<TooltipProviderProps> = ({
    children,
    delay = 200
}) => {
    return <>{children}</>
}

export { Tooltip, TooltipProvider }

