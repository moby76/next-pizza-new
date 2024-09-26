//отображение списка чекбоксов с кнопкой "показать ещё" и скроллом
//Используется в корневой page.tsx

'use client'

import React, { useState } from 'react'
import { FilterCheckBox, FilterCheckBoxProps } from './filter-checkbox'
import { Input, Skeleton } from '../ui'

type Item = FilterCheckBoxProps//тип Item будет соответствовать интерфейсу FilterCheckBoxProps из компонента FilterCheckBox

interface CheckBoxFiltersGroupProps {
    title: string // заголовок группы чекбоксов
    items: Item[]//Сами чекбоксы в виде массива (весь список). Соответствует пропсам FilterCheckBoxProps из FilterCheckBox
    defaultItems?: Item[]//список чекбоксов по умолчанию показанных при первом рендеринге (в нераскрытом списке)
    limit?: number //ограничение списка
    searchInputPlaceholder?: string //заглушка для инпута поиска в списке чекбоксов 
    onChange?: (values: string[]) => void //ф-ция передачи какие чекбоксы были выбраны
    defaultValue?: string[] //дефолтное начальное значение
    className?: string
    loading?: boolean
    onClickCheckbox?: (id: string) => void
    selected?: Set<string>//заданные id чекбоксов(массив уникальных значений)
    name?: string//для дополнительной идентификации чекбоксов
}

export const CheckBoxFiltersGroup = ({
    title,
    items,
    defaultItems,
    limit = 5,
    searchInputPlaceholder = 'Поиск...',
    className,
    loading,
    onClickCheckbox,
    selected,
    name,
}: CheckBoxFiltersGroupProps) => {

    //Состояние для показа всех чекбоксов
    const [showAll, setShowAll] = useState(false)

    //состояние для поиска
    const [searchValue, setSearchValue] = useState('')

    //переменная list со значением в зависимости от значения состояния showAll
    const list = showAll //если showAll=true то list принимает значение = items(все чекбоксы)
        ? items.filter((item) => item.text.toLowerCase().includes(searchValue.toLowerCase())) //и отфильтровываем текст в item по значению searchValue приведя и там и там сначала к нижнему регистру  
        : (defaultItems || items).slice(0, limit) //2. если false, то list=defaultItems от 0 до limit. defaultItems - опционально. Или тогда, если не переданы defaultItems, то отрендерить все items(все чекбоксы) 

    // const onChangeSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setSearchValue(e.target.value);
    //   };
    const onChangeSearchInput = (value: string) => {
        setSearchValue(value)//задаст для searchValue значение переденное из инпута
    }

    if (loading) {
        return <div className={className}>
            <p className='font-bold mb-3'>{title}</p>

            {/* скелетоны при загрузке списка чекбоксов на основании значения limit */}
            {
                ...Array(limit).fill(0).map((_, index) => //создаётся массив значений от 0 до limit 
                    <Skeleton key={index} className='h-6 mb-3 rounded-[3px] bg-black opacity-10' />)
            }
            {/* дополнительный блочёк скелетона для кнопки " + показать все" */}
            <Skeleton className='w-28 h-6 mb-3 rounded-[3px] bg-black opacity-10' />

        </div>
    }

    return (
        // закреплённый элемент при прокрутке(класс sticky)
        <div className={className}>
            {/* Заголовок группы */}
            <p className="font-bold mb-3">{title}</p>
            {/* поле для поиска */}
            {showAll && (//показать поле поиска только если состояние showAll = true(весь список развёрнут)
                <div className="mb-5">
                    <Input
                        onChange={e => onChangeSearchInput(e.target.value)}//передать в функцию onChangeSearchInput значение из инпута
                        placeholder={searchInputPlaceholder}
                        className="bg-gray-50 border-none"
                    />
                </div>
            )}
            {/* Список чекбоксов */}
            <div className="flex flex-col gap-4 max-h-96 pr-2 overflow-auto scrollbar">
                {list.map((item, index) => (//прийти по массиву(переменной) list
                    <FilterCheckBox //передаём в каждый чекбокс массива значения
                        key={index}
                        text={item.text}//текст чекбокса                        
                        endAdornment={item.endAdornment}// передаёт дополнение после текста чекбокса
                        checked={selected?.has(item.value)}//checked = true если selected не пустое, имеет значение item.value
                        // onCheckedChange={() => console.log(item.value)}
                        onCheckedChange={() => onClickCheckbox?.(item.value)}//при нажатии на ЧБ передать в функцию onCheckedChange чекбокса значение чекбокса
                        value={item.value}//значение чекбокса
                        name={name}//получаем из 
                    />
                ))}
            </div>

            {/* кнопка для раскрытия списка. появляется только если значение массива items ,больше чем limit */}
            {items.length > limit && (
                // установим стиль для дива с кнопкой который будет меняться в зависимости от значения showAll
                <div className={showAll ? 'border-t border-t-neutral-100 mt-4' : ''}>
                    {/* Событие onclick будет при нажатии менять состояние showAll на противоположное(true/false) через setShowAll */}
                    <button onClick={() => setShowAll(!showAll)} className="text-primary mt-3">
                        {showAll ? 'Скрыть' : '+ Показать все'}
                    </button>
                </div>
            )}
        </div>
    )
}