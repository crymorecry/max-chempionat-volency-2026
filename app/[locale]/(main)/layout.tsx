import "@/shared/styles/globals.css";
import NextIntlProvider from "@/context/NextIntlClientProvider";
import MaxUIProvider from "@/context/MaxUIProvider";
import ThemeProvider from "@/context/ThemeProvider";
import Header from "@/components/layout/header/header";
import Navigation from "@/components/layout/navigation/navigation";
import ScreenDeviceProvider from "@/context/ScreenDeviceProvider";
import { ToastProvider } from "@/shared/ui/components/toast";
import Script from 'next/script'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className="min-h-full flex flex-col" cz-shortcut-listen="true">
        <NextIntlProvider>
          <ThemeProvider>
            <MaxUIProvider>
              <ToastProvider position="bottom-center">
                <div className="flex flex-col min-h-screen dark:bg-volen-900">
                  <Header />
                  <div className="w-11/12 mx-auto min-h-screen pt-28 pb-32">
                    {children}
                  </div>
                  <Navigation />
                </div>
                <Script src="https://st.max.ru/js/max-web-app.js"/>
              </ToastProvider>
              <ScreenDeviceProvider />
            </MaxUIProvider>
          </ThemeProvider>
        </NextIntlProvider>
      </body>
    </html >
  );
}
