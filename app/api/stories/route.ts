//ендпоинт АПИ на получение историй

import { prisma } from '@/prisma/prisma-client'
import { NextRequest, NextResponse } from 'next/server' 

export async function GET() {
    const stories = await prisma.story.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            items: true
        }
    })
    return NextResponse.json(stories)
}