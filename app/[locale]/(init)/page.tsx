'use client'
import Logo from "@/components/layout/logo/logo"
import { useEffect, useState } from "react"
import styles from "./Logo.module.css"
import { Text } from "@/shared/ui/components/text"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useToast } from "@/shared/ui/components/toast"
import TenantAccept from "@/components/tenant/TenantAccept/TenantAccept"
import CopyPathname from "@/app/api/admin/CopyPathname/CopyPathname"

export default function Init() {
    const t = useTranslations('init')

    const router = useRouter()
    const [lease, setLease] = useState<any>(null)
    const { showToast } = useToast()

    const init = async () => {
        try {
            const initUser = await fetch('/api/user/init', {
                method: 'POST',
                body: JSON.stringify({
                    pathname: window.location.href,
                }),
            })
            const initUserData = await initUser.json()
            if (initUser.ok && initUserData.valid) {
                localStorage.setItem('userId', initUserData.userId)
                if(initUserData.lease) {
                    setLease(initUserData.lease)
                    return;
                }
                router.push('/main')
            } else {
                showToast(t('error'), 'error')
            }
        } catch (error) {
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

            {lease && (
                <TenantAccept lease={lease}/>
            )}

        </div>
    )
}