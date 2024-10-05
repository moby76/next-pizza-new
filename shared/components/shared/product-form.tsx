//Rомпонент отображающий продукт. Объединяет в себе компоненты ChooseProductForm и ChoosePizzaForm и выводит их в зависимости от полученных и переданных параметров
//Компонент вызывается из компонента модального окна choose-product-modal.tsx и из страницы продукта product/[id]/page.tsx 

'use client'

import { ProductWithRelations } from '@/@types/prisma'
import { useCartStore } from '@/shared/store'
import React from 'react'
import toast from 'react-hot-toast'
import { ChoosePizzaForm } from './choose-pizza-form'
import { ChooseProductForm } from './choose-product-form'

interface ProductFormProps {
    product: ProductWithRelations //расширенный продукт с ингредиентами = пицца. Значения для него приходят из слота @modal/(.)product/id
    onSubmit?: () => void//функция для закрытия модального окна. Срабатывает при использовании этого компонента в компоненте ChooseProductModal
    className?: string
}

export const ProductForm = ({ product, onSubmit: _onSubmit, className }: ProductFormProps) => {

    //STEP-5 получим из Store запрос на добавление элемента в корзину
    const [addCartItem, loading] = useCartStore(state => [
        state.addCartItem,
        state.loading//получаем состояние загрузки из глобального стейта Store
    ])

    //STEP-3 - получить вариант продукта. У каждого продукта есть свой вариант на базе этого продкукта. для пицц этот вариант расширен размером(size) и типом(type). а для простого продукта ничем не дополнен. В обоих случаях (и там и там) есть productId и price
    const firstItem = product.ProductItem[0]
    // console.log('firstItem', firstItem);


    //STEP-4 выполнить проверку на предмет наличия/отсутствия типов(productType) в вариациях продукта (productItems). В зависимости от этого будет определяться как ПИЦЦА или НЕ ПИЦЦА
    const isPizzaForm = Boolean(firstItem.productType)

    //STEP-6 - функция на добавление продукта или ПИЦЦЫ в корзину в зависимости от пришедших параметров
    const onSubmit = async (productItemId?: number, ingredients?: number[]) => {//в параметрах или получаем productItemId + ingredients(если onSubmit вызывается из компонента ChoosePizzaForm), или ничего не получаем если onSubmit вызывается из компонента ChooseProductForm
        try {
            const itemId = productItemId ?? firstItem.id // если productItemId = null(не приходит в параметрах), то присваиваем значение firstItem.id

            await addCartItem({ // используем функцию addCartItem из Store
                productItemId: itemId, //значение для productItemId присваиваются обязательно(как это указано в интерфейсе CreateCartItemValues)
                ingredients // ингредиенты передаются опционально(как это указано в интерфейсе CreateCartItemValues). Могут быть, могут отсутствовать
            })

            toast.success('продукт ' + product.name + ' добавлен в корзину')
            // router.back() // роутер в этом компоненте нам не нужен

            _onSubmit?.()//вызывается при успешном выполнении

        } catch (error) {

            toast.error('продукт ' + product.name + ' Не удалось добавить в корзину')
            console.error(error)
        }
    }


    if (isPizzaForm) {
        return (
            < ChoosePizzaForm
                key={product.id}
                name={product.name}
                imageUrl={product.imageUrl}
                ingredients={product.Product_Ingredient}//передаётся таблица соединяющая продукт с его ингредиентами
                items={product.ProductItem}
                onSubmit={onSubmit}//для формы добавления пиццы передадим ф-цию onAddPizza в onSubmit
                loading={loading}//передаём состояние загрузки в компонент ChoosePizzaForm
            />
        )
    } else {
        return (
            < ChooseProductForm
                key={product.id}
                imageUrl={product.imageUrl}
                name={product.name}
                price={firstItem.price}
                onSubmit={onSubmit}//для формы добавления продукта передадим ф-цию onAddProduct в onSubmit
                loading={loading}//передаём состояние загрузки в компонент ChooseProductForm
            />
        )
    }
}