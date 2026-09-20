'use client'
import { useEffect } from 'react'
import { Text } from '@/shared/ui/components/text'
import { ChevronDownIcon, ChevronRightIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { Button } from '@maxhub/max-ui'

export default function AddressSelector() {
    function onSelectChange(selectedAddress: any) {
        console.log(selectedAddress);
    }

    const getAddresses = async () => {
        const response = await fetch('/api/user/getAddresses');
        const data = await response.json();
        return data;
    }
    useEffect(() => {
        if (localStorage.getItem('address')) {
            onSelectChange(localStorage.getItem('address'));
        }
    }, []);

    return (
        <Button variant="ghost" size="small" className=" flex !border-t !border-volen-200 dark:!border-volen-700 w-full !rounded-none !p-0">
            <div className="w-screen py-2">
                <div className="w-11/12 mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-x-2 w-full">
                        <MapPinIcon className='w-4 h-4 text-volen-800 dark:text-volen-200' />
                        <Text size="base" variant="primary">Address Selector</Text>
                    </div>
                    <ChevronRightIcon className='w-4 h-4 text-volen-800 dark:text-volen-200' />
                </div>
            </div>
        </Button >
    )
}
