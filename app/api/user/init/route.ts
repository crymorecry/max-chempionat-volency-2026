import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fakerRU as faker } from "@faker-js/faker";
import { ApartmentRole } from "@prisma/client";

export async function POST(request: Request) {
    const BOT_TOKEN = process.env.MAX_BOT_TOKEN as string;
    const USER_LINK = (await request.json()).pathname;

    const hashParams = new URLSearchParams(new URL(USER_LINK).hash.slice(1));
    const WebAppStartParam = (hashParams.get('WebAppData') || '').split('&').find((x) => x.startsWith('start_param='))?.split('=')[1];
    const appData: string = hashParams.get('WebAppData') || '';
    const platform: string = hashParams.get('WebAppPlatform') || '';
    const appVersion: string = hashParams.get('WebAppVersion') || '';

    const validateAppData = async (appData: string, botToken: string): Promise<boolean> => {
        // Преобразуем appData из key1=value1&key2=value2 в [["key", "value"], ["key2", "value2"]]
        const params: string[][] = appData.split('&').map((x) => x.split('='));

        // Если hash встречается больше одного раза — прерываем проверку
        if (params.filter((x) => x[0] === 'hash').length !== 1) {
            return false;
        }

        // Сохраняем хеш, который пришёл вместе с параметрами
        const originalHash = params.find((x) => x[0] === 'hash');

        // Если хеш отсутствует — валидация невозможна
        if (!originalHash || typeof originalHash[1] !== 'string') {
            return false;
        }

        // Производим URL-декодирование значений параметров
        for (const param of params) {
            param[1] = decodeURIComponent(param[1]);
        }

        // Сортируем параметры по названию ключа a -> z
        params.sort((a, b) => a[0].localeCompare(b[0]));

        // Формируем строку для подписи с разделителем \n, исключаем hash
        const launchParams = params
            .filter((x) => x[0] !== 'hash')
            .map((x) => `${x[0]}=${x[1]}`)
            .join('\n');

        // Преобразуем строку для подписи и токен бота в массивы байтов
        const encoder = new TextEncoder();
        const botTokenBytes = encoder.encode(botToken);
        const launchParamsBytes = encoder.encode(launchParams);

        // Создаём secret_key: подписываем токен бота с помощью HMAC-SHA256,
        // используя строку "WebAppData" в качестве ключа
        const launchParamsKeyBytes = await crypto.subtle.sign(
            'HMAC',
            await crypto.subtle.importKey(
                'raw',
                encoder.encode('WebAppData'),
                {
                    name: 'HMAC',
                    hash: {
                        name: 'SHA-256',
                    },
                },
                false,
                ['sign'],
            ),
            botTokenBytes,
        );

        // Создаём подпись параметров с помощью HMAC-SHA256, используя secret_key
        const signature = await crypto.subtle.sign(
            'HMAC',
            await crypto.subtle.importKey(
                'raw',
                launchParamsKeyBytes,
                {
                    name: 'HMAC',
                    hash: {
                        name: 'SHA-256',
                    },
                },
                false,
                ['sign'],
            ),
            launchParamsBytes,
        );

        // Переводим подпись из массива байтов в hex-формат
        const hash = Array.from(new Uint8Array(signature))
            .map(b => ('00' + b.toString(16))
                .slice(-2))
            .join('');

        // Сравниваем с полученным хешем
        return hash === originalHash[1];
    };
    const isValid = await validateAppData(appData, BOT_TOKEN);
    if (isValid) {
        const userId = getUser(appData)?.id;
        if (userId) {
            const user = await prisma.user.findUnique({
                where: { maxUserId: userId.toString() },
            });
            if (user) {
                if (WebAppStartParam) {
                    const lease = await prisma.lease.findFirst({
                        where: { id: Number(WebAppStartParam), isActive: true },
                        include: {
                            apartment: true,
                        },
                    });
                    if (lease && lease.tenantId === null && lease.ownerId !== user.id) {
                        return NextResponse.json({ valid: true, userId: user.id, lease: lease });
                    }
                }
                return NextResponse.json({ valid: true, userId: user.id });
            }
            const newUser = await prisma.user.create({
                data: {
                    maxUserId: userId.toString(),
                    name: getUser(appData)?.first_name + ' ' + getUser(appData)?.last_name || '',
                },
            });
            //test
            const addAddress = await prisma.apartment.create({
                data: { address: faker.location.streetAddress() + ' ' + faker.location.buildingNumber() }
            })

            await prisma.userApartment.create({
                data: { userId: newUser.id, apartmentId: addAddress.id, role: ApartmentRole.OWNER }
            })

            if (WebAppStartParam) {
                const lease = await prisma.lease.findUnique({
                    where: { id: Number(WebAppStartParam), isActive: true },
                });
                if (lease && lease.tenantId === null) {
                    await prisma.userApartment.create({
                        data: { userId: newUser.id, apartmentId: lease.apartmentId, role: ApartmentRole.TENANT }
                    })
                    const tenant = await prisma.lease.update({
                        where: { id: Number(WebAppStartParam), isActive: true },
                        data: { tenantId: newUser.id }
                    })
                    return NextResponse.json({ valid: true, userId: newUser.id, lease: tenant });
                }
            }
            return NextResponse.json({ valid: true, userId: newUser.id });
        }
    }
    return NextResponse.json({ valid: isValid, userId: getUser(appData) })
}

function getUser(initData: string) {
    const params = new URLSearchParams(initData);
    const userRaw = params.get("user");
    const user = JSON.parse(userRaw as string);

    return user ?? null;
}
