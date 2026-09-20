import { EllipsisText, Panel } from "@maxhub/max-ui";
import { Text } from "@/shared/ui/components/text";
import { formatDate } from "@/utils/formatDate";
import { useTranslations } from "next-intl";
import { ArrowRightIcon } from "lucide-react";
import { useState } from "react";
import Sheet from "@/shared/ui/components/sheet";

export default function NewsCatalogCard({ news }: { news: any }) {
    const t = useTranslations('news');
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Panel className="flex flex-col gap-y-2 border border-card-border rounded-xl p-4 hover:shadow-md transition-all cursor-pointer dark:!bg-card-background" >
                <div className="flex flex-col gap-y-0">
                    <Text size="base" variant="primary">{news.title}</Text>
                    <Text size="xs" variant="secondary">{formatDate(news.createdAt)}</Text>

                </div>
                <EllipsisText maxLines={2}>
                    <Text size="sm" variant="secondary">{news.description}</Text>
                </EllipsisText>
                <button className="w-fit flex items-center text-primary" onClick={() => setIsOpen(true)}>
                    <Text size="sm" variant="secondary" className="text-primary hover:text-primary-hover transition-all">{t('readMore')}</Text>
                    <ArrowRightIcon className="w-3 h-3" />
                </button>
            </Panel>
            <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)} title={`${t('titleNews')} №${news.id}`}>
                <div className="flex flex-col gap-y-4 w-11/12 mx-auto pt-4">
                    <div className="flex flex-col gap-y-0">
                        <Text size="2xl" variant="primary">{news.title}</Text>
                        <Text size="sm" variant="secondary">{formatDate(news.createdAt)}</Text>
                    </div>
                    <Text size="base" variant="secondary">{news.fullContent}</Text>
                </div>
            </Sheet>
        </>
    )
}