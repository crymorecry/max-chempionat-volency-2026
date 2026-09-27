import { useTranslations } from "next-intl";
import FastAction from "@/components/main/FastAction/FastAction";
import ShortNews from "@/components/main/ShortNews/ShortNews";
import TenantInfo from "@/components/main/TenantInfo/TenantInfo";
import ContactPage from "@/components/contact/ContactPage";
import { Text } from "@/shared/ui/components/text";

export default function Home() {
  const t = useTranslations("home");

  return (
    <div className="flex flex-col gap-y-6">
      <FastAction />
      <TenantInfo />
      <ShortNews />
      <div className="flex flex-col gap-y-2">
        <Text size="2xl" variant="primary">{t('contact')}</Text>
        <ContactPage />
      </div>

    </div>
  );
}
