//ендпоинт на получение кода подтверждения по email
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma-client';

export async function GET (req: NextRequest){

    // * сначала получить сам код подтверждения из url//ATTENTION - этот код/запрос должен располагаться вне блока try/catch !!!
    const code = req.nextUrl.searchParams.get('code')

    try {
        
        // const code = ''

        // ** если кода нет в url, вернём ошибку
        if(!code){
            return NextResponse.json({error: 'Код подтверждения обязателен'}, {status: 400})
        }

        // *** если код получен, то находим его в БД
        const verificationCode = await prisma.verificationCode.findFirst({
            where: {
                code
            }
        })
        // **** если такого кода нет в БД
        if(!verificationCode){
            return NextResponse.json({error: 'Неверный код'}, {status: 400}) 
        }

        // ***** если полученный код совпадает с кодом в БД, находим пользователя связанного с этим кодом и обновляем дату верификации этого пользователя
        await prisma.user.update({
            where: {
                id: verificationCode.userId
            },
            data: {
                verifiedDate: new Date()
            }
        })

        // ****** и удалить этот код из БД, потому что он нам больше не нужен
        await prisma.verificationCode.delete({
            where: {
                id: verificationCode.id
            }
        }) 

        // ******* Перевести пользователя на главную страницу. Через параметр ?verified(???)
        return NextResponse.redirect(new URL('/?verified', req.url))//???

    } catch (error) {
        console.error(error);
        console.log('[VERIFY ERROR] Server error', error);
    }

    // req.nextUrl.searchParams.delete('code') // <-- this is now possible! 🎉
    // return NextResponse.rewrite(req.nextUrl)

}