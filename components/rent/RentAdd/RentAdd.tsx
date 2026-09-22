import { Button } from "@maxhub/max-ui";
import { Text } from "@/shared/ui/components/text";
import { useTranslations } from "next-intl";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import Sheet from "@/shared/ui/components/sheet";
import RentFields from "./RentFields/RentFields";
import RentShare from "./RentShare/RentShare";

export default function RentAdd({ getLeases }: { getLeases: () => void }) {
    const t = useTranslations('rent');
    const [isOpen, setIsOpen] = useState(false);

    const [step, setStep] = useState(1);
    const [url, setUrl] = useState<string>("");
    return (
        <>
            <Button size="small" className="w-48" onClick={() => {setIsOpen(true); setStep(1);}}>
                <div className="flex gap-x-2 items-center">
                    <PlusIcon className=" w-4 h-4" />
                    <Text size="base" variant="primary" className="text-volen-50">{t('rentAdd')}</Text>
                </div>
            </Button>
            <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)} title={`${t('title')}`}>
                <div className="flex flex-col gap-y-4 w-11/12 mx-auto pt-4">
                    {step === 1 && <RentFields getLeases={getLeases} setStep={setStep} setUrl={setUrl} />}
                    {step === 2 && <RentShare url={url}/>}
                </div>
            </Sheet>
        </>
    )
}