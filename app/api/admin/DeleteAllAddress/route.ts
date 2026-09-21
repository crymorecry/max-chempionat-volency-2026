import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE() {
    try {
        await prisma.$transaction([
            prisma.request.deleteMany(),
            prisma.news.deleteMany(),
            prisma.lease.deleteMany(),
            prisma.userApartment.deleteMany(),
            prisma.apartment.deleteMany(),
        ]);

        return NextResponse.json({
            success: true,
            message: "Все адреса удалены",
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: "Ошибка удаления адресов",
            },
            { status: 500 }
        );
    }
}