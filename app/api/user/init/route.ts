import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const BOT_TOKEN = process.env.MAX_BOT_TOKEN as string;
    const USER_LINK = (await request.json()).pathname;

    const hashParams = new URLSearchParams(new URL(USER_LINK).hash.slice(1));
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

    return NextResponse.json({ valid: isValid, userId: getUserId(appData) })
}

function getUserId(initData: string): number | null {
    const params = new URLSearchParams(initData);
    const userRaw = params.get("user");
    const user = JSON.parse(userRaw as string);

    return user.id ?? null;
}