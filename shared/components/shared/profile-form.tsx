//компонент профиля зарегистрированного пользователя
//Будет рендерить форму изменения профиля и кнопку выхода из аккаунта
//позволяет изменить имя, почту, пароль пользователя

'use client'

import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@prisma/client';
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form';
import { formRegisterSchema, FormRegisterSchemaValues } from './modals/auth-modals/forms/schemas';
import toast from 'react-hot-toast';
import { signOut } from 'next-auth/react';
import { Container } from './container';
import { Title } from './title';
import { FormInput } from './form-components';
import { Button } from '../ui';
import { updateUserInfo } from '@/app/actions';

interface Props {
    // className?: string
    data: User;//поле data проверять по типу User из 
}

export const ProfileForm = ({ data }: Props) => {

    //
    const form = useForm({
        resolver: zodResolver(formRegisterSchema),//для валидации используется та-же схема что и при регистрации
        defaultValues: {
            //рендерит после перезагрузки страницы:
            fullName: data.fullName,//полное имя из переданных данных из страницы
            email: data.email,//почту из переданных данных
            password: '',//пустой инпут пароля
            confirmPassword: '',//пустой инпут подтверждения пароля
        },
    });

    //функция которая будет изменять наши данные с помощью серверного действия(server action) updateUserInfo
    const onSubmitUpdateForm = async (data: FormRegisterSchemaValues) => {
        try {
            await updateUserInfo({//запустить функцию обновления данных передав туда данные которые получим в свою очередь от страницы profile/page.tsx
                email: data.email,
                fullName: data.fullName,
                password: data.password,
            });

            toast.error('Данные обновлены 📝', {
                icon: '✅',
            });
        } catch (error) {
            return toast.error('Ошибка при обновлении данных', {
                icon: '❌',
            });
        }
    };

    //функция для выхода из аккаунта. Предоставлена из пакета 'next-auth/react'
    const onClickSignOut = () => {
        signOut({
            callbackUrl: '/',
        })
    };

    return (
        <Container className='my-10'>
            <Title text={`Личные данные | #${data.id}`} size="md" className="font-bold" />

            <FormProvider {...form}>
                <form className="flex flex-col gap-5 w-96 mt-10" onSubmit={form.handleSubmit(onSubmitUpdateForm)}>
                    <FormInput name="email" label="E-Mail" required autoComplete='do-not-autofill' />
                    <FormInput name="fullName" label="Полное имя" required />

                    <FormInput type="password" name="password" label="Новый пароль" required />
                    <FormInput type="password" name="confirmPassword" label="Повторите пароль" required />

                    <Button disabled={form.formState.isSubmitting} className="text-base mt-10" type="submit">
                        Сохранить
                    </Button>

                    <Button
                        onClick={onClickSignOut}
                        variant="secondary"
                        disabled={form.formState.isSubmitting}
                        className="text-base"
                        type="button">
                        Выйти
                    </Button>
                </form>
            </FormProvider>

        </Container>
    )
}