'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Calendar } from './calendar'
import { Popover } from './popover'
import { Button } from './button'
import { CalendarIcon } from 'lucide-react'
import { ru } from 'date-fns/locale'
import { cn } from '../utils/cn'
import { Text } from './text'
import { Tooltip } from './tooltip'
import { InfoIcon } from 'lucide-react'

export type InputSize = 'sm' | 'default' | 'lg'

export interface DateInputProps {
    value?: Date | null
    onChange: (date: Date | null) => void
    disabled?: boolean
    className?: string
    error?: boolean
    onError?: (hasError: boolean) => void
    showCalendar?: boolean
    calendarPosition?: 'top' | 'bottom' | 'auto'
    minDate?: Date
    label?: string
    helperText?: string
    tooltip?: string
    tooltipPosition?: 'top' | 'bottom' | 'left' | 'right'
    size?: InputSize
}

interface DateParts {
    day: string
    month: string
    year: string
}

const DateInput: React.FC<DateInputProps> = ({
    value,
    onChange,
    disabled = false,
    className = "",
    error = false,
    onError,
    showCalendar = true,
    calendarPosition = 'bottom',
    minDate,
    label,
    helperText,
    tooltip,
    tooltipPosition = 'top',
    size = 'default'
}) => {
    const t = useTranslations('ui.dateInput')
    const toDateParts = (d: Date) => ({
        day: d.getUTCDate().toString().padStart(2, '0'),
        month: (d.getUTCMonth() + 1).toString().padStart(2, '0'),
        year: d.getUTCFullYear().toString()
    })

    const [date, setDate] = useState<DateParts>(() => {
        if (value && !isNaN(value.getTime())) return toDateParts(value)
        return { day: '', month: '', year: '' }
    })

    const [isValid, setIsValid] = useState(true)
    const [focusedField, setFocusedField] = useState<keyof DateParts | null>(null)
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)
    const [resolvedCalendarPosition, setResolvedCalendarPosition] = useState<'top' | 'bottom'>('bottom')

    const monthRef = useRef<HTMLInputElement>(null)
    const dayRef = useRef<HTMLInputElement>(null)
    const yearRef = useRef<HTMLInputElement>(null)
    const calendarButtonRef = useRef<HTMLButtonElement>(null)
    const justOpenedRef = useRef(false)

    const refs = { month: monthRef, day: dayRef, year: yearRef }
    const inputId = React.useId()
    const estimateCalendarPosition = useCallback((): 'top' | 'bottom' => {
        const anchorRect = calendarButtonRef.current?.getBoundingClientRect() ?? dayRef.current?.getBoundingClientRect()
        if (!anchorRect) return 'bottom'

        const CALENDAR_HEIGHT_ESTIMATE = 320
        const spaceBelow = window.innerHeight - anchorRect.bottom
        const spaceAbove = anchorRect.top

        if (spaceBelow < CALENDAR_HEIGHT_ESTIMATE && spaceAbove > spaceBelow) {
            return 'top'
        }

        return 'bottom'
    }, [])

    const sizeClasses = {
        sm: 'h-8 text-sm px-3',
        default: 'h-10 text-base px-2 pr-4',
        lg: 'h-12 text-lg px-5'
    }

    // Обновляем состояние при изменении value извне (только когда пользователь не редактирует)
    useEffect(() => {
        if (focusedField) return
        if (value && !isNaN(value.getTime())) {
            setDate(toDateParts(value))
            setIsValid(true)
        } else if (value === null || value === undefined) {
            setDate({ day: '', month: '', year: '' })
            setIsValid(true)
        }
    }, [value, focusedField])

    // Защита от немедленного закрытия popover после открытия
    useEffect(() => {
        if (isCalendarOpen) {
            justOpenedRef.current = true
            const timer = setTimeout(() => {
                justOpenedRef.current = false
            }, 200)
            return () => clearTimeout(timer)
        }
    }, [isCalendarOpen])

    // Валидация даты
    const validateDate = useCallback((dateParts: DateParts): boolean => {
        const { day, month, year } = dateParts

        if (!day || !month || !year) return true // Пустые поля считаем валидными

        const dayNum = parseInt(day, 10)
        const monthNum = parseInt(month, 10)
        const yearNum = parseInt(year, 10)

        if (isNaN(dayNum) || isNaN(monthNum) || isNaN(yearNum)) return false
        if (monthNum < 1 || monthNum > 12) return false
        if (yearNum < 1000 || yearNum > 9999) return false

        const testDate = new Date(yearNum, monthNum - 1, dayNum)
        const isValidDate = testDate.getFullYear() === yearNum &&
            testDate.getMonth() === monthNum - 1 &&
            testDate.getDate() === dayNum

        if (!isValidDate) return false

        // Проверяем, что дата не меньше minDate
        if (minDate) {
            const minDateNormalized = new Date(minDate)
            minDateNormalized.setHours(0, 0, 0, 0)
            testDate.setHours(0, 0, 0, 0)
            return testDate >= minDateNormalized
        }

        return true
    }, [minDate])

    // Обновление валидности и вызов onChange
    const updateValidityAndNotify = useCallback((newDate: DateParts) => {
        const valid = validateDate(newDate)
        setIsValid(valid)
        onError?.(!valid)

        if (valid && newDate.day && newDate.month && newDate.year) {
            const dateObj = new Date(Date.UTC(
                parseInt(newDate.year, 10),
                parseInt(newDate.month, 10) - 1,
                parseInt(newDate.day, 10)
            ))
            onChange(dateObj)
        } else if (!newDate.day || !newDate.month || !newDate.year) {
            onChange(null)
        }
    }, [validateDate, onChange, onError])

    // Обработка изменения поля
    const handleInputChange = (field: keyof DateParts) => (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '') // Только цифры

        // Ограничения по длине
        if (field === 'month' && value.length > 2) value = value.slice(0, 2)
        if (field === 'day' && value.length > 2) value = value.slice(0, 2)
        if (field === 'year' && value.length > 4) value = value.slice(0, 4)

        const newDate = { ...date, [field]: value }
        setDate(newDate)
        updateValidityAndNotify(newDate)
    }

    // Обработка фокуса
    const handleFocus = (field: keyof DateParts) => () => {
        setFocusedField(field)
        if (refs[field].current) {
            refs[field].current?.select()
        }
    }

    // Обработка потери фокуса
    const handleBlur = (field: keyof DateParts) => () => {
        setFocusedField(null)

        // Добавляем ведущие нули при потере фокуса
        const currentValue = date[field]
        if (currentValue && currentValue.length === 1) {
            const paddedValue = currentValue.padStart(2, '0')
            const newDate = { ...date, [field]: paddedValue }
            setDate(newDate)
            updateValidityAndNotify(newDate)
        }
    }

    // Обработка клавиш
    const handleKeyDown = (field: keyof DateParts) => (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Разрешаем служебные клавиши
        if (['Backspace', 'Delete', 'Tab', 'Enter', 'Escape'].includes(e.key)) {
            return
        }

        // Разрешаем стрелки (порядок ДД.ММ.ГГГГ: день → месяц → год)
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            if (e.key === 'ArrowRight') {
                e.preventDefault()
                if (field === 'day') monthRef.current?.focus()
                if (field === 'month') yearRef.current?.focus()
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault()
                if (field === 'month') dayRef.current?.focus()
                if (field === 'year') monthRef.current?.focus()
            }
            return
        }

        // Разрешаем только цифры
        if (!/^\d$/.test(e.key)) {
            e.preventDefault()
            return
        }

        // Автоматический переход к следующему полю (порядок ДД.ММ.ГГГГ)
        const currentValue = e.currentTarget.value
        if (field === 'day' && currentValue.length === 1 && parseInt(currentValue + e.key, 10) > 31) {
            e.preventDefault()
            const newDate = { ...date, day: e.key, month: '', year: '' }
            setDate(newDate)
            monthRef.current?.focus()
            updateValidityAndNotify(newDate)
        } else if (field === 'month' && currentValue.length === 1 && parseInt(currentValue + e.key, 10) > 12) {
            e.preventDefault()
            const newDate = { ...date, month: e.key, year: '' }
            setDate(newDate)
            yearRef.current?.focus()
            updateValidityAndNotify(newDate)
        } else if (field === 'day' && currentValue.length === 1) {
            setTimeout(() => monthRef.current?.focus(), 0)
        } else if (field === 'month' && currentValue.length === 1) {
            setTimeout(() => yearRef.current?.focus(), 0)
        }
    }

    // Обработка вставки
    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const pastedText = e.clipboardData.getData('text').replace(/\D/g, '')

        if (pastedText.length >= 6) {
            // Формат DDMMYYYY
            const day = pastedText.slice(0, 2)
            const month = pastedText.slice(2, 4)
            const year = pastedText.slice(4, 8)

            const newDate = { day, month, year }
            setDate(newDate)
            updateValidityAndNotify(newDate)
            yearRef.current?.focus()
        }
    }

    // Обработка выбора даты из календаря (календарь возвращает локальную дату)
    const handleCalendarSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            const newDate = {
                day: selectedDate.getDate().toString().padStart(2, '0'),
                month: (selectedDate.getMonth() + 1).toString().padStart(2, '0'),
                year: selectedDate.getFullYear().toString()
            }
            setDate(newDate)
            updateValidityAndNotify(newDate)
            setIsCalendarOpen(false)
        }
    }

    const getErrorMessage = () => {
        if (!isValid && date.day && date.month && date.year) {
            const dayNum = parseInt(date.day, 10)
            const monthNum = parseInt(date.month, 10)
            const yearNum = parseInt(date.year, 10)

            if (!isNaN(dayNum) && !isNaN(monthNum) && !isNaN(yearNum)) {
                const testDate = new Date(yearNum, monthNum - 1, dayNum)
                if (minDate) {
                    const minDateNormalized = new Date(minDate)
                    minDateNormalized.setHours(0, 0, 0, 0)
                    testDate.setHours(0, 0, 0, 0)

                    if (testDate < minDateNormalized) {
                        return "Нельзя выбрать дату раньше минимальной"
                    }
                }
            }
        }
        return "Неверная дата"
    }

    const calendarContent = showCalendar ? (
        <Calendar
            locale={ru}
            mode="single"
            selected={value || undefined}
            onSelect={handleCalendarSelect}
            disabled={(date) => {
                if (!minDate) return false
                const minDateNormalized = new Date(minDate)
                minDateNormalized.setHours(0, 0, 0, 0)
                const dateNormalized = new Date(date)
                dateNormalized.setHours(0, 0, 0, 0)
                return dateNormalized < minDateNormalized
            }}
            initialFocus
            className="rounded-md border-0"
        />
    ) : null

    const inputContainer = (
        <div className="w-full">
            <div
                className={cn(
                    'flex items-center border-2 rounded-xl transition-all',
                    'focus-within:outline-none focus-within:ring-2 focus-within:ring-primary dark:bg-card-background',
                    sizeClasses[size],
                    error || !isValid
                        ? 'border-destructive'
                        : 'border-input-border-outline',
                    disabled && 'opacity-50 cursor-not-allowed',
                    className
                )}
                style={{
                    borderColor: error || !isValid
                        ? 'var(--color-destructive)'
                        : 'var(--color-input-border-outline)'
                }}
            >
                <div
                    className={cn(
                        'relative flex flex-1 items-center min-w-0 px-1',
                        disabled ? 'cursor-not-allowed' : 'cursor-text'
                    )}
                    onPaste={handlePaste}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Плейсхолдер как у нативного date — одна строка ДД.ММ.ГГГГ */}
                    <div className="relative flex items-center gap-0.5 tabular-nums">
                        <input
                            ref={dayRef}
                            id={inputId}
                            type="text"
                            inputMode="numeric"
                            autoComplete="off"
                            maxLength={2}
                            placeholder="дд"
                            value={date.day}
                            onChange={handleInputChange('day')}
                            onFocus={handleFocus('day')}
                            onBlur={handleBlur('day')}
                            onKeyDown={handleKeyDown('day')}
                            disabled={disabled}
                            className="w-[2.25ch] min-w-[2.25ch] bg-transparent border-none outline-none p-0 text-center tabular-nums font-gilroy"
                            style={{ color: 'var(--color-input-text)' }}
                            aria-label={t('day')}
                        />
                        <span className="shrink-0 select-none" style={{ color: 'var(--color-input-text)', opacity: 0.6 }} aria-hidden>.</span>
                        <input
                            ref={monthRef}
                            type="text"
                            inputMode="numeric"
                            autoComplete="off"
                            maxLength={2}
                            placeholder={t('monthPlaceholder')}
                            value={date.month}
                            onChange={handleInputChange('month')}
                            onFocus={handleFocus('month')}
                            onBlur={handleBlur('month')}
                            onKeyDown={handleKeyDown('month')}
                            disabled={disabled}
                            className="w-[2.25ch] min-w-[2.25ch] bg-transparent border-none outline-none p-0 text-center tabular-nums"
                            style={{ color: 'var(--color-input-text)' }}
                            aria-label={t('month')}
                        />
                        <span className="shrink-0 select-none" style={{ color: 'var(--color-input-text)', opacity: 0.6 }} aria-hidden>.</span>
                        <input
                            ref={yearRef}
                            type="text"
                            inputMode="numeric"
                            autoComplete="off"
                            maxLength={4}
                            placeholder={t('yearPlaceholder')}
                            value={date.year}
                            onChange={handleInputChange('year')}
                            onFocus={handleFocus('year')}
                            onBlur={handleBlur('year')}
                            onKeyDown={handleKeyDown('year')}
                            disabled={disabled}
                            className="w-[4.5ch] min-w-[4.5ch] bg-transparent border-none outline-none p-0 text-center tabular-nums"
                            style={{ color: 'var(--color-input-text)' }}
                            aria-label={t('year')}
                        />
                    </div>
                </div>
                {showCalendar && (
                    <Button
                        ref={calendarButtonRef}
                        variant="ghost"
                        size="sm"
                        className="ml-2 p-1 h-auto w-auto shrink-0"
                        onClick={(e) => {
                            e.stopPropagation()
                            if (!isCalendarOpen && calendarPosition === 'auto') {
                                setResolvedCalendarPosition(estimateCalendarPosition())
                            }
                            setIsCalendarOpen(!isCalendarOpen)
                        }}
                        disabled={disabled}
                        aria-label={t('openCalendar')}
                        as="button"
                    >
                        <CalendarIcon className="h-4 w-4" style={{ color: 'var(--color-text-secondary)' }} />
                    </Button>
                )}
            </div>
            {!isValid && (date.day || date.month || date.year) && (
                <div className="mt-1.5 text-sm" style={{ color: 'var(--color-destructive)' }}>
                    {getErrorMessage()}
                </div>
            )}
        </div>
    )

    const handleCalendarOpenChange = (open: boolean) => {
        // Предотвращаем закрытие, если popover только что открылся через кнопку
        if (!open && justOpenedRef.current) {
            return
        }
        if (open && calendarPosition === 'auto') {
            setResolvedCalendarPosition(estimateCalendarPosition())
        }
        setIsCalendarOpen(open)
    }

    const inputWithCalendar = showCalendar && calendarContent ? (
        <Popover
            isOpen={isCalendarOpen}
            onOpenChange={handleCalendarOpenChange}
            position={calendarPosition === 'auto' ? resolvedCalendarPosition : calendarPosition}
            trigger="manual"
            content={calendarContent}
            contentClassName="p-3"
        >
            {inputContainer}
        </Popover>
    ) : inputContainer

    return (
        <div className="w-full flex flex-col gap-y-2">
            {label && (
                <label
                    htmlFor={inputId}
                    className="text-sm font-medium flex items-center gap-x-1"
                    style={{ color: 'var(--color-text-primary)' }}
                >
                    {label}
                    {tooltip && (
                        <Tooltip
                            content={
                                <Text size="sm" variant="primary" className="font-normal dark:font-light">
                                    {tooltip}
                                </Text>
                            }
                            variant="secondary"
                            position={tooltipPosition}
                        >
                            <InfoIcon className="w-4 h-4" style={{ color: 'var(--color-text-primary)' }} />
                        </Tooltip>
                    )}
                </label>
            )}
            {inputWithCalendar}
            {helperText && (
                <div
                    className="mt-1.5 text-sm"
                    style={{
                        color: error || !isValid
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

DateInput.displayName = 'DateInput'

export { DateInput }
export default DateInput
