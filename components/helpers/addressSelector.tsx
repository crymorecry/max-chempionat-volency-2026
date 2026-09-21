'use client'
import { useEffect, useState } from 'react'
import { Text } from '@/shared/ui/components/text'
import { ChevronRightIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { Button } from '@maxhub/max-ui'
import Sheet from '@/shared/ui/components/sheet'
import { useTranslations } from 'next-intl';

export default function AddressSelector() {
    const [selectedAddress, setSelectedAddress] = useState<any>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [showCloseButton, setShowCloseButton] = useState(true);

    const [addresses, setAddresses] = useState<any[]>([]);

    const getAddresses = async () => {
        try {
            const response = await fetch('/api/user/getAddresses', {
                method: 'POST',
                body: JSON.stringify({ userId: localStorage.getItem('userId') }),
            });
            const data = await response.json();
            setAddresses(data);
            checkAddresses();
        } catch (error) {
            console.error(error);
        }
    }

    function checkAddresses() {
        if (addresses.length === 1) {
            handleSelectAddress(addresses[0]);
            localStorage.setItem('address', JSON.stringify(addresses[0]));
        } else {
            if (localStorage.getItem('address')) {
                setSelectedAddress(JSON.parse(localStorage.getItem('address') || '{}'));
            } else {
                setIsOpen(true);
                setSelectedAddress(null);
                setShowCloseButton(false);
                localStorage.removeItem('address');
            }
        }
    }

    const handleSelectAddress = (address: any) => {
        setSelectedAddress(address);
        setIsOpen(false);
        setShowCloseButton(true);
        localStorage.setItem('address', JSON.stringify(address));
    }

    useEffect(() => {
        getAddresses();
    }, []);

    const t = useTranslations('addressSelector');
    return (
        <>
            <Button variant="ghost" size="small" className=" flex !border-t !border-volen-200 dark:!border-volen-700 w-full !rounded-none !p-0" onClick={() => setIsOpen(true)}>
                <div className="w-screen py-2">
                    <div className="w-11/12 mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-x-2 w-full">
                            <MapPinIcon className='w-4 h-4 text-volen-800 dark:text-volen-200' />
                            <Text size="base" variant="primary" className="truncate max-w-[80%]">{selectedAddress?.address}</Text>
                        </div>
                        <ChevronRightIcon className='w-4 h-4 text-volen-800 dark:text-volen-200' />
                    </div>
                </div>
            </Button>

            <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)} title={t('title')} showCloseButton={showCloseButton} enableSwipeToClose={showCloseButton}>
                <div className="flex flex-col">
                    {addresses.map((address, index) => (
                        <Button variant="ghost" size="small" className="flex !border-b !border-volen-200 dark:!border-volen-700 !p-0 !rounded-none !py-2 !h-full" key={index} onClick={() => handleSelectAddress(address)}>
                            <div className='flex !w-screen'>
                                <div className='flex justify-between w-11/12 mx-auto items-center'>
                                    <div className='flex gap-x-2 items-center'>
                                        <MapPinIcon className='w-4 h-4 text-volen-800 dark:text-volen-200' />
                                        <div className='flex flex-col text-left'>
                                            <Text size="base" variant="primary">{address.address}</Text>
                                            <Text size="sm" variant="secondary" >{t(address.type)}</Text>
                                        </div>
                                    </div>
                                    <ChevronRightIcon className='w-4 h-4 text-volen-800 dark:text-volen-200' />
                                </div>
                            </div>
                        </Button>
                    ))}

                </div>
            </Sheet>
        </>
    )
}
