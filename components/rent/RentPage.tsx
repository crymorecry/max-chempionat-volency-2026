'use client';
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useToast } from "@/shared/ui/components/toast";
import RentEmpty from "./RentEmpty/RentEmpty";
import { Loader2 } from "lucide-react";
import RentNotAllowed from "./RentNotAllowed/RentNotAllowed";
import RentAllowed from "./RentAllowed/RentAllowed";

export default function RentPage() {

  const [leasesNow, setLeasesNow] = useState<any>(null);
  const [leasesLast, setLeasesLast] = useState([]);

  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const getLeases = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/rent/getLeases', {
        method: 'POST',
        body: JSON.stringify({
          ownerId: localStorage.getItem('userId'),
          apartmentId: JSON.parse(localStorage.getItem('address') || '{}').id
        }),
      });
      const data = await response.json();
      setLeasesNow(data.now);
      setLeasesLast(data.past);
    } catch (error) {
      showToast(t('error'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLeases();
  }, []);

  const t = useTranslations('rent');
  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center pt-20">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      ) : (
        leasesNow ? (
          <>
            {(() => {
              if (leasesNow.tenantId == null) {
                return <RentNotAllowed getLeases={getLeases} lease={leasesNow} />
              } else {
                return <RentAllowed getLeases={getLeases} lease={leasesNow} />
              }
            })()}
          </>
        ) : (
          <RentEmpty getLeases={getLeases} />
        )
      )}
    </>
  )
}