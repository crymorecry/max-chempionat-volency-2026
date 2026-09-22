'use client'

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '../utils/cn'
import { XMarkIcon, CheckCircleIcon, XCircleIcon, InformationCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { Text } from './text'

export type ToastVariant = 'success' | 'error' | 'info' | 'warning'
export type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'

export interface Toast {
    id: string
    message: string
    variant: ToastVariant
    duration?: number
}

interface ToastContextType {
    toasts: Toast[]
    showToast: (message: string, variant?: ToastVariant, duration?: number) => void
    removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within ToastProvider')
    }
    return context
}

export function ToastProvider({ children, position = 'bottom-center' }: { children: ReactNode; position?: ToastPosition }) {
    const [toasts, setToasts] = useState<Toast[]>([])
    const [removingIds, setRemovingIds] = useState<Set<string>>(new Set())

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
        setRemovingIds((prev) => {
            const next = new Set(prev)
            next.delete(id)
            return next
        })
    }, [])

    const startRemoving = useCallback((id: string) => {
        setRemovingIds((prev) => new Set([...prev, id]))
    }, [])

    const showToast = useCallback((message: string, variant: ToastVariant = 'info', duration: number = 5000) => {
        const id = Math.random().toString(36).substring(7)
        const newToast: Toast = { id, message, variant, duration }
        
        setToasts((prev) => [...prev, newToast])

        if (duration > 0) {
            setTimeout(() => {
                startRemoving(id)
                setTimeout(() => {
                    removeToast(id)
                }, 300) // Время анимации исчезновения
            }, duration)
        }
    }, [removeToast, startRemoving])

    return (
        <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
            {children}
            <Toaster toasts={toasts} position={position} onRemove={removeToast} removingIds={removingIds} onStartRemoving={startRemoving} />
        </ToastContext.Provider>
    )
}

interface ToasterProps {
    toasts: Toast[]
    position: ToastPosition
    onRemove: (id: string) => void
    removingIds: Set<string>
    onStartRemoving: (id: string) => void
}

function Toaster({ toasts, position, onRemove, removingIds, onStartRemoving }: ToasterProps) {
    const getPositionClasses = () => {
        const positionMap = {
            'top-left': 'top-4 left-4',
            'top-center': 'top-4 left-1/2 -translate-x-1/2',
            'top-right': 'top-4 right-4',
            'bottom-left': 'bottom-4 left-4',
            'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
            'bottom-right': 'bottom-4 right-4',
        }
        return positionMap[position]
    }

    if (toasts.length === 0) return null

    return (
        <div
            className={cn('fixed z-[99999] flex flex-col gap-2', getPositionClasses())}
            style={{ pointerEvents: 'none' }}
        >
            {toasts.map((toast) => (
                <ToastItem 
                    key={toast.id} 
                    toast={toast} 
                    onRemove={onRemove}
                    isRemoving={removingIds.has(toast.id)}
                    onStartRemoving={onStartRemoving}
                />
            ))}
        </div>
    )
}

interface ToastItemProps {
    toast: Toast
    onRemove: (id: string) => void
    isRemoving: boolean
    onStartRemoving: (id: string) => void
}

function ToastItem({ toast, onRemove, isRemoving, onStartRemoving }: ToastItemProps) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Плавное появление
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setIsVisible(true)
            })
        })
    }, [])

    useEffect(() => {
        if (isRemoving) {
            const timer = setTimeout(() => {
                onRemove(toast.id)
            }, 300) // Время анимации исчезновения
            return () => clearTimeout(timer)
        }
    }, [isRemoving, toast.id, onRemove])

    const handleRemove = () => {
        onStartRemoving(toast.id)
    }

    const getIcon = () => {
        switch (toast.variant) {
            case 'success':
                return <CheckCircleIcon className="w-6 h-6" />
            case 'error':
                return <XCircleIcon className="w-6 h-6" />
            case 'warning':
                return <ExclamationTriangleIcon className="w-6 h-6" />
            case 'info':
            default:
                return <InformationCircleIcon className="w-6 h-6" />
        }
    }

    const getVariantColors = () => {
        switch (toast.variant) {
            case 'success':
                return { accentColor: 'var(--color-alert-success-background)' }
            case 'error':
                return { accentColor: 'var(--color-alert-destructive-background)' }
            case 'warning':
                return { accentColor: 'var(--color-alert-warning-background)' }
            case 'info':
            default:
                return { accentColor: 'var(--color-alert-info-background)' }
        }
    }

    const { accentColor } = getVariantColors()

    return (
        <div
            className={cn(
                'min-w-[300px] max-w-sm px-3.5 py-2.5 rounded-lg shadow-lg flex relative',
                'flex items-center gap-2.5 overflow-hidden',
                'transition-all duration-300 ease-in-out'
            )}
            style={{
                backgroundColor: 'var(--color-toast-background)',
                color: 'var(--color-text-primary)',
                border: '1px solid var(--color-card-border)',
                boxShadow: '0 12px 32px -22px rgba(0,0,0,0.32), 0 6px 18px -18px rgba(0,0,0,0.24)',
                pointerEvents: 'auto',
                opacity: isVisible && !isRemoving ? 1 : 0,
                transform: isVisible && !isRemoving ? 'translateY(0) scale(1)' : isRemoving ? 'translateY(8px) scale(0.95)' : 'translateY(20px) scale(0.95)',
                transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
            }}
            role="alert"
        >
            <div
                className="absolute left-0 top-0 h-full w-1"
                style={{ backgroundColor: accentColor, opacity: 0.9 }}
            />
            <div className="relative flex items-center gap-2.5 w-full pr-9">
                <div
                    className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-black/5 dark:ring-white/10"
                    style={{
                        color: accentColor,
                        backgroundColor: 'var(--color-toast-background)',
                        boxShadow: '0 10px 28px -18px rgba(0,0,0,0.35)',
                    }}
                >
                    {getIcon()}
                </div>
                <Text size="base" variant="primary" className="leading-relaxed">{toast.message}</Text>
            </div>
            <button
                onClick={handleRemove}
                className="shrink-0 hover:opacity-70 transition-opacity absolute top-4 right-4"
            >
                <XMarkIcon className="w-4 h-4" />
            </button>
        </div>
    )
}

