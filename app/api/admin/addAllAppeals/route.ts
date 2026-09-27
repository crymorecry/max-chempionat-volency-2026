import { NextResponse } from "next/server";
import {
    RequestStatus,
    RequestTopic,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";

export async function POST() {
    const userApartments = await prisma.userApartment.findMany({
        select: {
            userId: true,
            apartmentId: true,
        },
    });

    if (userApartments.length === 0) {
        return NextResponse.json(
            {
                success: false,
                message: "Нет пользователей с привязанными квартирами",
            },
            { status: 400 }
        );
    }

    let createdCount = 0;

    for (const userApartment of userApartments) {
        const { userId, apartmentId } = userApartment;

        await prisma.request.deleteMany({});

        await prisma.request.create({
            data: {
                userId,
                apartmentId,

                topic: RequestTopic.SECURITY,
                title: "Не работает домофон",
                description:
                    "Домофон не открывает дверь при вводе кода. Проблема появилась сегодня утром.",

                status: RequestStatus.CREATED,

                statusHistory: {
                    create: [
                        {
                            status: RequestStatus.CREATED,
                            comment: "Обращение создано",
                        },
                    ],
                },
            },
        });

        createdCount++;

        await prisma.request.create({
            data: {
                userId,
                apartmentId,

                topic: RequestTopic.TECHNICAL,
                title: "Не работает лифт",
                description:
                    "Лифт в первом подъезде не работает со вчерашнего вечера.",

                status: RequestStatus.IN_PROGRESS,

                statusHistory: {
                    create: [
                        {
                            status: RequestStatus.CREATED,
                            comment: "Обращение создано",
                            createdAt: new Date(
                                Date.now() - 1000 * 60 * 60 * 24
                            ),
                        },
                        {
                            status: RequestStatus.IN_PROGRESS,
                            comment: "Обращение принято в работу",
                            createdAt: new Date(
                                Date.now() - 1000 * 60 * 60 * 5
                            ),
                        },
                    ],
                },
            },
        });

        createdCount++;

        await prisma.request.create({
            data: {
                userId,
                apartmentId,

                topic: RequestTopic.TECHNICAL,
                title: "Не работает свет в подъезде",
                description:
                    "На третьем этаже не работает освещение возле лифта.",

                status: RequestStatus.RESOLVED,

                statusHistory: {
                    create: [
                        {
                            status: RequestStatus.CREATED,
                            comment: "Обращение создано",
                            createdAt: new Date(
                                Date.now() - 1000 * 60 * 60 * 48
                            ),
                        },
                        {
                            status: RequestStatus.IN_PROGRESS,
                            comment: "Специалист назначен",
                            createdAt: new Date(
                                Date.now() - 1000 * 60 * 60 * 30
                            ),
                        },
                        {
                            status: RequestStatus.RESOLVED,
                            comment: "Освещение восстановлено",
                            createdAt: new Date(
                                Date.now() - 1000 * 60 * 60 * 4
                            ),
                        },
                    ],
                },
            },
        });

        createdCount++;
    }

    return NextResponse.json({
        success: true,
        message: "Демо-обращения созданы для всех пользователей",
        userApartments: userApartments.length,
        createdRequests: createdCount,
    });
}