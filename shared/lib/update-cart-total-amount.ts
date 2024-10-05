//функция вычисления суммы элементов в корзине по ТОКЕНУ пользователя
//через prisma

import { prisma } from "@/prisma/prisma-client"
import { Api } from "../services/api-client"
import { calcCartItemTotalPrice } from "./calc-cart-item-total-price"

export const updateCartTotalAmount = async (token: string) => {

    //найти корзину по токену
    const userCart = await prisma.cart.findFirst({
        where: {
            token: token
        },
        include: {
            cartItems: {//получить все вариации товаров из этой корзины
                orderBy: {
                    date_created: 'desc'
                },
                include: {//включая
                    productItem: {// вариант продукта
                        include: {//включая продукт
                            product: true
                        }
                    },
                    Ingredient_CartItem: {//добавленные ингредиенты этого варианта
                        include: {
                            Ingredient: true
                        }
                    }
                }
            }
        }
    })

    //если корзины нет, то вернёт undefined
    if (!userCart) {
        return
    }

    //"пробежать" по этой корзине и сделать вычисления используя функцию calcCartItemTotalPrice передав в неё элемент корзины
    //1. аккумулирует количество продуктов(cartItems)
    //2. передаёт в функцию calcCartItemTotalPrice элемент корзины для вычисления его суммы
    //3. возвращает общую сумму
    const totalAmount = userCart.cartItems.reduce((//reduce - метод, который применяется к элементам массива и возвращает одно значение
        acc,//накапливает результаты предыдущих вызовов функции. Обязательный параметр. Начинает своё значение с начального значения(initialValue), в нашем случае это 0. Или, если не указано, с первого элемента массива
        item: any//текущий элемент массива для которого вызывается коллбэк-функция на каждой итерации
    ) => {
        return acc + calcCartItemTotalPrice(item)//коллбэк-функция на каждой итерации
    },
        0//начальное значение для вычисления. значение с которого начинается процесс сверки элементов массива. Не обязательный параметр
    )

    //вернуть корзину сопоставив её по id с полученной выше корзиной(по токену), с новой суммой --^ 
    return await prisma.cart.update({
        where: {
            id: userCart.id//id корзины
        },
        data: {
            totalAmount: totalAmount//NOTE -обновляемые данные - сумма(totalAmount), 
        },
        //и вернуть все остальные данные корзины 
        include: {
            cartItems: {
                orderBy: {
                    date_created: 'desc'
                },
                include: {
                    productItem: {
                        include: {
                            product: true
                        }
                    },
                    Ingredient_CartItem: {
                        include: {
                            Ingredient: true
                        }
                    }
                }
            }
        }

    })

}