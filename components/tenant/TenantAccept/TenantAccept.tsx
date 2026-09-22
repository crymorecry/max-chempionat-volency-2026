"use client"
import Drawer from "@/shared/ui/components/drawer";
import { BanknoteIcon, BuildingComplex, CalendarIcon, ScrollTextIcon } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Text } from "@/shared/ui/components/text";
import { useRouter } from "next/navigation";
import { useToast } from "@/shared/ui/components/toast";

export default function TenantAccept({ lease }: { lease: any }) {
    const [isOpen, setIsOpen] = useState(true)
    const router = useRouter()
    const t = useTranslations('tenant')
    const { showToast } = useToast()
    const handleAccept = async () => {
        try {
            const response = await fetch('/api/rent/accept', {
                method: 'POST',
                body: JSON.stringify({ userId: localStorage.getItem('userId'), leaseId: lease.id })
            })
            const data = await response.json()
            if (response.ok) {
                setIsOpen(false)
                showToast(t('successAccept'), 'success')
                localStorage.setItem('address', String(data))
                router.push('/main')
            } else {
                showToast(t('errorAccept'), 'error')
            }
        } catch (error) {
            showToast(t('errorAccept'), 'error')
        }
    }

    const handleReject = () => {
        setIsOpen(false)
        router.push('/main')
    }

    return (
        <Drawer isOpen={isOpen} onOpenChange={setIsOpen} placement="bottom" showCloseButton={false}>
            <div className="flex flex-col gap-y-6 justify-center text-center">
                <div className="flex flex-col gap-y-2 items-center justify-center">
                    <BuildingComplex className="w-20 h-20 text-primary" />
                    <Text size="xl" className="text-center">{t('title')}</Text>
                </div>
                <div className="flex flex-col">
                    <Text size="base" variant="secondary">{lease.apartment.address}</Text>
                    <Text size="sm" variant="tertiary">{t('address')}</Text>
                </div>
                <div className='flex flex-col gap-y-2'>
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
                <div className="flex flex-col gap-y-1">
                    <Text size="sm" variant="secondary" className="text-left">{t('additionalСonditions')}</Text>
                    <Text size="base" variant="primary" className="text-left whitespace-pre-line">{lease.conditionsRent}</Text>
                </div>
                <div className="flex flex-col gap-y-2">
                    <button
                        className="w-full bg-primary rounded-xl hover:bg-primary/80 transition-all h-10 flex items-center justify-center"
                        onClick={handleAccept}
                    >
                        <Text size="base" variant="primary" className="text-volen-50">{t('accept')}</Text>
                    </button>
                    <button
                        className="w-full bg-destructive rounded-xl hover:bg-destructive/80 transition-all h-10 flex items-center justify-center"
                        onClick={handleReject}
                    >
                        <Text size="base" variant="primary" className="text-volen-50">{t('reject')}</Text>
                    </button>
                </div>
            </div>
        </Drawer>
    )
}