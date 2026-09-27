import { Text } from "@/shared/ui/components/text";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/components/button";
import { CheckIcon } from "lucide-react";

export default function AppealsSuccess({ setStep, setIsOpen, getAppeals }: { setStep: (step: number) => void, setIsOpen: (isOpen: boolean) => void, getAppeals: () => void }) {
    const t = useTranslations('appeals.create.success');

    const handleBack = () => {
        setStep(1);
        setIsOpen(false);
        getAppeals();
    }

    return (
        <div className="flex flex-col gap-y-8 items-center justify-center text-center pt-10">
            <Text size="sm" variant="primary">{t('success')}</Text>
            <div className="flex p-10 rounded-full dark:bg-green-400/10 bg-green-400/30 items-center justify-center">
                <CheckIcon className="w-20 h-20 text-green-400" />
            </div>
            <div className='flex flex-col gap-y-2'>
                <Text size="xl" variant="primary" className="!font-medium">{t('success')}</Text>
                <Text size="sm" variant="secondary">{t('successDescription')}</Text>
            </div>
            <Button size="default" variant="primary" className="w-full" onClick={handleBack}>
                {t('back')}
            </Button>
        </div>
    )
}