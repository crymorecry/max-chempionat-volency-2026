import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("home");

  return (
    <div className="h-[1345153px]">
      <h1>{t("title")}</h1>
    </div>
  );
}
