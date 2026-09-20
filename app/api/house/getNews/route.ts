import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const news = [{
        id: 1,
        title: "Title 1",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
        fullContent: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. ",
        createdAt: new Date(),
        updatedAt: new Date(),
    }, {
        id: 2,
        title: "Title 2",
        description: "Description 2",
        fullContent: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. ",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 3,
        title: "Title 3",
        description: "Description 3",
        fullContent: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. ",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 4,
        title: "Title 4",
        description: "Description 4",
        fullContent: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. ",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 5,
        title: "Title 5",
        description: "Description 5",
        fullContent: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. ",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 6,
        title: "Title 6",
        description: "Description 6",
        fullContent: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. ",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 7,
        title: "Title 7",
        description: "Description 7",
        fullContent: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. ",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 8,
        title: "Title 8",
        description: "Description 8",
        fullContent: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. ",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    ]

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