//компонент блока "Корзина" страницы оформления оформлении заказа(список выбранных товаров)

// 'use client'

import React from 'react'
import { WhiteBlock } from '../white-block'
import { CheckoutItem } from '../checkout-item'
import { getCartItemDetails } from '@/shared/lib'
import { PizzaSize, PizzaType } from '@/shared/constants/pizza'
import { CartStateItem } from '@/shared/lib/get-cart-details'
import { Skeleton } from '../../ui'
import { CheckoutItemSkeleton } from '../checkout-item-skeleton'

interface Props {
    items: CartStateItem[]
    onClickCountButton: (id: number, quantity: number, type: 'plus' | 'minus') => void//FIXME - (?)
    removeCartItem: (id: number) => void
    loading?: boolean
    className?: string
}


export const CheckOutCart = ({ items, onClickCountButton, removeCartItem, loading, className }: Props) => {
    return (
        <WhiteBlock title="1. Корзина" className={className}>
            <div className="flex flex-col gap-5">

                { loading 
                ? [...Array(3)].map((_, index) => <CheckoutItemSkeleton key={index} />)//при загрузке подгрузим компонент-заготовку блока скелетонов для корзины. Повторяется 3 раза
                : items.map((item) => (
                    <CheckoutItem
                        key={item.id}
                        id={item.id}
                        imageUrl={item.imageUrl}
                        details={
                            getCartItemDetails(//передадим значение в виде строки созданной функцией getCartItemDetails. 
                                //передать на обработкув getcartItemDetails: ингредиенты, тип пиццы и размер пиццы
                                item.ingredients,
                                item.pizzaType as PizzaType, //присвоить директивно тип (alias) type PizzaType = 1 | 2 import PizzaType для выбора именно только из этих значений
                                item.pizzaSize as PizzaSize  //присвоить директивно тип (alias) type PizzaSize = 20 | 30 | 40 import PizzaSize для выбора именно только из этих значений
                            )
                        }
                        name={item.name}
                        price={item.price}
                        quantity={item.quantity}
                        disabled={item.disabled}
                        onClickCountButton={(type) => onClickCountButton(item.id, item.quantity, type)}
                        onClickRemove={() => removeCartItem(item.id)}//активируем функцию removeCartItem передав в неё id элемента
                    />
                ))}

            </div>
        </WhiteBlock>
    )
}