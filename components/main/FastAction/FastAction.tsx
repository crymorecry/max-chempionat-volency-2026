'use client';
import { useTranslations } from "next-intl";
import { Text } from "@/shared/ui/components/text";
import { ChevronRightIcon, PhoneCallIcon, ToolboxIcon } from "lucide-react";
import Link from "next/link";

export default function FastAction() {
    const t = useTranslations('main.fast_action');
    return (
        <div className="flex flex-col gap-y-2">
            <Text size="2xl" variant="primary">{t('title')}</Text>
            <div className="grid grid-cols-2 gap-x-2">
                <button className="w-full h-full px-5 py-4 bg-blue-100/60 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/60 dark:bg-blue-900/60 dark:text-white transition-all">
                    <div className="flex items-center gap-x-4 w-full">
                        <ToolboxIcon className="min-w-8 min-h-8 text-blue-500" />
                        <Text size="sm" variant="primary" className="text-left whitespace-normal font-semibold leading-tight">{t('reportProblem')}</Text>
                        <ChevronRightIcon className="min-w-4 min-h-4 w-4 h-4" />
                    </div>
                </button>
                <Link href="/contact" className="w-full h-full p-4 bg-blue-100/60 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/60 dark:bg-blue-900/60 dark:text-white transition-all">
                    <div className="flex items-center gap-x-4 w-full">
                        <PhoneCallIcon className="min-w-8 min-h-8 text-blue-500" />
                        <Text size="sm" variant="primary" className="text-left whitespace-normal font-semibold leading-tight">{t('contactMC')}</Text>
                        <ChevronRightIcon className="min-w-4 min-h-4 w-4 h-4" />
                    </div>
                </Link>
            </div>
        </div>
    )
}