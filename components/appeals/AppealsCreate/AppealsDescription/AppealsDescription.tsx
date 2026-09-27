import { useTranslations } from "next-intl";
import { Text } from "@/shared/ui/components/text";
import { useState } from "react";
import { Button } from "@/shared/ui/components/button";
import { useToast } from "@/shared/ui/components/toast";
import { RequestTopic } from "@prisma/client";

export default function AppealsDescription({ topic, setStep }: { topic: RequestTopic, setStep: (step: number) => void }) {
    const t = useTranslations('appeals.create.description');

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const { showToast } = useToast();

    const handleCreateAppeal = async () => {
        try {
            const response = await fetch('/api/appeals/createAppeal', {
                method: 'POST',
                body: JSON.stringify({
                    title: title,
                    description: description,
                    topic: topic,
                    userId: localStorage.getItem('userId'),
                    apartmentId: JSON.parse(localStorage.getItem('address') || '[]')?.id,
                }),
            });
            const data = await response.json();

            if (response.ok) {
                showToast(t('success'), 'success');
                setTitle('');
                setDescription('');
                setStep(3);
            } else {
                showToast(t('errorCreateAppeal'), 'error');
            }
        } catch (error) {
            showToast(t('error'), 'error');
        }
    }
    return (
        <div className="flex flex-col gap-y-8">
            <div className="flex flex-col gap-y-4">
                <div className="flex flex-col gap-y-0.5">
                    <Text size="base" variant="primary">{t('title')}</Text>
                    <input
                        type="text"
                        placeholder={t('titlePlaceholder')}
                        className="w-full h-10 pr-4 pl-4 rounded-xl border-2 border-card-border text-base transition-all focus:outline-none focus:ring-2 ring-primary focus:ring-primary dark:bg-volen-800"
                        style={{ color: 'var(--color-input-text)' }}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-y-0.5">
                    <Text size="base" variant="primary">{t('description')}</Text>
                    <textarea
                        placeholder={t('descriptionPlaceholder')}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full min-h-40 px-4 py-1 rounded-xl border-2 border-card-border text-base transition-all focus:outline-none focus:ring-2 ring-primary focus:ring-primary dark:bg-volen-800"
                        style={{ color: 'var(--color-input-text)' }}
                    />
                </div>
            </div>
            <div className="flex flex-col gap-y-2">
                <Button variant="primary" size="default" className="w-full" onClick={handleCreateAppeal}>
                    {t('createAppeal')}
                </Button>

                <Button variant="secondary" size="default" className="w-full" onClick={() => setStep(1)}>
                    {t('back')}
                </Button>
            </div>
        </div>
    )
}