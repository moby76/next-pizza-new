//компонент выбора вариантов товаров

'use client'

import { cn } from '@/shared/lib/utils'
import React from 'react'

//тип описывающий объект варианта
export type Variant = {
    name: string //название варианта
    value: string //значение варианта
    disabled?: boolean //включен/отключен
};

interface GroupVariantsProps {
    items: readonly Variant[] //рендерится массив вариантов
    onClick?: (value: Variant['value']) => void //функция меняющая значение варианта
    selectedValue?: Variant['value'] //Выбранное значение варианта
    // defaultValue?: string //значение варианта по умолчанию
    className?: string
}

export const GroupVariants = ({ items, onClick, selectedValue, className }: GroupVariantsProps) => {
    return (
        <div className={cn(className, 'flex justify-between bg-[#e7e7e7] rounded-3xl p-1 select-none')}>
            {items.map((item) => (
                <button
                    key={item.name}
                    onClick={() => onClick?.(item.value)} //при нажатии передаём значение 
                    className={cn(
                        'flex items-center justify-center cursor-pointer h-[30px] px-5 flex-1 rounded-3xl transition-all duration-400 text-sm',
                        // дополнитель ные классы(в зависимости от выбранного значения)
                        {
                            'bg-white shadow': item.value === selectedValue,//класс кнопки если выбран пункт
                            'text-gray-500 opacity-50 pointer-events-none': item.disabled, //класс если кнопка отключена
                        },
                    )}
                >
                    {item.name}
                </button>
            ))}
        </div>
    )
}