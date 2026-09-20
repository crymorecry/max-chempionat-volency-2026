'use client'
import Logo from "@/components/layout/logo/logo"
import { useEffect } from "react"
import styles from "./Logo.module.css"
import { Text } from "@/shared/ui/components/text"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useToast } from "@/shared/ui/components/toast"

export default function Init() {
    const t = useTranslations('init')

    const router = useRouter()
    const { showToast } = useToast()

    const init = async () => {
        const initUser = await fetch('/api/user/init', {
            method: 'POST',
            body: JSON.stringify({
                pathname: window.location.href,
            }),
        })
        const initUserData = await initUser.json()
        if (initUser.ok && initUserData.valid) {
            router.push('/main')
        } else {
            showToast(t('error'), 'error')
        }
    }

    useEffect(() => {
        init()
    }, [])

    return (
        <div className="flex flex-col gap-y-4 items-center justify-center h-screen">
            <div className={styles.logo}>
                <Logo size="xl" />
            </div>
            <Text size="sm" variant="primary" className="text-center">{t('loading')}</Text>
        </div>
    )
}