//Компонент выводит товары в блоке CartDrawer корзины 

// 'use client'

import { cn } from '@/shared/lib/utils'
import React from 'react'
import * as CartItemDetails from './cart-item-details'//получить всё из папки cart-item-details с присвоением корневого имени CartItem
import { CartItemProps } from './cart-item-details/cart-item-details.types'//получим универсальный интерфейс для типизации компонентов из папки ./cart-item-detailsCartItem (ака - CartItem...)
import { Trash2Icon } from 'lucide-react';

interface CartDrawerItemProps extends CartItemProps {//дополним универс. интерфейс CartItemProps
    //TODO - объяснить и занести в документацию
    onClickCountButton?: (type: 'plus' | 'minus') => void//обработчик добавления/уменьшения количества
    onClickRemove?: () => void
    className?: string
}

export const CartDrawerItem = ({
    imageUrl,
    name,//название варианта
    price,
    quantity,
    details,//параметр для вывода ингредиентов, размера и типа ПИЦЦЫ
    disabled,
    onClickCountButton,
    onClickRemove,
    className,
}: CartDrawerItemProps) => {
    return (
        // Компонент для отрисовки одного элемента корзины
        <div className={cn('flex bg-white p-5 gap-6', {
            'opacity-40 pointer-events-none': disabled//при положительном значении disabled будет отключен элемент
        },className)}>
            {/* Картинка */}
            <CartItemDetails.Image src={imageUrl} />

            {/* Информация */}
            <div className="flex-1">

                {/* параметры варианта и список добавленных ингредиентов */}
                <CartItemDetails.Info name={name} details={details} />

                {/* разделитель */}
                 <hr className="my-3" />

                {/* оставшаяся правая часть элемента */}
                <div className="flex items-center justify-between">
                    {/* слева будет компонент с добавлением количества активирует функцию onClickCountButton*/}
                    <CartItemDetails.CountButton onClick={onClickCountButton} value={quantity} />
                    {/* справа будет компонент с суммой и кнопкой удаления */}
                    <div className="flex items-center gap-3">
                        {/* компонент с ценой */}
                        <CartItemDetails.Price value={price} />
                        {/* удаление товара */}
                        <Trash2Icon
                            onClick={onClickRemove}//при нажатии на иконку с корзиной вызывается ф-ция на удаление элемента(onClickRemove)
                            className="text-gray-400 cursor-pointer hover:text-gray-600"
                            size={16}
                        />
                    </div>
                </div> 
            </div>
        </div>
    )
}