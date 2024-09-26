//элемент формы интегрированный с react-hook-form

'use client'

import React from 'react'
import { RequiredSymbol } from '../required-symbol'
import { Input } from '../../ui/input'
import { ErrorText } from '../error-text'
import { ClearButton } from '../clear-button'
import { useFormContext } from 'react-hook-form'

//расширенный интерфейс от базового инпута React - InputHTMLAttributes<HTMLInputElement>
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    name: string
    label?: string//название поля
    required?: boolean
    className?: string
}

export const FormInput = ({
    name,
    label,
    required,
    className,
    ...props //остальные пропсы для инпута
}: FormInputProps) => {

    //получить из контекста формы пропсы переданные через FormProvider 'react-hook-form' 
    const {
        register,//метод для регистрации инпута в react-hook-form
        formState: { errors },
        watch,
        setValue//метод задающий значение инпута
    } = useFormContext()

    const value = watch(name)//будет следить за каждым изменением значения инпута по полю name
    const errorText = errors[name]?.message as string//текст ошибки будем получать из errors[name]. В виде строки

    //функция очистки поля
    const onClickClear = () => {
        setValue(name, '', { shouldValidate: true })//задаёт по полю name значение ''(пустую строку)
    }
    return (
        <div className='className'>
            {label &&
                <label className="block mb-2 text-sm font-medium text-gray-900">
                    {label} {required && <RequiredSymbol />}

                </label>}

            {/* Поле инпута с кнопкой очиски поля */}
            <div className='relative'>
                <Input className='h-12 text-md' {...register(name)} {...props} autoComplete='nope'/>
                {/* Кнопка очистки поля будет отображаться только если поле заполнено значением */}
                {value && <ClearButton onClick={onClickClear}/>}
            </div>

            {/* Текст ошибки и компонент который будет рендерить эту ошибку*/}
            {errorText &&<ErrorText text={errorText} className='mt-2' />}

        </div>
    )
}