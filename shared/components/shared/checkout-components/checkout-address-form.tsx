//Компонент-блок с формой адреса на странице оформления заказа из корзины

'use client'

import React from 'react'
import { WhiteBlock } from '../white-block'
import { Input, Textarea } from '../../ui'
import { FormInput, FormTextarea } from '../form-components'
import { AddressInput } from '../address-input'
import { Controller, useFormContext } from 'react-hook-form'
import { ErrorText } from '../error-text'

interface Props {
    // disabled?: boolean
    className?: string
}



export const CheckOutAddressForm = ({ className }: Props) => {

    const { control } = useFormContext()//для контроля применим метод control из useFormContext

    return (
        <WhiteBlock title="3. Адрес доставки" className={className}>
            <div className="flex flex-col gap-5">
                {/* <Input name="firstName" className="text-base" placeholder="Адрес доставки" /> */}

                {/* используем компонент AddressInput для ввода/поиска адресов */}
                {/* для возможности валидации этого компонента используем контроллер от библиотеки react-hook-form */}
                <Controller
                    //компонент будет каждый раз перерисовываться при изменении формы AddressInput
                    control={control}
                    name="address"
                    render={({ field, fieldState}) => (
                        <>
                            <AddressInput //этот компонент сформирован с помощью библиотеки react-dadata
                                onChange={field.onChange}//как только значение будет изменено, то будет вызван метод onChange и "повешан" на field render-метода
                            />

                            {/* отобразить ошибку с компонентом ErrorText */}
                            {fieldState.error?.message && <ErrorText text={fieldState.error.message} />}
                        </>
                    )}
                />


                <FormTextarea
                    name='comment'
                    rows={5}//количество строк
                    placeholder="Комментарий к заказу"
                    className="text-base"//базовый размер текста(16px)
                />
            </div>
        </WhiteBlock>
    )
}