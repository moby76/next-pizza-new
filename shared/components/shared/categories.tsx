//Компонент - меню с выбором категорий товаров 
//Используется в компоненте TopBar(Меню категорий)
'use client'

import { cn } from '@/shared/lib/utils'
import { useCategoryStore } from '@/shared/store'
import { Category } from '@prisma/client'
import React from 'react'

interface categoriesProps {
    categoryItems: Category[]
    className?: string
}



export const Categories = ({ categoryItems ,className }: categoriesProps) => {

    //получим ативный id из global-state испольуя ф-цию useCategoryStore из store которая в свою очередь придаёт значения для activeId получив его из ProductGroupList
    const categoryActiveId = useCategoryStore((state) => state.activeId)//NOTE - activeId(получим активный id)

    return (
        <div className={cn('inline-flex gap-1 bg-gray-50 p-1 rounded-2xl', className)}>
            {
                categoryItems.map(({id, name}, index)=> (
                    <a className={cn(
                        'flex items-center font-bold h-11 rounded-2xl px-5',
                        categoryActiveId === id && 'bg-white shadow-md shadow-gray-200 text-primary'//при совпадении значений активного пункта меню и значения текущего будет применён класс '......'
                    )} 
                    href={`/#${name}`}//ссылка на якорь по имени категории на странице 
                    key={index} >
                        <button>{name}</button>
                    </a>
                ))
            }
        </div>
    )
}

// export default categories
