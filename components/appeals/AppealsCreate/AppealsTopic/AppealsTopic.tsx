import { useTranslations } from "next-intl";
import { WrenchIcon, CreditCardIcon, BrushIcon, Building2Icon, ShieldIcon, FileIcon, HelpCircleIcon } from "lucide-react";
import { Text } from "@/shared/ui/components/text";
import { RequestTopic } from "@prisma/client";
import { Button } from "@/shared/ui/components/button";

const topics = [
    { icon: WrenchIcon, label: 'technical', description: 'technicalDescription', value: 'TECHNICAL' },
    { icon: CreditCardIcon, label: 'billing', description: 'billingDescription', value: 'BILLING' },
    { icon: BrushIcon, label: 'cleaning', description: 'cleaningDescription', value: 'CLEANING' },
    { icon: Building2Icon, label: 'neighborsNoise', description: 'neighborsNoiseDescription', value: 'NEIGHBORS_NOISE' },
    { icon: ShieldIcon, label: 'security', description: 'securityDescription', value: 'SECURITY' },
    { icon: FileIcon, label: 'documents', description: 'documentsDescription', value: 'DOCUMENTS' },
    { icon: HelpCircleIcon, label: 'other', description: 'otherDescription', value: 'OTHER' }
]

export default function AppealsTopic({ setTopic, setStep }: { setTopic: (topic: RequestTopic) => void, setStep: (step: number) => void }) {
    const t = useTranslations('appeals.create.topic');

    const handleTopic = (topic: RequestTopic) => {
        setTopic(topic);
        setStep(2);
    }
    return (
        <div className="flex flex-col gap-y-2">
            <Text size="lg" variant="primary">{t('title')}:</Text>
            {topics.map((topic: any) => (
                <Button
                    key={topic.value}
                    size="2xl"
                    variant="outline"
                    className="w-full text-left h-full !px-4 py-2 gap-x-4"
                    onClick={() => handleTopic(topic.value)}
                >
                    <topic.icon className="w-6 h-6 min-w-6" />
                    <div className="flex flex-col gap-y-0 min-w-0 w-full">
                        <Text size="base" variant="primary">{t(topic.label)}</Text>
                        <Text size="sm" variant="secondary" className="truncate">{t(topic.description)}</Text>
                    </div>
                </Button>
            ))}
        </div>
    )
}