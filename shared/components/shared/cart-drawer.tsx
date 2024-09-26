//компонент отображающий состояние корзины. Реализуем с помощью UI-компонента Sheet(Листовка) библиотеки Shadcn

'use client'

import React, { useEffect, useState } from 'react'

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/shared/components/ui/sheet"
import Link from 'next/link'
import { Button } from '../ui'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { CartDrawerItem } from './cart-drawer-item'
import { getCartItemDetails } from '@/shared/lib'
import { useCartStore } from '@/shared/store'
import { PizzaSize, PizzaType } from '@/shared/constants/pizza'
import Image from 'next/image'
import { Title } from './title'
import { cn } from '@/shared/lib/utils'
import { useCart } from '@/shared/hooks'


// export const CartDrawer = ({ className }: CartDrawerProps) => {
export const CartDrawer = ({ children }: React.PropsWithChildren) => {

    // //получить нужные в этом компоненте стейты из хранилища(хука) useCartStore
    // const [totalAmount, items, fetchCartItems, updateItemQuantity, removeCartItem] = useCartStore(state => [
    //     state.totalAmount,
    //     state.items,
    //     state.fetchCartItems, //состояние на получение элементов корзины
    //     state.updateItemQuantity,//состояние на обновление    
    //     state.removeCartItem //состояние на удаление элемента из корзины      
    // ])

    // //Используем хук useEffect для получения данных по корзине через хук useCartStore(fetchCartItems)
    // useEffect(() => {
    //     fetchCartItems()
    // }, [])

    //получить из хука useCart(переиспользованные из useCartStore) стейты: оющая сумма, элементы корзины, обновление элемента корзины, удаление элемента из корзины
    const { totalAmount, items, updateItemQuantity, removeCartItem } = useCart()

    //состояние для загрузки при нажатии на кнопку Оформить заказ
    const [redirecting, setRedirecting] = useState(false)

    //TODO - занести всё в схему и откомментировать.
    const onClickCountButton = (id: number, quantity: number, type: 'plus' | 'minus') => {
        // console.log('id', id, 'quantity', quantity, 'type', type);
        const newQuantity = type === 'plus' ? quantity + 1 : quantity - 1 //прибавить или уменьшить quantity 
        updateItemQuantity(id, newQuantity)
    }

    return (
        <Sheet>
            {/* компонент SheetTrigger с помощью которого открывается листовка. children - активирует/триггерит рендеринг Sheet. обязательно указать asChild */}
            <SheetTrigger asChild>{children}</SheetTrigger>
            {/* контент листовки */}
            <SheetContent className="flex flex-col justify-between pb-0 bg-[#F4F1EE]">
                <SheetTitle />
                <SheetDescription />
                <div className={cn('flex flex-col h-full', !totalAmount && 'justify-center')}>
                    {totalAmount !== null && totalAmount > 0 && (
                        <SheetHeader>
                            {/* В корзине <span className='font-bold'>{items.length} </span> */}
                            В корзине <span className='font-bold'>{items.length} товара</span>
                        </SheetHeader>
                    )}

                    {/* если нет значения суммы вывести блок с картинкой, тектом оповещения и кнопкой закрытия */}
                    {!totalAmount && <div className='flex flex-col items-center justify-center w-72 mx-auto'>
                        <Image src='/assets/images/empty-box.png' width={120} height={120} alt='empty-cart' />
                        <Title size='sm' text='Корзина пустая' className='text-center font-bold my-2' />
                        <p className="text-center text-neutral-500 mb-5">
                            Добавьте хотя бы одну пиццу, чтобы совершить заказ
                        </p>
                        {/* кнопка закрытия в компоненте SheetClose из библиотеки Shadcn/radixui который триггерит закрытие всего базового компонента sheet*/}
                        <SheetClose>
                            <Button className="w-56 h-12 text-base" size="lg">
                                <ArrowLeft className="w-5 mr-2" />
                                Вернуться назад
                            </Button>
                        </SheetClose>
                    </div>}

                    {/* при условии что сумма не равна нулю и больше нуля отобразить блок с элементами корзины и футер корзины*/}
                    {totalAmount !== null && totalAmount > 0 && (
                        <>
                            <div className="-mx-6 mt-5 overflow-auto scrollbar flex-1">
                                {/* блок с элементами корзины */}
                                {items && items.map((item) => (
                                    <div key={item.id} className='mb-2'>
                                        <CartDrawerItem
                                            id={item.id}
                                            // imageUrl={'https://media.dodostatic.net/image/r:233x233/11EE7D61304FAF5A98A6958F2BB2D260.webp'}
                                            imageUrl={item.imageUrl}
                                            details={
                                                getCartItemDetails(//передадим значение в виде строки созданной функцией getCartItemDetails. 
                                                    //передать на обработкув getcartItemDetails: ингредиенты, тип пиццы и размер пиццы
                                                    item.ingredients,
                                                    item.pizzaType as PizzaType, //присвоить директивно тип (alias) type PizzaType = 1 | 2 import PizzaType для выбора именно только из этих значений
                                                    item.pizzaSize as PizzaSize  //присвоить директивно тип (alias) type PizzaSize = 20 | 30 | 40 import PizzaSize для выбора именно только из этих значений
                                                )}
                                            name={item.name}//название варианта
                                            price={item.price}
                                            quantity={item.quantity}

                                            disabled={item.disabled}
                                            //TODO - занести всё в схему и откомментировать.
                                            onClickCountButton={(type) => onClickCountButton(item.id, item.quantity, type)}
                                            onClickRemove={() => removeCartItem(item.id)}//активируем функцию removeCartItem передав в неё id элемента
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* футер Листовки */}
                            <SheetFooter className='-mx-6 bg-white p-8'>
                                <div className='w-full'>
                                    <div className="flex mb-4">
                                        <span className="flex flex-1 text-lg text-neutral-500">
                                            Итого
                                            <div className="flex-1 border-b border-dashed border-b-neutral-200 relative -top-1 mx-2" />
                                        </span>

                                        {/* <span className="font-bold text-lg">{totalAmount} ₽</span> */}
                                        <span className="font-bold text-lg">{totalAmount} ₽</span>
                                    </div>

                                    {/* Кнопка оформления заказа. переход на страницу оформления /checkout */}
                                    <Link href="/checkout">
                                        <Button
                                            onClick={() => setRedirecting(true)}//при нажатии задаёт значение для redirecting = true
                                            loading={redirecting}//передаём значение redirecting в компонент Button
                                            // type="submit"
                                            className="w-full h-12 text-base">
                                            Оформить заказ
                                            <ArrowRight className="w-5 ml-2" />
                                        </Button>
                                    </Link>
                                </div>
                            </SheetFooter>
                        </>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}