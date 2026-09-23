import { useTranslations } from "next-intl";
import FastAction from "@/components/main/FastAction/FastAction";
import ShortNews from "@/components/main/ShortNews/ShortNews";
import TenantInfo from "@/components/main/TenantInfo/TenantInfo";

export default function Home() {
  const t = useTranslations("home");

  return (
    <div className="flex flex-col gap-y-4">
      <FastAction />
      <TenantInfo />
      <ShortNews />
    </div>
  );
}
