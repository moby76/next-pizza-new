//создание эндпоинта для работы с элементом корзины (cartItem) по id из параметров строки и обработка этого элемента(добавление/удаление количества)
//NOTE - в запрос передаётся динамическое значение id согласно структуре cart/[id]
import { prisma } from "@/prisma/prisma-client";
import { updateCartTotalAmount } from "@/shared/lib/update-cart-total-amount";
import { NextRequest, NextResponse } from "next/server";


//Обновление элемента корзины
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {//вторым параметром на запрос будет параметр id
    try {
        const id = Number(params.id)//получим id элемента корзины из параметров строки. привести его к Number
        const data = (await req.json()) as { quantity: number }//NOTE - доступ только к значению содержащие поле/столбец quantity(?) из всего объекта req.json() 
        console.log('data', data);
        //получить токен cartToken из браузера пользователя 
        const token = req.cookies.get('cartToken')?.value//получаем значение токена из куки
        if (!token) {//если токена нет, вернём ошибку и статус 404
            return NextResponse.json({ error: 'Токен не найден' }, { status: 404 })//Сообщение для пользователа
        }
        //NOTE - изменять корзину нельзя если товар раннее не добавлялся в корзину

        //если токен корзины получен, то работаем с элементами этой корзины
        //найти элемент корзины из БД(через prisma) по его id  в соответствии с id из параметра запроса
        const cartItem = await prisma.cartItem.findFirst({
            where: {
                id: id
            }
        })

        //если товар по id не найден вернём ответ NextResponse с ошибкой
        if (!cartItem) {
            return NextResponse.json({ error: 'Товар не найден' }, { status: 404 })//Сообщение для пользователа
        }
        //если всё в порядке, то призма должна обновить этот элемент корзины(cartItem)
        await prisma.cartItem.update({
            where: {
                id: id
            },
            data: {
                quantity: data.quantity//NOTE -обновить только количество - quantity = data.quantity
            }
        })

        // вызвать функцию, которая вернёт обновлённую в функции updateCartTotalAmount корзину, передав в неё токен для разрешения обновработки корзины  
        const updatedUserCart = await updateCartTotalAmount(token)

        // вернуть на клиент обновленную корзину
        return NextResponse.json(updatedUserCart)

    } catch (error) {
        console.log('[CART_PATCH] server error', error)//сообщение для консоли
        return NextResponse.json({ message: 'Не удалось обновить корзину' }, { status: 500 })//Сообщение для пользователа
    }
}

//удаление элемента корзины
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {

    try {
        const id = Number(params.id)//получим id элемента корзины из параметров строки. привести его к Number
        const token = req.cookies.get('cartToken')?.value//получаем значение токена из куки

        if (!token) {//если токена нет, вернём ошибку и статус 404
            return NextResponse.json({ error: 'Токен не найден' }, { status: 404 })//Сообщение для пользователа
        }

        //найти элемент корзины из БД(через prisma) по его id  в соответствии с id из параметра запроса
        const cartItem = await prisma.cartItem.findFirst({
            where: {
                id: id
            }
        })

        //если товар по id не найден вернём ответ NextResponse с ошибкой
        if (!cartItem) {
            return NextResponse.json({ error: 'Товар не найден' }, { status: 404 })//Сообщение для пользователа
        }

        //если элемент найден, то удаляем его из БД
        await prisma.cartItem.delete({
            where: {
                id: id
            }
        })

        //и так-же как и при обновлении получить новую информацию о корзине
        const updatedUserCart = await updateCartTotalAmount(token)

        // вернуть на клиент
        return NextResponse.json(updatedUserCart)

    } catch (error) {
        console.log('[CART_DELETE] server error', error)//сообщение для консоли
        return NextResponse.json({ message: 'Не удалось удалить корзину' }, { status: 500 })//Сообщение для пользователа;
    }
}