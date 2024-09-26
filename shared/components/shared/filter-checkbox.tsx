//компонент чекбокса с лейблом
//входит в состав компонента CheckBoxFiltersGroup

'use client'

import React from 'react';
import { Checkbox } from '../ui/checkbox';//получим компонент Checkbox из ui-компонентов 

export interface FilterCheckBoxProps {
    text: string //текст чекбокса
    value: string;//значение чекбокса
    endAdornment?: React.ReactNode;//тип дополнения после текста
    onCheckedChange?: (checked: boolean) => void;//тип значения для функции onCheckedChange
    checked?: boolean;//какое состояние у чекбокса при его рендере
    name?: string;
}

export const FilterCheckBox = ({
    text,
    value,
    endAdornment,
    onCheckedChange,
    checked,
    name,
}: FilterCheckBoxProps) => {
    
    return (
        // Рендерим чекбокс(из ui) и лейбл чекбокса 
        <div className="flex items-center space-x-2">
            <Checkbox
                onCheckedChange={onCheckedChange}//
                
                checked={checked}//передаём значение чекбокса(true/false)
                value={value} //значение чекбокса из массива
                className="rounded-[8px] w-6 h-6"
                id={`checkbox-${String(name)}-${String(value)}`}//присваиваем id по которому он так-же будет активирован/деактивирован при нажатии на лейблы/поля форм с подобным значением свойства htmlFor 
            />
            <label
                htmlFor={`checkbox-${String(name)}-${String(value)}`}//htmlFor - позволяет применить действие на элемент с id в котором прописан это-же значение id(в нашем случае - это элемент Checkbox)
                className="leading-none cursor-pointer flex-1">
                {text}
            </label>
            {endAdornment}
        </div>
    );
};
