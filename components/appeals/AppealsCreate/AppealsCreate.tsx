import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Text } from "@/shared/ui/components/text";
import { useState } from "react";
import Sheet from "@/shared/ui/components/sheet";
import AppealsTopic from "./AppealsTopic/AppealsTopic";
import { RequestTopic } from "@prisma/client";
import AppealsDescription from "./AppealsDescription/AppealsDescription";
import { Button } from "@/shared/ui/components/button";
import AppealsSuccess from "./AppealsSuccess/AppealsSuccess";

export default function AppealsCreate({ size = 'default', getAppeals }: { size?: 'small' | 'default', getAppeals: () => void }) {
    const t = useTranslations('appeals.create');

    const [isOpen, setIsOpen] = useState(false);

    const [step, setStep] = useState(1);
    const [topic, setTopic] = useState<RequestTopic | null>(null);
    return (
        <>
        {size === 'default' && (
            <Button
                size="default"
                variant="primary"
                onClick={() => setIsOpen(true)}
            >
                <PlusIcon className="w-4 h-4" />
                {t('createAppeal')}
            </Button>
        )}
        {size === 'small' && (
            <Button
                size="2xl"
                variant="primary"
                onClick={() => setIsOpen(true)}
                className="w-16 h-16 aspect-square p-0 rounded-full fixed bottom-20 right-4"
            >
                <PlusIcon className="w-8 h-8" />
            </Button>
        )}
            <Sheet isOpen={isOpen} onClose={() => {setIsOpen(false); getAppeals()}} title={t('titleAppeal')}>
                <div className="flex flex-col gap-y-4 w-11/12 mx-auto pt-4">
                    {step < 3 && <Text size="sm" variant="secondary" className="text-center">{t('step', { step })}</Text>}
                    {step === 1 && <AppealsTopic setTopic={setTopic} setStep={setStep} />}
                    {step === 2 && topic && <AppealsDescription topic={topic} setStep={setStep} />}
                    {step === 3 && <AppealsSuccess setStep={setStep} setIsOpen={setIsOpen} getAppeals={getAppeals} />}
                </div>
            </Sheet>
        </>
    )
}