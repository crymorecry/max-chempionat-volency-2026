import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
        await tx.contact.deleteMany();

        await tx.contact.createMany({
            data: apartments.flatMap((apartment) => [
                {
                    apartmentId: apartment.id,
                    name: "УК Комфорт-Сервис",
                    description: "Управляющая компания",
                    phone: "+79991112233",
                },
                {
                    apartmentId: apartment.id,
                    name: "Аварийно-диспетчерская служба",
                    description: "Круглосуточно",
                    phone: "+79992223344",
                },
                {
                    apartmentId: apartment.id,
                    name: "Водоканал",
                    description: "Водоснабжение и водоотведение",
                    phone: "+79993334455",
                },
                {
                    apartmentId: apartment.id,
                    name: "Электросети",
                    description: "Электроснабжение",
                    phone: "+79994445566",
                },
            ]),
        });
    });

    return NextResponse.json({
        message: "Контакты добавлены",
    });
}