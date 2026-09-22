import { useTranslations } from "next-intl";
import { Text } from "@/shared/ui/components/text";
import { BanknoteIcon, CalendarIcon, CopyIcon, ScrollTextIcon, TimerIcon } from "lucide-react";
import { useToast } from "@/shared/ui/components/toast";

export default function RentNotAllowed({ getLeases, lease }: { getLeases: () => void, lease: any }) {
    const t = useTranslations('rent.notAllowed');
    const { showToast } = useToast();
    const handleSendInviteMax = () => {
        const text =
            `Приглашаю вас в квартиру в Домовике\n${lease.maxInviteUrl}`;

        const shareUrl =
            `https://max.ru/:share?text=${encodeURIComponent(text)}`;

        window.WebApp?.openMaxLink(shareUrl);
    }

    const handleCancel = async () => {
        try {
            const cancel = await fetch('/api/rent/cancel', {
                method: 'POST',
                body: JSON.stringify({
                    leaseId: lease.id,
                }),
            });
            if (cancel.ok) {
                showToast(t('cancelSuccess'), 'success');
                getLeases();
            } else {
                showToast(t('cancelError'), 'error');
            }
        } catch (error) {
            showToast(t('cancelError'), 'error');
        }
    }
    return (
        <div className="bg-orange-400/20 dark:bg-orange-400/10 rounded-xl p-4 flex flex-col gap-y-4">
            <div className="flex gap-x-4 items-start">
                <TimerIcon className="w-10 h-10 text-orange-400" />
                <div className='flex flex-col'>
                    <Text size="lg" variant="primary" className="!font-medium">{t('expectationAccept')}</Text>
                    <Text size="sm" variant="secondary">{t('expectationAcceptDescription')}</Text>
                </div>
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
            <div className="flex flex-col gap-y-2">
                <button
                    className="w-full bg-primary rounded-xl hover:bg-primary/80 transition-all h-10 flex items-center justify-center"
                    onClick={handleSendInviteMax}
                >
                    <Text size="base" variant="primary" className="text-volen-50">{t('sendInviteMax')}</Text>
                </button>
                <button
                    className="gap-x-2 w-full bg-destructive dark:bg-destructive/20 rounded-xl hover:bg-destructive/20 transition-all h-10 flex items-center justify-center"
                    onClick={handleCancel}
                >
                    <Text size="base" variant="primary" className="text-volen-50">{t('cancel')}</Text>
                </button>
            </div>

        </div>
    )
}