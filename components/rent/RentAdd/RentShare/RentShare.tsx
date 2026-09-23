import { useTranslations } from "next-intl";
import { Text } from "@/shared/ui/components/text";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useToast } from "@/shared/ui/components/toast";

export default function RentShare({ url }: { url: string }) {
    const t = useTranslations('rent.share');

    const { showToast } = useToast();
    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        showToast(t('copy'), 'success');
    }
    const handleSendInviteMax = () => {
        const text =
            `Приглашаю вас в квартиру в Домовике\n${url}`;

        const shareUrl =
            `https://max.ru/:share?text=${encodeURIComponent(text)}`;

        window.WebApp?.openMaxLink(shareUrl);
    }
    return (
        <div className="flex flex-col gap-y-8 items-center justify-center text-center pt-10">
            <Text size="sm" variant="primary">{t('createdInvite')}</Text>
            <div className="flex p-10 rounded-full dark:bg-green-400/10 bg-green-400/30 items-center justify-center">
                <CheckIcon className="w-20 h-20 text-green-400" />
            </div>
            <div className='flex flex-col gap-y-2'>
                <Text size="xl" variant="primary" className="!font-medium">{t('createdInviteLink')}</Text>
                <Text size="sm" variant="secondary">{t('createdInviteDescription')}</Text>
            </div>
            <div className="flex w-full gap-x-4 px-4 h-10 justify-between items-center rounded-xl dark:bg-volen-700 bg-volen-100 ">
                <Text size="base" variant="primary" className="truncate">{url}</Text>
                <CopyIcon className="min-w-5 min-h-5 text-primary" onClick={handleCopy} />
            </div>
            <div className="flex flex-col gap-y-2 w-full">
                <button
                    className="w-full bg-primary rounded-xl focus:bg-primary/80 transition-all h-10 flex items-center justify-center"
                    onClick={handleSendInviteMax}
                >
                    <Text size="base" variant="primary" className="text-volen-50">{t('sendInviteMax')}</Text>
                </button>
                <button
                    className="gap-x-2 w-full dark:bg-volen-700 bg-volen-100 rounded-xl focus:bg-volen-400/80 transition-all h-10 flex items-center justify-center"
                    onClick={handleCopy}
                >
                    <CopyIcon className="w-4 h-4 text-text-primary" />
                    <Text size="base" variant="primary">{t('copyLink')}</Text>
                </button>
            </div>
        </div>
    )
}