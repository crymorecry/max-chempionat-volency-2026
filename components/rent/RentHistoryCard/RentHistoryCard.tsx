"use client";
import { formatDate } from "@/utils/formatDate";
import { useTranslations } from "next-intl";
import { Text } from "@/shared/ui/components/text";
import { BanknoteIcon, CalendarIcon, ChevronRightIcon, ScrollTextIcon } from "lucide-react";
import Sheet from "@/shared/ui/components/sheet";
import { useState } from "react";

export default function RentHistoryCard({ lease }: { lease: any }) {
    const t = useTranslations('rent.allowed');
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <button className="w-full flex justify-between items-center" onClick={() => setIsOpen(true)}>
                <div className="flex gap-x-2 h-16">
                    {lease.tenant?.photo != "" ? (
                        <img src={lease.tenant?.photo || ''} alt="Photo" width={100} height={100} className="rounded-full w-16 h-16" />
                    ) : (
                        <div className="w-16 h-16 bg-volen-100 rounded-full items-center justify-center flex">
                            <Text size="2xl" variant="primary" className="text-center text-volen-900">{lease.tenant?.name.split(' ').map((name: string) => name[0].toUpperCase()).join('')}</Text>
                        </div>
                    )}
                    <div className="flex flex-col justify-between h-full py-1 text-left">
                        <Text size="xl" variant="primary">{lease.tenant?.name}</Text>
                        <Text size="sm" variant="secondary">{formatDate(lease.createdAt)} - {formatDate(lease.endDate)}</Text>
                    </div>
                </div>
                <ChevronRightIcon className="w-5 h-5" />
            </button>
            <Sheet
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title={t('tenant')}
            >
                <div className="flex flex-col gap-y-8 items-center justify-center pt-20 w-11/12 mx-auto">
                    <div className="flex flex-col gap-y-4 items-center justify-center">
                        {lease.tenant?.photo != "" ? (
                            <img src={lease.tenant?.photo || ''} alt="Photo" width={100} height={100} className="rounded-full w-32 h-32" />
                        ) : (
                            <div className="w-32 h-32 bg-volen-100 rounded-full items-center justify-center flex">
                                <Text size="3xl" variant="primary" className="text-center text-volen-900">{lease.tenant?.name.split(' ').map((name: string) => name[0].toUpperCase()).join('')}</Text>
                            </div>
                        )}
                        <div className="flex flex-col text-center">
                            <Text size="2xl" variant="primary">{lease.tenant?.name}</Text>
                            <Text size="sm" variant="secondary">{formatDate(lease.createdAt)} - {formatDate(lease.endDate)}</Text>
                        </div>
                    </div>
                    <div className="flex flex-col gap-y-4 items-start w-full">
                        <Text size="xl" variant="primary">{t('conditionsRent')}</Text>
                        <div className='flex flex-col gap-y-2 w-full'>
                            <div className="flex gap-x-2 items-center">
                                <BanknoteIcon className="w-5 h-5" />
                                <Text size="base" variant="primary">{lease.price} ₽ / {t('month')}</Text>
                            </div>
                            <div className="flex gap-x-2 items-center">
                                <CalendarIcon className="w-5 h-5" />
                                <Text size="base" variant="primary">{t('payment')} {lease.paymentDay}</Text>
                            </div>
                            <div className="flex gap-x-2 items-center">
                                <ScrollTextIcon className="w-5 h-5" />
                                <Text size="base" variant="primary">{t('counter')} {lease.meterReadingDay}</Text>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-y-4 items-start w-full">
                        <Text size="xl" variant="primary">{t('additionalСonditions')}</Text>
                        <div className='flex flex-col gap-y-2 w-full'>
                            <div className="flex gap-x-2 items-center">
                                <Text size="base" variant="primary" className="whitespace-pre-line">{lease.conditionsRent}</Text>
                            </div>
                        </div>
                    </div>
                </div>
            </Sheet>
        </>
    )
}