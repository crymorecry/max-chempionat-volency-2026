import "@/shared/styles/globals.css";
import NextIntlProvider from "@/context/NextIntlClientProvider";
import MaxUIProvider from "@/context/MaxUIProvider";
import ThemeProvider from "@/context/ThemeProvider";
import { ToastProvider } from "@/shared/ui/components/toast";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="min-h-full flex flex-col" cz-shortcut-listen="true">
                <NextIntlProvider>
                    <MaxUIProvider>
                        <ThemeProvider>
                            <ToastProvider position="bottom-center">
                                <div className="flex flex-col min-h-screen dark:bg-volen-900">
                                    {children}
                                </div>
                            </ToastProvider>
                        </ThemeProvider>
                    </MaxUIProvider>
                </NextIntlProvider>
            </body>
        </html>
    );
}
