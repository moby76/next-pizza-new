// Содержимое диалогового окна при выборе продуктов кроме ПИЦЦЫ

'use client'

import { cn } from '@/shared/lib/utils';
import React from 'react'
import { Title } from './title';
import { Button } from '../ui';

interface ChooseProductFormProps {
    imageUrl: string;
    name: string;
    price: number | null;
    loading?: boolean;//получим состояние загрузки из компонента модального окна для дальнейшей передачи его в состояние компонента кнопки < Button />
    // onSubmit: (itemId: number, ingredients: number[]) => void;
    onSubmit?: () => void;//функция не возвращает ничего. Отрабатывает в родительском компоненте chooseProductModal при нажатии на кнопку "Добавить в корзину"
    className?: string;
}

//** Форма выбора продукта */
export const ChooseProductForm = ({
    name,    
    imageUrl, 
    price,  
    loading,    
    onSubmit,
    className,
}: ChooseProductFormProps) => {

    //информация о размерах и типе теста
    // const textDetails = '30 см, традиционное тесто 30'
    //цена
    // const totalPrice = 350

    return (
        <div className={cn(className, 'flex flex-1')}>

            {/* картинка */}
            <div className="flex items-center justify-center flex-1 relative w-full">
                <img
                    src={imageUrl}
                    alt={name}
                    className="relative left-2 top-2 transition-all z-10 duration-300 w-[350px] h-[350px]"
                />
            </div>
            {/* блок с описанием */}
            <div className="w-[490px] bg-[#f7f6f5] p-7">
                {/* название */}
                <Title text={name} size='md' className='font-extrabold mb-1' />

                {/* Детали */}
                {/* <p className='text-gray-800'>{textDetails}</p> */}

                {/* кнопка добавления в корзину */}
                <Button
                    loading={loading}
                    // onClick={handleClickAdd}
                    onClick={() => onSubmit?.()}// не передаём объект события, а вызываем саму функцию onSubmit//ATTENTION - Тут не понятно. Объясняет на 13:38:40
                    className="h-[55px] px-10 text-base rounded-[18px] w-full mt-10">
                    Добавить в корзину за {price} ₽
                </Button>
            </div>

        </div>
    )
}