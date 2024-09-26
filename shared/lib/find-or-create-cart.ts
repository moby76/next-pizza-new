//найти или создать корзину по токену из кукисов
//реализует следующий функционал: находит корзину по её токуену из кукис браузера пользователя. Если корзина не найдена, то создаёт её

import { prisma } from "@/prisma/prisma-client"

export const findOrCreateCart = async ( token: string ) => {
     
    //найти корзину по токену
    let userCart = await prisma.cart.findFirst({
        where: {
            token: token
        }
    })

    //если корзина не найдена, то её нужно создать
    if(!userCart){
        userCart = await prisma.cart.create({
            data: {
                token: token,//вшить токен сгенерированный в api/cart/route.ts
                totalAmount: 0//и прописать изначальное значение суммы корзины = 0
            }
        })
    }

    //вернуть найденную/созданнуюкорзину
    return userCart
}