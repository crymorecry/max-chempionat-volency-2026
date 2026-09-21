import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const news = [
    {
        title: "Отключение горячей воды",
        description: "23 сентября с 10:00 до 16:00.",
        fullContent:
            "23 сентября с 10:00 до 16:00 будет временно отключена горячая вода в связи с плановыми работами.",
    },
    {
        title: "Проверка пожарной сигнализации",
        description: "25 сентября пройдёт плановая проверка.",
        fullContent:
            "25 сентября специалисты проведут плановую проверку пожарной сигнализации и системы оповещения.",
    },
    {
        title: "Работы по обслуживанию лифта",
        description: "27 сентября возможны кратковременные остановки.",
        fullContent:
            "27 сентября будут проводиться плановые работы по техническому обслуживанию лифта.",
    },
];

export async function POST() {
    const apartments = await prisma.apartment.findMany({
        select: {
            id: true,
        },
    });

    if (apartments.length === 0) {
        return NextResponse.json({
            message: "Квартир нет",
        });
    }

    await prisma.$transaction(async (tx) => {
        await tx.news.deleteMany();

        await tx.news.createMany({
            data: apartments.flatMap((apartment) =>
                news.map((item) => ({
                    apartmentId: apartment.id,
                    title: item.title,
                    description: item.description,
                    fullContent: item.fullContent,
                }))
            ),
        });
    });

    return NextResponse.json({
        success: true,
        apartments: apartments.length,
        newsPerApartment: news.length,
        totalNews: apartments.length * news.length,
    });

}