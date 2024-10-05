//Формирование эндпоинта для работы с корзиной: получение, создание по адресу localhost:3000/api/cart

import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";
import crypto from 'crypto'
import { findOrCreateCart } from "@/shared/lib";
import { CreateCartItemValues } from "@/shared/services/dto/cart.dto";
import { updateCartTotalAmount } from "@/shared/lib/update-cart-total-amount";
import { Value } from "@radix-ui/react-select";

//запрос на получение корзины по токену
export async function GET(req: NextRequest) {
    try {
        //сначала получить токен корзины из браузера пользователя
        const token = req.cookies.get('cartToken')?.value//получаем значение(value) токена 'cartToken' из Cookies

        if (!token) {//если токена нет, вернём в ответе браузера количество элементов(cartItems) в корзине в виде пустого массива и сумму(totalAmount) = 0
            // return NextResponse.json({ totalAmount: 0, items: [] })
            return NextResponse.json({ totalAmount: 0, cartItems: [] })
        }

        //Найти корзину из БД по полученным данным: по токену или userId
        const userCart = await prisma.cart.findFirst({
            where: {//выполнить проверку на наличие ИЛИ токена ИЛИ userId        
                OR: [
                    {
                        token: token
                    },
                    // {
                    //     userId: userId
                    // }
                ]
            },
            include: {
                cartItems: {//получить все элементы из этой корзины
                    orderBy: {
                        date_created: 'desc'
                    },
                    include: {//включая
                        productItem: {// вариант продукта
                            include: {
                                product: true//включая базовый продукт этого варианта
                            }
                        },
                        Ingredient_CartItem: {// ингредиенты добавленные при выборе пиццы в корзину
                            include: {
                                Ingredient: true
                            }
                        }
                    }
                }
            }
        })

        //вернуть корзину в виде NextResponse.json
        return NextResponse.json(userCart)

    } catch (error) {
        console.log('[CART_GET] server error', error)//сообщение для консоли
        return NextResponse.json({ message: 'Не удалось получить корзину' }, { status: 500 })//Сообщение для пользователа;
    }

}

//запрос на добавление товара в корзну
export async function POST(req: NextRequest) {

    try {
        //сначала получить значение токен корзины из браузера пользователя
        let token = req.cookies.get('cartToken')?.value//NOTE - в этом блоке присваиваем значение токена через переменную let, а не константу const. т.к. он может быть изменён/сгенерирован

        //NOTE - если токена корзины нет то нужно его сгенерировать
        if (!token) {
            token = crypto.randomUUID()
        }

        //Получить корзину по токену иили создать новую вызвав функцию получения/создания корзины передав в неё сгенерированный токен
        const userCart = await findOrCreateCart(token)

        //получить данные из запроса в ответ на отправку на сервер данныхтипизированных в interface CreateCartItemValues (productItemId: number, ingredients?: number[]). передаются на сервер через функцию addCartItem в store/cart.ts
        const data = (await req.json()) as CreateCartItemValues

        //выполнить проверку: есть ли в существующей корзине уже тот вариант продукта(включая и ингредиенты и размер и тип) 1:1 который мы хотим добавить
        const findCartItem = await prisma.cartItem.findFirst({
            where: {
                cartId: userCart.id,
                productItemId: data.productItemId,//data.productItemId передаётся из браузера на сервер(используется интерфейс CreateCartItemValues). вычисляется в хуке usePizzaOptions и возвращается через ф-циу onSubmit уже в виде аргумента productItemId
                Ingredient_CartItem: {//если для существующего cartItemId(например 101)
                    every: {//каждый
                        // some: {//какой-то 
                        Ingredient: {//ингредиент
                            id: {//по id
                                in: data.ingredients//должен соответствовать из массива данных отправленных из компонента ChoosePizzaForm (?) отправленных от клиента
                            },
                        },
                    },
                    some: {
                        
                    }
                },
                AND: {
                    Ingredient_CartItem: {
                        none: {
                            Ingredient: {
                                id: {
                                    notIn: data.ingredients
                                }

                            }
                        }
                    }
                },
            },
            include: {
                Ingredient_CartItem: {
                    include: {
                        Ingredient: true
                    }
                }
            }
        })

        //если такой --^ вариант 1:1 уже есть в корзине, то просто увеличиваем его на +1
        if (findCartItem) {
            await prisma.cartItem.update({
                where: {
                    id: findCartItem.id
                },
                data: {
                    quantity: (findCartItem.quantity || 0) + 1,//NOTE - изменяется только поле quantity 
                }
            })
        } else {
            //если совпадения не выявлено, то добавляем новый элемент в корзину
            await prisma.cartItem.create({
                data: {
                    cartId: userCart.id,
                    productItemId: data.productItemId,
                    quantity: 1,
                    Ingredient_CartItem: {
                        create: data.ingredients?.map((id) => ({ ingredientId: id }))//создаётся новая запись для поля ingredientId в таблице Ingredient_CartItem. При этом id для строки создаётся автоматически  (???)
                    }
                }
            })
        }

        // вызвать функцию, которая вернёт обновлённую в функции updateCartTotalAmount корзину, передав в неё токен 
        const updatedUserCart = await updateCartTotalAmount(token)

        //NOTE - *перед тем как отправить корзину нужно с ней ещё и отправить токен в кукис* //
        //сначала сформировать ответ
        const resp = NextResponse.json(updatedUserCart)
        //и в этот ответ вшить токен
        resp.cookies.set('cartToken', token, {
            maxAge: 60 * 60 * 24 * 7, // 7 days
        })

        //вернуть в браузер ответ
        return resp

    } catch (error) {
        console.log('[CART_POST] server error', error)//сообщение для консоли
        return NextResponse.json({ message: 'Не удалось создать корзину' }, { status: 500 })//Сообщение для пользователа;
    }
}


