//Компонент - продуктовая карточка для представлениия на главной странице
//используется в компоненте "Список продуктов" - компонент ProductGroupList

import Link from 'next/link'
import React from 'react'
import { Title } from './title'
import { Button } from '../ui'
import { Plus } from 'lucide-react'
import { Ingredient } from '@prisma/client'
import { ProductIngredientWithPayload } from '@/@types/prisma'

interface ProductCardProps {
    id: number
    name: string //название продукта
    price: number //стоимость
    imageUrl: string //ссылка на картинку
    // ingredients: Ingredient[]
    ingredients: ProductIngredientWithPayload[]
    className?: string
}

export const ProductCard = ({
    id,
    name,
    price,
    imageUrl,
    ingredients,
    className,
}: ProductCardProps) => {
    return (
        <div className={className}>
            {/* вся карточка будет ссылкой. ссылка - компонент Link (Nextjs) */}
            <Link href={`/product/${id}`}>
                {/* картинка */}
                <div className='flex justify-center p-6 bg-secondary rounded-lg h-[260px]'>
                    <img
                        className='w-[215px] h-[215px]'
                        src={imageUrl}
                        alt={name}
                    />
                </div>
                {/* Название продукта */}
                <Title
                    text={name}
                    size='sm'
                    className='mb-1 mt-3 font-bold'
                />
                {/* Ингредиенты */}
                <p className='text-sm text-gray-600'>
                    {/* выведем список ингредиентов этого товара через запятую */}
                    {ingredients.map((ingredient) => ingredient.Ingredient?.name).join(', ')}
                    {/* Циплёнок, моцарелла, сыр чеддер и пармезан, томаты,
                    чесночный соус, соус альфредо */}
                </p>
                {/* Блок стоимости и добавления товара */}
                <div className='flex justify-between items-center mt-4'>
                    {/* цена */}
                    <span className='text-[20px]'>
                        от <b>{price} ₽</b>
                    </span>
                    {/* кнопка Добавить */}
                    <Button
                        variant='secondary'
                        className='text-base font-bold'
                    >
                        <Plus
                            size={20}
                            className='mr-1'
                        />
                        Добавить
                    </Button>
                </div>
            </Link>
        </div>
    )
}
