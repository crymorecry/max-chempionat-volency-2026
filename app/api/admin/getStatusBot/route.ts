import { Bot } from '@maxhub/max-bot-api';
import { NextResponse } from "next/server"

export async function GET() {
    const bot = new Bot(process.env.MAX_BOT_TOKEN as string);
    const data = await bot.api.getMyInfo()
    return NextResponse.json(data)
}