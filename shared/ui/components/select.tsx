'use client'
import React, { useState, useEffect } from "react"
import { cn } from "../utils/cn"
import { ChevronDownIcon } from "@heroicons/react/24/outline"
import { Popover } from "./popover"

export type SelectSize = 'sm' | 'default' | 'lg'
export type SelectVariant = 'default' | 'outline' | 'none'

export interface SelectOption {
    label: string
    value: string | number
    disabled?: boolean
}

export interface SelectProps {
    options: SelectOption[]
    value?: string | number
    placeholder?: string
    label?: string
    helperText?: string
    size?: SelectSize
    variant?: SelectVariant
    disabled?: boolean
    error?: boolean
    onChange?: (value: string | number) => void
    className?: string
    icon?: React.ReactNode
}

const Select: React.FC<SelectProps> = ({
    options,
    value,
    placeholder = "Select option...",
    label,
    helperText,
    size = 'default',
    variant = 'default',
    disabled = false,
    error = false,
    onChange,
    className,
    icon
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedOption, setSelectedOption] = useState<SelectOption | null>(null)

    useEffect(() => {
        const option = options.find(opt => opt.value === value)
        setSelectedOption(option || null)
    }, [value, options])

    const handleSelect = (option: SelectOption) => {
        if (option.disabled) return

        setSelectedOption(option)
        setIsOpen(false)
        onChange?.(option.value)
    }

    const selectId = React.useId()

    // Size classes
    const sizeClasses = {
        sm: 'h-8 text-sm px-3',
        default: 'h-10 text-base px-4',
        lg: 'h-12 text-lg px-5'
    }

    // Icon size classes
    const iconSizeClasses = {
        sm: 'w-3 h-3',
        default: 'w-4 h-4',
        lg: 'w-5 h-5'
    }

    // Variant styles
    const getVariantStyles = () => {
        switch (variant) {
            case 'default':
                return {
                    backgroundColor: 'var(--color-combobox-background)',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: error
                        ? 'var(--color-destructive)'
                        : 'var(--color-input-border-outline)'
                }
            case 'outline':
                return {
                    backgroundColor: 'transparent',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: error
                        ? 'var(--color-destructive)'
                        : 'var(--color-input-border-outline)'
                }
            case 'none':
                return {
                    backgroundColor: 'transparent',
                    borderWidth: '0px',
                    borderStyle: 'none',
                    borderColor: 'transparent'
                }
        }
    }

    const getVariantClasses = () => {
        switch (variant) {
            case 'default':
                return 'border-2'
            case 'outline':
                return 'border-2'
            case 'none':
                return 'border-0'
        }
    }

    const popoverContent = (
        <ul
            className="w-full bg-combobox-background overflow-hidden cursor-pointer min-w-44"
            role="listbox"
            aria-labelledby={selectId}
            style={{
                backgroundColor: 'var(--color-combobox-background)'
            }}
        >
            {options.map((option) => {
                const isSelected = selectedOption?.value === option.value
                return (
                    <li key={option.value} role="option" aria-selected={isSelected}>
                        <button
                            type="button"
                            onClick={() => handleSelect(option)}
                            disabled={option.disabled}
                            className={cn(
                                'w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer',
                                'hover:bg-combobox-selected',
                                isSelected && 'bg-combobox-selected',
                                option.disabled && 'opacity-50 cursor-not-allowed',
                            )}
                            style={{
                                backgroundColor: isSelected ? 'var(--color-combobox-selected)' : undefined,
                                color: 'var(--color-combobox-text)'
                            }}
                            onMouseEnter={(e) => {
                                if (!option.disabled && !isSelected) {
                                    e.currentTarget.style.backgroundColor = 'var(--color-combobox-selected)'
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isSelected) {
                                    e.currentTarget.style.backgroundColor = ''
                                }
                            }}
                        >
                            {option.label}
                        </button>
                    </li>
                )
            })}
        </ul>
    )

    return (
        <div className={cn('flex flex-col gap-y-2 w-fit', className)}>
            {label && (
                <label
                    htmlFor={selectId}
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: 'var(--color-text-primary)' }}
                >
                    {label}
                </label>
            )}

            <Popover
                content={popoverContent}
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                trigger="click"
                position="bottom"
                align="end"
                disabled={disabled}
                offset={4}
                contentClassName="p-0 w-full flex min-w-44"
            >
                <button
                    id={selectId}
                    type="button"
                    disabled={disabled}
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                    className={cn(
                        'w-full gap-x-4 flex items-center justify-between cursor-pointer',
                        'text-combobox-text rounded-lg ',
                        'transition-colors',
                        'focus:outline-none focus:ring-2 focus:ring-primary border-2 rounded-lg ',
                        sizeClasses[size],
                        getVariantClasses(),
                        disabled && 'opacity-50 cursor-not-allowed',
                        isOpen && variant !== 'none' && 'ring-2 ring-primary',
                        className
                    )}
                    style={{
                        ...getVariantStyles(),
                        color: 'var(--color-combobox-text)',
                        backgroundColor:'transparent',
                        borderColor: 'var(--color-input-border-outline)'
                    } as React.CSSProperties}
                >
                    <div className="flex gap-x-2 items-center cursor-pointer">
                        {icon}
                        <span className={cn(
                            'truncate text-left font-medium',
                            !selectedOption && 'text-combobox-placeholder'
                        )} style={{
                            color: !selectedOption ? 'var(--color-combobox-placeholder)' : undefined
                        }}>
                            {selectedOption ? selectedOption.label : placeholder}
                        </span>
                    </div>
                    <ChevronDownIcon
                        className={cn(
                            'transition-transform duration-200',
                            iconSizeClasses[size],
                            isOpen && 'rotate-180'
                        )}
                    />
                </button>
            </Popover>

            {helperText && (
                <div
                    className="mt-1.5 text-sm"
                    style={{
                        color: error
                            ? 'var(--color-destructive)'
                            : 'var(--color-text-secondary)'
                    }}
                >
                    {helperText}
                </div>
            )}
        </div>
    )
}

export { Select }


