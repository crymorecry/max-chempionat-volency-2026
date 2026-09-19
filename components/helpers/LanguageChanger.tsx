'use client'
import { useLocale } from 'next-intl'
import { useEffect, useTransition } from 'react'
import { Select } from '@/shared/ui/components/select'
import type { SelectOption } from '@/shared/ui/components/select'
import { usePathname, useRouter } from '@/i18n/navigation';
import { LanguageIcon } from '@heroicons/react/24/outline'

const languages: SelectOption[] = [
    { label: 'Русский', value: 'ru' },
    { label: 'English', value: 'en' },
]

export default function LanguageChanger() {
    const router = useRouter();
    const locale = useLocale();
    const [isPending, startTransition] = useTransition();
    const pathname = usePathname();

    useEffect(() => {
        console.log(locale);
    }, []);

    function onSelectChange(selectedLocale: any) {
        startTransition(() => {
            router.replace(pathname, { locale: selectedLocale });
        });
    }

    return (
        <Select
            variant='none'
            options={languages}
            value={locale === 'ru' ? languages[0].value : languages[1].value}
            onChange={e => onSelectChange(e as any)}
            size="default"
            icon={<LanguageIcon className='w-4 h-4' />}
        />
    )
}
