"use client";
import Logo from "@/components/layout/logo/logo";
import ThemeToggler from "@/components/helpers/ThemeToggler";
import LanguageChanger from "@/components/helpers/LanguageChanger";
import AddressSelector from "@/components/helpers/addressSelector";

export default function Header() {
    return (
        <div className="fixed flex-col flex w-full border-b border-volen-200 dark:border-volen-700 bg-white dark:bg-volen-900 z-50">
            <div className="flex items-center justify-between w-11/12 mx-auto py-2">
                <Logo />
                <div className="flex items-center gap-x-2">
                    <ThemeToggler />
                    <LanguageChanger />
                </div>
            </div>
            <AddressSelector />
        </div>
    );
}