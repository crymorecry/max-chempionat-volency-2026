'use client'
import { cn } from "@/shared/ui/utils/cn"
import { OWNER_NAV_LINKS, USER_NAV_LINKS } from "@/shared/config/navigation"
import { usePathname, useRouter } from "next/navigation"
import { Text } from "@/shared/ui/components/text"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react";

export default function Navigation() {
    const pathname = usePathname()
    const router = useRouter()
    const t = useTranslations('navigation')
    const cleanPathname = pathname.replace(/^\/(ru|en)(?=\/|$)/, "") || "/";

    const [isTenant, setIsTenant] = useState(false)
    useEffect(() => {
        const address = JSON.parse(localStorage.getItem('address') || '{}')
        if (address.type === "TENANT") {
            setIsTenant(true)
        }
    }, [pathname])
    return (
        <div className="fixed bottom-4 left-0 right-0 z-50 w-11/12 mx-auto">
            <div className="relative backdrop-blur-sm dark:bg-volen-600/70 bg-volen-100/70 border border-card-border/20 rounded-full shadow-2xl h-14">
                <div className={`relative grid w-full h-full ${isTenant ? 'grid-cols-4' : 'grid-cols-5'}`}>
                    {isTenant ? USER_NAV_LINKS.map((item) => {
                        const isActive = pathname === item.href
                        const IconComponent = item.icon
                        return (
                            <button
                                key={item.href}
                                type="button"
                                onClick={() => router.push(item.href)}
                                className={cn(
                                    'flex flex-col items-center justify-center h-full transition-all relative z-10',
                                    isActive
                                        ? 'text-primary'
                                        : 'text-text-secondary/10'
                                )}
                            >
                                <IconComponent className={cn(
                                    'w-5 h-5 transition-all',
                                    isActive ? 'text-primary' : 'text-text-primary'
                                )} />
                                <Text size="xs" variant="primary" className={cn('transition-all', isActive && 'text-primary')}>
                                    {t(item.title)}
                                </Text>
                            </button>
                        )
                    }): OWNER_NAV_LINKS.map((item) => {
                        const isActive = pathname === item.href
                        const IconComponent = item.icon
                        return (
                            <button
                                key={item.href}
                                type="button"
                                onClick={() => router.push(item.href)}
                                className={cn(
                                    'flex flex-col items-center justify-center h-full transition-all relative z-10',
                                    isActive
                                        ? 'text-primary'
                                        : 'text-text-secondary/10'
                                )}
                            >
                                <IconComponent className={cn(
                                    'w-5 h-5 transition-all',
                                    isActive ? 'text-primary' : 'text-text-primary'
                                )} />
                                <Text size="xs" variant="primary" className={cn('transition-all', isActive && 'text-primary')}>
                                    {t(item.title)}
                                </Text>
                            </button>
                        )
                    })}

                    <div
                        className="absolute inset-0 dark:bg-volen-800/90 bg-white rounded-full backdrop-blur-sm transition-transform duration-300 ease-out z-0"
                        style={{
                            transform: `translateX(${isTenant ? USER_NAV_LINKS.findIndex(item => item.href.includes(cleanPathname)) * 100 : OWNER_NAV_LINKS.findIndex(item => item.href.includes(cleanPathname)) * 100}%)`,
                            width: `${100 / (isTenant ? 4 : 5)}%`
                        }}
                    />
                </div>
            </div>
        </div>
    )
}