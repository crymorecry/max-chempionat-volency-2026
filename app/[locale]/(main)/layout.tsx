import "@/shared/styles/globals.css";
import NextIntlProvider from "@/context/NextIntlClientProvider";
import MaxUIProvider from "@/context/MaxUIProvider";
import ThemeProvider from "@/context/ThemeProvider";
import Header from "@/components/layout/header/header";
import Navigation from "@/components/layout/navigation/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col" cz-shortcut-listen="true">
        <NextIntlProvider>
          <ThemeProvider>

            <MaxUIProvider>
              <div className="flex flex-col min-h-screen dark:bg-volen-900">
                <Header />
                <div className="w-11/12 mx-auto min-h-screen pt-28">
                  {children}
                </div>
                <Navigation />
              </div>
            </MaxUIProvider>
          </ThemeProvider>
        </NextIntlProvider>
      </body>
    </html >
  );
}
