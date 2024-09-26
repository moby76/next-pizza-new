//Компонент поиска
//Используется в компоненте Header

'use client'

import { cn } from '@/shared/lib/utils'
import { Api } from '@/shared/services/api-client'
import { Product } from '@prisma/client'
import { Search } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { useClickAway, useDebounce } from 'react-use'

interface SearchInputProps {
    className?: string
}

export const SearchInput = ({ className }: SearchInputProps) => {

    //Создать состояние для значения из поля инпута
    const [searchQuery, setSearchQuery] = useState('')

    //создать состояние для фокусировки поля поиска
    const [focused, setFocused] = useState(false)

    //состояние для отображения найденных продуктов
    const [products, setProducts] = useState<Product[]>([]);

    //отследить состояние элемента в который будет внедрён ref(useRef) и вернуть его при нажатии вне его. Используем хук useRef. Внедрим его в поле/див поиска
    const ref = useRef<HTMLInputElement>(null)
    //и хука useClickAway из пакета react-Use
    useClickAway(ref, () => {
        // console.log('OUTSIDE CLICKED');
        setFocused(false)//при нажатии вне поля/дива меняем состояние фокусировки на false
    })

    //при изменении значения в поле поиска (searchQuery) будет происходить запрос на получение данных для поиска
    useDebounce(() => {//используем хук useDebounce: тот-же useEffect --^, но с задержкой
        Api.products.search(searchQuery)//в метод происходит запрос к 
            .then(items => {
                setProducts(items)//задаются значения для переменной products на основе 
            })
    },
        1000, //параметр (в милисекундах) на задержку отправки запроса
        [searchQuery])

    //функция реализующая исчезновение PopUp окна при переходе на страницу товара. Обнуляет все значения переменных состояний
    const onClickItem = () => {
        // e.preventDefault()
        setFocused(false)//скрывает блокирующий фон попап окна(отключает экранирование)
        setSearchQuery('')//очищает поиск
        // setProducts([])//очищает массив найденных продуктов//FIXME - 
    }

    return (
        <>
            {/* див для создания серого фона yна весь экран(экранирование). Активируется только при состоянии focused=true */}
            {focused && <div className="fixed top-0 left-0 bottom-0 right-0 bg-black/50 z-30" />}


            {/* Поле поиска */}
            <div ref={ref} className={cn('flex rounded-2xl flex-1 justify-between relative h-11 z-30', className)}>
                <Search className="absolute top-1/2 translate-y-[-50%] left-3 h-5 text-gray-400" />
                <input
                    className="rounded-2xl outline-none w-full bg-gray-100 pl-11"
                    type="text"
                    placeholder="Найти пиццу..."
                    onFocus={() => setFocused(true)}//при наведении меняем состояние фокусировки на true
                    value={searchQuery}//значение инпута. 
                    onChange={(e) => setSearchQuery(e.target.value)}//задаём значение для searchQuery
                />

                {/* PopUp окно со списком результатов поиска отображается только при нахождении хоть одного товара(products.length >0 )*/}

                {products.length > 0 && <div className={cn(
                    'absolute w-full bg-white rounded-xl py-2 top-14 shadow-md transition-all duration-200 invisible opacity-0 z-30',//и внедрим классы по условию, если focused = true
                    focused && 'visible opacity-100 top-12'
                )}>
                    {products.map((product) => (
                        <Link
                            onClick={onClickItem}//при нажатии на элемент списка будет вызываться функция скрытия окна
                            key={product.id}
                            href={`/product/${product.id}`}
                            className="flex items-center gap-3 w-full px-3 py-2 hover:bg-primary/10 cursor-pointer"
                        >
                            <img
                                className='rounded-sm h-8 w-8'
                                src={product.imageUrl}
                                alt={product.name}
                            />
                            <span>{product.name}</span>
                        </Link>
                    ))
                    }
                </div>}
            </div >
        </>
    )
}