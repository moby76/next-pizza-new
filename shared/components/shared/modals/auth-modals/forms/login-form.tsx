//Форма для авторизации по логину и паролю. Она будет в составе модального окна авторизации

// 'use client'

import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { formLoginSchema, FormLoginSchemaValues } from './schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Title } from '../../../title'
import { FormInput } from '../../../form-components/form-input'
import { Button } from '@/shared/components/ui'
import toast from 'react-hot-toast'
import { signIn } from 'next-auth/react'

interface Props {
    // className?: string
    // onClose?: () => void
    onClose?: VoidFunction//эта функция будет передаваться в компонент и ПРИ УСПЕШНОЙ Авторизации вызывать закрытие модального окна
}

export const LoginForm = ({ onClose }: Props) => {

    //создать компоненты/параметры для формы с помощью useRorm
    const form = useForm<FormLoginSchemaValues>({
        resolver: zodResolver(formLoginSchema),//будут проходить через валидацию zod
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const onSubmiLoginForm = async (data: FormLoginSchemaValues) => {
        // console.log('data', data)
        try {
            // * передать ответ который мы получим от бэкенда через метод signIn
            const resp = await signIn(
                'credentials', {//используем провайдер для credentials
                    ...data,//передав в него данные валидированные из нашей формы
                    redirect: false//и никуда не перекидывать после авторизации, избежав перезагрузки страницы
                }
            )

            //если не получен ответ
            if (!resp?.ok) {
                throw Error() //то триггерит блок catch с ошибкой
            }

            //если получен ответ
            toast.success('Вы успешно вошли в аккаунт', {
                icon: '✅'
            })

            onClose?.()//закрыть модальное окно авторизации

        } catch (error) {
            console.log('Error [LOGIN]', error)
            toast.error('Не удалось войти в аккаунт', {
                icon: '❌'
            })
        }
    }

    return (

        //создать html-форму, обернув её в контекст FormProvider с параметрами form --^. 
        //Отправка произойдёт только просле прохождения валидации. Это обеспечивается методом handleSubmit библиотеки react-hook-form. https://react-hook-form.com/docs/useform/handlesubmit
        <FormProvider {...form}>
            <form className='flex flex-col gap-5' onSubmit={form.handleSubmit(onSubmiLoginForm)}>

                <div className="flex justify-between items-center">
                    <div className="mr-2">
                        <Title text="Вход в аккаунт" size="md" className="font-bold" />
                        <p className="text-gray-400">Введите свою почту, чтобы войти в свой аккаунт</p>
                    </div>
                    <img src="/assets/images/phone-icon.png" alt="phone-icon" width={60} height={60} />
                </div>

                {/* Используем компонент FormInput из FormComponents ('../../../form-components/form-input') */}
                <FormInput name="email" label="E-Mail"/>
                <FormInput name="password" label="Пароль" type="password" required />

                {/* кнопка отправки формы --^. тип кнопки submit будет "триггерить" форму если в ней есть onSubmit. кнопка будет в состоянии загрузки если форма готова к отправке/и наоборот */}
                <Button loading={form.formState.isSubmitting} className="h-12 text-base" type="submit">
                    {/* сделать проверку: если форма прошла проверку и готова к отправке. 
                    через метод state(проверка состояния формы) , присоединяет метод isSubmitting(true/false)(готова к отправлению) */}
                    {form.formState.isSubmitting ? 'Вход...' : 'Войти'}
                </Button>

            </form>
        </FormProvider>)
}