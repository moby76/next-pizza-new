//Получить список всех пользователей из БД и сформировать endpoint /api/users для запроса с клиента через fetch/axios

import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

//получим данные по всем пользователям из БД через prisma-client
export async function GET() {
  //получим из призма-клиента переменную prisma содержащий данные пользователей из БД
  const users = await prisma.user.findMany();

  //и вернуть даныые через метод NextResponse.json
  return NextResponse.json(users);
}

//создадим пользователя в БД через prisma-client
export async function POST(request: NextRequest) {
  //в body вернётся создаваемый объект
  const data = await request.json();

  const user = await prisma.user.create({
    data
  });

  //и вернуть даныые через метод NextResponse.json
  return NextResponse.json(user)
}
