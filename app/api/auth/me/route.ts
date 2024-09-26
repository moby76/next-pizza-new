//ендпоинт для получения данных текущего пользователя

import { prisma } from "@/prisma/prisma-client";
import { getUserSession } from "@/shared/lib/get-user-session";
import { NextResponse } from "next/server";

//Пришлось добавить dynamic: 'force-dynamic' из-за проблем с работой 
// export const dynamic = 'force-dynamic'

export async function GET() {

    // * /сначала получить сессию серверную функцию getUserSession(ака getServerSession(authOptions))
    const session = await getUserSession();

    try {      
        
        // const session = await getServerSession();//NOTE - в финальном коде оригинала указанно так, хотя в видео он получал через getUserSession
        // const session = await getUserSession();

        // ** Если не получили сессию и пользователя из сессии, то вернем ошибку
        if(!session?.user) {
            return NextResponse.json({ message: 'Вы не авторизованы' }, { status: 401 });
        }

        // *** найти пользователя из БД по id пользователя из сессии
        const userMe = await prisma.user.findUnique({
            where: {
                id: Number(session?.user?.id)
            },
            select: {//выберем из ответа только 3 поля
                fullName: true,
                email: true,
                password: false,//пароль не нужен
            }
        })

        // **** вернуть даныые пользователя
        return NextResponse.json( userMe );

    } catch (error) {
        console.log('error', error);
        return NextResponse.json({ message: '[USER_GET] Server Error' }, { status: 500 });
    }
}