import { VariantProps, cva } from "class-variance-authority"
import { cn } from "../utils/cn"
import React from "react"

const buttonVariants = cva('inline-flex items-center justify-center rounded-lg font-medium transition-all', {
    variants: {
        size: {
            sm: 'h-9 rounded-xl gap-1.5 px-3 text-sm',
            default: 'h-11 rounded-xl px-4 py-2 text-base',
            lg: 'h-12 rounded-2xl px-6 text-base',
            xl: 'h-13 rounded-2xl px-7 text-lg',
            '2xl': 'h-14 rounded-2xl px-8 text-lg',
        },
        width: {
            fit: 'w-fit',
            full: 'w-full',
        },
        variant: {
            primary: 'hover:!bg-[var(--color-button-background-primary-hover)] disabled:hover:!bg-[var(--color-button-background-primary)]',
            secondary: 'hover:!bg-[var(--color-button-background-secondary-hover)] disabled:hover:!bg-[var(--color-button-background-secondary)]',
            ghost: 'hover:!bg-volen-100 disabled:hover:!bg-volen-100 dark:hover:!bg-volen-700 dark:disabled:hover:!bg-volen-700',
            danger: 'hover:!bg-[var(--color-button-background-destructive-hover)] disabled:hover:!bg-[var(--color-button-background-destructive)]',
            outline: 'hover:!bg-volen-100 disabled:hover:!bg-volen-100 dark:hover:!bg-volen-700 dark:disabled:hover:!bg-volen-700 border border-card-border'
        },
    },
    defaultVariants: {
        size: 'default',
        width: 'fit',
        variant: 'primary',
    },
})

export interface ButtonProps
    extends Omit<React.HTMLAttributes<HTMLElement>, 'color'>,
    VariantProps<typeof buttonVariants> {
    as?: keyof React.JSX.IntrinsicElements
    disabled?: boolean
    loading?: string
    type?: 'button' | 'submit' | 'reset'
}

const Button = React.forwardRef<HTMLElement, ButtonProps>(
    ({ className, size, width, variant = 'primary', as = 'button', disabled, loading, children, ...props }, ref) => {
        const getVariantStyles = () => {
            switch (variant) {
                case 'primary':
                    return {
                        backgroundColor: 'var(--color-button-background-primary)',
                        color: 'var(--color-button-text-primary)',
                        border: 'none'
                    }
                case 'secondary':
                    return {
                        backgroundColor: 'var(--color-button-background-secondary)',
                        color: 'var(--color-button-text-secondary)',
                        border: 'none'
                    }
                case 'ghost':
                    return {
                        backgroundColor: 'var(--color-button-background-ghost)',
                        color: 'var(--color-button-text-ghost)',
                        border: 'none'
                    }
                case 'danger':
                    return {
                        backgroundColor: 'var(--color-button-background-destructive)',
                        color: 'var(--color-button-text-destructive)',
                        border: 'none'
                    }
            }
        }

        const baseStyles = {
            ...getVariantStyles(),
            opacity: disabled ? 0.5 : 1,
            cursor: disabled ? 'not-allowed' : 'pointer',
        }

        if (loading) {
            return (
                <div
                    className={cn(buttonVariants({ size, width, variant, className }), 'gap-2')}
                    style={baseStyles}
                >
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>{loading}</span>
                </div>
            )
        }

        return React.createElement(as, {
            ref,
            className: cn(buttonVariants({ size, width, variant, className })),
            style: baseStyles,
            disabled,
            children,
            ...props,
        })
    }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
