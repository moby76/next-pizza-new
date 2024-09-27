//основная страница группа "Оформление заказа"

'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
// import { CheckoutTotalCost, Container, Title } from "@/shared/components/shared";
import {
    CheckOutAddressForm,
    CheckOutCart,
    CheckOutPersonalDataForm,
    CheckoutTotalCost,
    Container,
    Title
} from "@/shared/components";
import { checkoutFormSchema, CheckoutFormSchemaValues } from "@/shared/constants";
import { useCart } from "@/shared/hooks";
import { createOrder } from "@/app/actions";
import toast from "react-hot-toast";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { Api } from "@/shared/services/api-client";

export default function CheckoutPage() {

    //состояние для перезагрузки кнопки "Оформить заказ"
    const [submitting, setSubmitting] = React.useState(false)

    //получить из хука useCart(переиспользованные из useCartStore) стейты: общая сумма, элементы корзины, обновление элемента корзины, удаление элемента из корзины, состояние загрузки
    const { totalAmount, items, updateItemQuantity, removeCartItem, loading } = useCart()


    //получить сессию 
    const { data: session } = useSession()

    //создать форму 
    const form = useForm<CheckoutFormSchemaValues>({
        resolver: zodResolver(checkoutFormSchema),
        defaultValues: {//Значения по умолчанию
            email: '',
            firstName: '',
            lastName: '',
            phone: '',
            address: '',
            comment: '',
        },
    })

    useEffect(() => {

        //создать функцию автоматического заполнения полей формы текущего пользователя
        async function fetchUserInfo() {
            //получить данные текущего в сессии пользователя черес Api.auth.getMe
            const userMe = await Api.auth.getMe()
            // console.log('userMe', userMe);
            //разделить полученное полное имя на имя и фамилию
            const [firstName, lastName] = userMe.fullName.split(' ');

            //и заполнить поля созданной раннее --^ формы полученными данными
            form.setValue('firstName', firstName)
            form.setValue('lastName', lastName)
            form.setValue('email', userMe.email)
        }

        //вернуть функцию fetchUserInfo при существовании пользователя в текущей сессии
        if (session) {
            fetchUserInfo()
        }
    }, [session, form])

    const onSubmitFormDatas = async (data: CheckoutFormSchemaValues) => {
        // console.log('data', data);
        //вшиваем серверную функцию(server action) createOrder(data)
        //createOrder(data)//передаём данные в виде объекта, но в server actions этот объект будет помещён в массив

        try {
            setSubmitting(true) //при первом выполнении присвоить состояние true

            const url = await createOrder(data)//активируем серверную функцию(server action) createOrder(data) и присвоим константе url

            toast.error('Заказ успешно оформлен! 📝 Переход на оплату... ', {
                icon: '✅',
            });

            if (url) {//если url существует, то переходимуем на страницу оплаты
                location.href = url;
            }
        } catch (err) {
            console.log(err);
            setSubmitting(false);//при ошибке загрузка отключается
            toast.error('Не удалось создать заказ', {
                icon: '❌',
            });
        }
        //  finally {
        //     setSubmitting(false)
        // }
    }

    //TODO - занести всё в схему и откомментировать.
    const onClickCountButton = (id: number, quantity: number, type: 'plus' | 'minus') => {
        // console.log('id', id, 'quantity', quantity, 'type', type);
        const newQuantity = type === 'plus' ? quantity + 1 : quantity - 1 //прибавить или уменьшить quantity 
        updateItemQuantity(id, newQuantity)
    }

    return <Container className="mt-10">
        <Title text="Оформление заказа" size='lg' className="font-extrabold mb-8 " />

        {/* обернуть всё в FormProvider для того чтобы все элементы могли использовать методы из хука useForm как контекст  */}
        <FormProvider {...form}>
            {/* форма будет триггериться каждый раз когда будет отрабатывать onSubmit. Как только она поймёт что валидация прошла корректно, вызовет нашу функцию onSubmitFormDatas */}
            <form onSubmit={form.handleSubmit(onSubmitFormDatas)}>

                <div className="flex gap-10">
                    {/* левая часть */}
                    <div className="flex flex-col gap-10 flex-1 mb-20">
                        {/* блок с корзиной */}
                        <CheckOutCart
                            onClickCountButton={onClickCountButton}
                            removeCartItem={removeCartItem}
                            items={items}
                            loading={loading}
                        />

                        {/* блок с персональной информацией */}
                        <CheckOutPersonalDataForm className={loading ? 'opacity-40 pointer-events-none' : ''} />

                        {/* Адрес доставки и комментарий */}
                        <CheckOutAddressForm className={loading ? 'opacity-40 pointer-events-none' : ''} />
                    </div>

                    {/* правая часть */}
                    <div className="w-[450px]">
                        {/* блок с итогами заказа */}
                        <CheckoutTotalCost
                            totalAmount={totalAmount}
                            loading={loading || submitting} />
                    </div>
                </div>

            </form>

        </FormProvider>



    </Container>
}