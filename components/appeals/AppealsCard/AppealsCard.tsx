import { Text } from "@/shared/ui/components/text";
import { ChevronRightIcon, TimerIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import AppealsStatus from "./AppealsStatus/AppealsStatus";
import { useState } from "react";
import Sheet from "@/shared/ui/components/sheet";
import { Button } from "@/shared/ui/components/button";
import { formatDate } from "@/utils/formatDate";

export default function AppealsCard({ appeal }: { appeal: any }) {
    const t = useTranslations('appeals.card');
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <Button variant="outline" onClick={() => setIsOpen(true)} className="flex w-full items-center h-full text-left rounded-xl px-4 py-2 justify-between dark:bg-card-background">
                <div className="flex flex-col gap-y-2 min-w-0 w-full">
                    <AppealsStatus status={appeal.status} />
                    <div className="flex flex-col gap-y-1 min-w-0 w-full">
                        <div className="flex flex-col min-w-0 w-full">
                            <Text size="base" className="font-medium truncate">{appeal.title}sfhgfhgfhgfhgfhfgh</Text>
                            <Text size="xs" variant="secondary">{formatDate(appeal.createdAt)}</Text>
                        </div>
                        <Text size="sm" variant="secondary">{t(`topic.${appeal.topic}`)}</Text>
                    </div>
                </div>
                <ChevronRightIcon className="w-4 h-4" />
            </Button>

            <Sheet isOpen={isOpen} onClose={() => { setIsOpen(false) }} title={t('titleAppeal')}>

                <div className="flex flex-col gap-y-8 w-11/12 mx-auto pt-4">
                    <AppealsStatus size="base" status={appeal.status} />

                    <div className="flex flex-col gap-y-1">
                        <Text size="xl" className="font-medium">{appeal.title}</Text>
                        <Text size="sm" variant="secondary">{formatDate(appeal.createdAt)}</Text>
                    </div>

                    <div className="flex flex-col gap-y-1">
                        <Text size="base" variant="primary">{t('description')}</Text>
                        <Text size="sm" variant="secondary">{appeal.description}</Text>
                    </div>

                    {appeal.statusHistory !== null && (
                        <div className="flex flex-col gap-y-2 bg-card-background rounded-xl p-4">
                            <div className="flex flex-col">
                                <Text size="base" variant="primary">{t('lastAnswer')}</Text>
                                <Text size="xs" variant="secondary">{formatDate(appeal.statusHistory.createdAt)}</Text>

                            </div>
                            <Text size="sm" variant="secondary">{appeal.statusHistory.comment}</Text>
                        </div>
                    )}

                    {appeal.statusHistory == null && (
                        <div className="flex gap-x-2 bg-card-background rounded-xl p-4">
                            <TimerIcon className="min-w-8 h-8" />
                            <div className="flex flex-col gap-y-1 pt-2">
                                <Text size="base" variant="primary">{t('waitingForResponse')}</Text>
                                <Text size="sm" variant="secondary">{t('waitingForResponseDescription')}</Text>
                            </div>
                        </div>
                    )}
                </div>
            </Sheet >
        </>
    )
}