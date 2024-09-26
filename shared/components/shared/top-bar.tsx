//Компонент включающий в себя меню с категориями и сортировку

import { cn } from '@/shared/lib/utils'
import React from 'react'
import { Container } from './container'
import { Categories } from './categories'//компонент категорий
import { SortPopup } from './sort-popup'
import { Category } from '@prisma/client'//типизация категорий сформированная prisma

interface TopBarProps {
    categories: Category[]
    className?: string
}

export const TopBar = ({ categories ,className }: TopBarProps) => {
    return (
        // закреплённый элемент при прокрутке(класс sticky)
        <div className={cn('sticky top-0 bg-white py-5 shadow-lg shadow-black/5 z-10', className)}>
            <Container className="flex items-center justify-between ">
                <Categories categoryItems={ categories }/>
                <SortPopup />
            </Container>
        </div>
    )
}