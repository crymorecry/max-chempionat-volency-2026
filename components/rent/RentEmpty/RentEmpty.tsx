import { BuildingComplex } from "lucide-react";
import { useTranslations } from "next-intl";
import { Text } from "@/shared/ui/components/text";
import RentAdd from "../RentAdd/RentAdd";

export default function RentEmpty({ getLeases }: { getLeases: () => void }) {
  const t = useTranslations('rent');
  return (
    <div className="flex flex-col gap-y-4 py-30 items-center justify-center">
      <BuildingComplex className="w-20 h-20 text-primary" />
      <div className="flex flex-col text-center max-w-80">
        <Text size="xl">{t('empty')}</Text>
        <Text size="sm" variant="secondary">{t('emptyDescription')}</Text>
      </div>
      <RentAdd getLeases={getLeases} />
    </div>
  )
}