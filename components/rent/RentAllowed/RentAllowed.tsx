import { Text } from "@/shared/ui/components/text";
import { useTranslations } from "next-intl";
import { formatDate } from "@/utils/formatDate";
import { BanknoteIcon, CalendarIcon, ScrollTextIcon } from "lucide-react";
import { Button } from "@/shared/ui/components/button";

export default function RentAllowed({ getLeases, lease }: { getLeases: () => Promise<void>, lease: any }) {
    const t = useTranslations('rent.allowed');
    const handleEndLease = async () => {
        const response = await fetch('/api/rent/endLease', {
            method: 'POST',
            body: JSON.stringify({
                userId: lease.ownerId,
                leaseId: lease.id
            }),
        });
        if (response.ok) {
            getLeases();
        }
    }

    return (
        <div className="flex flex-col gap-y-6 border border-card-border rounded-xl p-4">
            <div className="flex gap-x-2">
                {lease.tenant?.photo != "" ? (
                    <img src={lease.tenant?.photo || ''} alt="Photo" width={100} height={100} className="rounded-full w-20 h-20" />
                ) : (
                    <div className="w-20 h-20 bg-volen-100 rounded-full items-center justify-center flex">
                        <Text size="2xl" variant="primary" className="text-center text-volen-900">{lease.tenant?.name.split(' ').map((name: string) => name[0].toUpperCase()).join('')}</Text>
                    </div>
                )}
                <div className="flex flex-col justify-between h-full py-1">
                    <Text size="xl" variant="primary">{lease.tenant?.name}</Text>
                    <div className="flex flex-col gap-y-0">
                        <Text size="sm" variant="primary">{t("tenant")}</Text>
                        <Text size="sm" variant="primary">Снимает с {formatDate(lease.createdAt)}</Text>
                    </div>
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
                <Button size="default" variant="danger" className="w-full" onClick={handleEndLease}>
                    {t('endLease')}
                </Button>
            </div>
        </div >
    )
}