import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    const { userId, apartmentId } = await request.json();
    const fetchApartment = await prisma.userApartment.findMany({
        where: {
            userId: userId,
        },
        include: {
            apartment: true,
        },
    });

    if (!apartmentId && fetchApartment?.length >= 2) {
        return NextResponse.json({ error: 'Apartment ID is required' }, { status: 400 });
    }
    let news = await prisma.news.findMany({
        where: {
            apartmentId: apartmentId,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    if(news.length === 0 && fetchApartment?.length === 1) {
        news = await prisma.news.findMany({
            where: {
                apartmentId: fetchApartment[0].apartmentId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    const { searchParams } = new URL(request.url);

    const search = searchParams.get('search')?.trim().toLowerCase() || '';
    const page = Math.max(Number(searchParams.get('page')) || 1, 1);
    const limit = Math.max(Number(searchParams.get('limit')) || 5, 1);

    const filteredNews = news.filter((item) => {
        if (!search) return true;

        const title = item.title?.toLowerCase() || '';
        const description = item.description?.toLowerCase() || '';
        const fullContent = item.fullContent?.toLowerCase() || '';

        return (
            title.includes(search) ||
            description.includes(search) ||
            fullContent.includes(search)
        );
    });

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedNews = filteredNews.slice(startIndex, endIndex);

    return NextResponse.json({
        news: paginatedNews,
        maxPage: Math.ceil(filteredNews.length / limit),
        total: filteredNews.length,
    });
}