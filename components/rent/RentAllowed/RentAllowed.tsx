import { Text } from "@/shared/ui/components/text";
import { useTranslations } from "next-intl";
import { formatDate } from "@/utils/formatDate";
import { BanknoteIcon, CalendarIcon, ScrollTextIcon } from "lucide-react";

export default function RentAllowed({ getLeases, lease }: { getLeases: () => Promise<void>, lease: any }) {
    const t = useTranslations('rent.allowed');

    const openUserInMax = (maxUserId: string) => {
        window.location.href = `max://user/${maxUserId}`;
    };

    const handleCancelLease = () => {
        console.log('cancel lease');
    }

    return (
        <div className="flex flex-col gap-y-6 border border-card-border rounded-xl p-4">
            <div className="flex gap-x-2">
                {lease.tenant?.photo != "" ? (
                    <img src={lease.tenant?.photo || ''} alt="Photo" width={100} height={100} className="rounded-full w-20 h-20" />
                ) : (
                    <div className="w-20 h-20 bg-volen-100 rounded-full items-center justify-center flex">
                        <Text size="2xl" variant="primary" className="text-center">{lease.tenant?.name.split(' ').map((name: string) => name[0].toUpperCase()).join('')}</Text>
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
                <button
                    className="w-full bg-primary rounded-xl hover:bg-primary/80 transition-all h-10 flex items-center justify-center"
                    onClick={() => openUserInMax(lease.tenant.maxUserId)}
                >
                    <Text size="base" variant="primary" className="!font-medium text-volen-50">{t('writeInMax')}</Text>
                </button>
                <button
                    className="w-full bg-destructive rounded-xl hover:bg-destructive/80 transition-all h-10 flex items-center justify-center"
                    onClick={handleCancelLease}
                >
                    <Text size="base" variant="primary" className="!font-medium text-volen-50">{t('endLease')}</Text>
                </button>
            </div>
        </div >
    )
}