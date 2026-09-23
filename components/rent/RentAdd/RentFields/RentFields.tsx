import { useToast } from "@/shared/ui/components/toast";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Text } from "@/shared/ui/components/text";
import DateInput from "@/shared/ui/components/date-input";
import { PlusIcon } from "lucide-react";

export default function RentFields({ setStep, setUrl }: { setStep: (step: number) => void, setUrl: (url: string) => void }) {
    const t = useTranslations('rent.fields');

    const [price, setPrice] = useState<string>("");
    const [paymentDate, setPaymentDate] = useState<string>("");
    const [counterDate, setCounterDate] = useState<string>("");
    const [conditionsRent, setConditionsRent] = useState<string>("");

    const { showToast } = useToast();
    const createInvite = async () => {
        try {
            if (price == "" || paymentDate == "" || counterDate == "") {
                showToast(t('errorCreateInvite'), 'error');
                return;
            }
            const createInviteData = {
                ownerId: localStorage.getItem('userId'),
                apartmentId: JSON.parse(localStorage.getItem('address') || '[]')?.id,
                price: Number(price),
                paymentDate: Number(paymentDate),
                counterDate: Number(counterDate),
                conditionsRent: conditionsRent,
            }
            const response = await fetch('/api/rent/createInvite', {
                method: 'POST',
                body: JSON.stringify(createInviteData),
            });
            const data = await response.json();
            if (response.ok) {
                setStep(2);
                setUrl(data.url);
            } else {
                showToast(t('errorCreateInvite'), 'error');
            }
        } catch (error) {
            showToast(t('errorCreateInvite'), 'error');
        }
    }
    return (
        <>
            <div className="flex flex-col gap-y-0.5">
                <div className="flex gap-x-1 items-center">
                    <Text size="base" variant="primary">{t('price')}</Text>
                    <Text size="2xl" variant="primary" className="text-destructive">*</Text>
                </div>
                <div className="relative h-10 flex min-w-0">
                    <input
                        type="number"
                        placeholder={t('pricePlaceholder')}
                        className="w-full pr-24 pl-4 rounded-xl border-2 border-card-border text-base transition-all focus:outline-none focus:ring-2 ring-primary focus:ring-primary dark:bg-volen-800"
                        style={{ color: 'var(--color-input-text)' }}
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                    <Text
                        size="base"
                        variant="secondary"
                        className="absolute right-4 top-1/2 -translate-y-1/2">
                        ₽/месяц
                    </Text>
                </div>
            </div>

            <div className="flex flex-col gap-y-0.5">
                <div className="flex gap-x-1 items-center">
                    <Text size="base" variant="primary">{t('paymentDate')}</Text>
                    <Text size="2xl" variant="primary" className="text-destructive">*</Text>
                </div>
                <input
                    type="number"
                    min={1}
                    max={31}
                    placeholder={t('paymentDatePlaceholder')}
                    className="w-full h-10 pr-4 pl-4 rounded-xl border-2 border-card-border text-base transition-all focus:outline-none focus:ring-2 ring-primary focus:ring-primary dark:bg-volen-800"
                    style={{ color: 'var(--color-input-text)' }}
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                />
            </div>

            <div className="flex flex-col gap-y-0.5">
                <div className="flex gap-x-1 items-center">
                    <Text size="base" variant="primary">{t('counterDate')}</Text>
                    <Text size="2xl" variant="primary" className="text-destructive">*</Text>
                </div>
                <input
                    type="number"
                    min={1}
                    max={31}
                    placeholder={t('counterDatePlaceholder')}
                    className="w-full h-10 pr-4 pl-4 rounded-xl border-2 border-card-border text-base transition-all focus:outline-none focus:ring-2 ring-primary focus:ring-primary dark:bg-volen-800"
                    style={{ color: 'var(--color-input-text)' }}
                    value={counterDate}
                    onChange={(e) => setCounterDate(e.target.value)}
                />
            </div>

            <div className="flex flex-col gap-y-0.5">
                <Text size="base" variant="primary">{t('conditionsRent')}</Text>
                <textarea
                    placeholder={t('conditionsRentPlaceholder')}
                    value={conditionsRent}
                    onChange={(e) => setConditionsRent(e.target.value)}
                    className="w-full min-h-40 px-4 py-1 rounded-xl border-2 border-card-border text-base transition-all focus:outline-none focus:ring-2 ring-primary focus:ring-primary dark:bg-volen-800"
                    style={{ color: 'var(--color-input-text)' }}
                />
            </div>

            <button
                className="w-full bg-primary rounded-xl hover:bg-primary/80 transition-all h-10 flex items-center justify-center"
                onClick={() => createInvite()}
            >
                <div className="flex gap-x-2 items-center">
                    <PlusIcon className=" w-4 h-4 text-volen-50" />
                    <Text size="base" variant="primary" className="text-volen-50">{t('createInvite')}</Text>
                </div>
            </button>
        </>
    )
}