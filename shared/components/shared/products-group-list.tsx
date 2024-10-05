//Список продуктов на главной странице
//используется в корневом page.tsx
'use client'

import React, { useEffect } from 'react'
import { useIntersection } from 'react-use';
import { Title } from './title'
import { cn } from '@/shared/lib/utils'
import { ProductCard } from './product-card'
import { useCategoryStore } from '@/shared/store';
import { Product_IngredientWithPayload, ProductWithRelations } from '@/@types/prisma';

interface ProductGroupListProps {
    title: string
    items: ProductWithRelations[]
    categoryId: number//ID категории
    className?: string
    listClassName?: string// Классы для списка
    
}

export const ProductGroupList = ({
    title,
    items,
    listClassName,
    categoryId,
    className,
}: ProductGroupListProps) => {

    //функция обновляющая активную категорию в глобал-стейте. Используем ф-цию useCategoryStore созданную методом среате библ. zustand из '@/store/category' 
    const setActiveCategoryId = useCategoryStore((state) => state.setActiveId)//NOTE - setActiveId(зададим активный id)

    //Используем метод useIntersection библиотеки 'react-use' для сопоставления событий в разных компонентах и синхронизации их через глобальный СТЕЙТ
    //что-бы в компоненте Categories становились активными пункты меню в зависимости от попадания в фокус браузера категории этого (ProductGroupList) компонента
    const intersectionRef = React.useRef(null)
    const intersection = useIntersection(intersectionRef, {
        // root: null,
        // rootMargin: '0px',
        threshold: 0.4
    })


    //useEffect который будет отлавливать изменения и в зависимости от этого оповещать глобальный СТЕЙТ о том что изменение произошло
    useEffect(()=>{
        if (intersection?.isIntersecting) { //условие что сейчас наш блок в зоне видимости экрана
            // console.log(title, categoryId);
            setActiveCategoryId(categoryId) //активируем ф-цию обновления глобального-стейта. Передавать эти значения в компонент Categories
          }
    }, [categoryId, intersection?.isIntersecting, title])

    return (
        <div className={className} id={title} ref={intersectionRef}>
            {/* Заголовок группы товаров */}
            <Title text={title} size="lg" className="font-extrabold mb-5" />
            {/* сами товары в виде сетки из 3-х колонок */}
            <div className={cn('grid grid-cols-3 gap-[50px]', listClassName)}>
                {items.map((product, i) => (
                    //выводим карточки товаров передав в них полученные в текущий коапонент значения
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        imageUrl={product.imageUrl}
                        price={product.ProductItem[0]?.price ?? 0}//стоимость вариантов продукта(массив). отображаем стоимость первого(!) элемента массива. именно она будет отображаться в карточке
                        ingredients={product.Product_Ingredient}
                    />
                ))}

            </div>
        </div>
    )
}