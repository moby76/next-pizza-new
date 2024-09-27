//блок с общей стоимостью заказа на странице предзаказа(корзины)

// 'use client'

import React from 'react'
import { WhiteBlock } from './white-block'
import { CheckoutItemDetails } from './checkout-item-details'
import { ArrowRight, BikeIcon, Package, Percent } from 'lucide-react'
import { Button, Skeleton } from '../ui'

const VAT = 15//налог(%)
const DELIVERY_PRICE = 0//стоимость доставки0

interface CheckoutTotalCostProps {
    totalAmount: number | null
    className?: string
    loading?: boolean//получим это значение из checkoutPage
}

export const CheckoutTotalCost = ({ totalAmount, loading, className }: CheckoutTotalCostProps) => {

        //вычисление налога от стоимости товаров в корзине
        const vatPrice = (totalAmount ?? 0 * VAT) / 100

        //вычисление всей стоимости (товары + налог + доставка)
        const totalPrice = (totalAmount ?? 0) + vatPrice + DELIVERY_PRICE
    

    return (
        <WhiteBlock className="p-6 sticky top-4">
        <div className="flex flex-col gap-1">
            <span className="text-xl">Итого: </span>
            {loading 
            ? <Skeleton className='w-48 h-11 rounded-[10px] bg-gray-600 opacity-5'/> 
            : <span className="h-11 text-4xl font-extrabold">{totalPrice} ₽</span>}
        </div>

        {/* Из чего состоит стоимость заказа */}
        {/* элемент стоимости товаров в корзине */}
        <CheckoutItemDetails
            title={
                <div className="flex items-center">
                    <Package size={26} className="mr-2 text-gray-400" />
                    Стоимость товаров:
                </div>
            }
            value= {loading 
            ? <Skeleton className='w-12 h-6 rounded-[8px] bg-gray-500 opacity-10'/> 
            : `${totalAmount} ₽`} />

        {/* элемент стоимости налогов */}
        <CheckoutItemDetails
            title={
                <div className="flex items-center">
                    <Percent size={26} className="mr-2 text-gray-400" />
                    Налоги:
                </div>
            }
            value={loading 
                ? <Skeleton className='w-12 h-6 rounded-[8px] bg-gray-500 opacity-10'/> 
                : `${vatPrice} ₽`}
            />

        {/* элемент стоимости доставки */}
        <CheckoutItemDetails
            title={
                <div className="flex items-center">
                    <BikeIcon size={26} className="mr-2 text-gray-400" />
                    Доставка:
                </div>
            }
            value={loading 
                ? <Skeleton className='w-12 h-6 rounded-[8px] bg-gray-500 opacity-10'/> 
                : `${DELIVERY_PRICE} ₽`}/>

        {/* кнопка перейти к оплате */}
        <Button
            // disabled={!totalAmount || submitting}
            loading={loading}
            type="submit"
            className="w-full h-14 rounded-2xl mt-6 text-base font-bold"
        >
            Перейти к оплате
            <ArrowRight className="w-5 ml-2" />
        </Button>

    </WhiteBlock>
    )
}