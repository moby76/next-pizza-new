//компонент Header

'use client'

import { cn } from '@/shared/lib/utils'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Container } from './container'
import Link from 'next/link'
import { SearchInput } from './search-input'
import { CartButton } from './cart-button'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { ProfileButton } from './profile-button'
import { AuthModal } from './modals'

interface HeaderProps {
    hasSearch?: boolean//поле - логическое. используется для отключения поиска. Например в слое заказов(CheckoutLayout)
    hasCart?: boolean//поле - логическое. используется для отключения корзины. Например в слое оформления заказа
    className?: string
}

export const Header = ({ hasSearch = true, hasCart = true, className }: HeaderProps) => {//по умолчанию значение для параметра hssearch = true

    //стейт для закрития/открытия модального окна авторизации
    const [openAuthModal, setOpenAuthModal] = useState(false)

    const router = useRouter()

    //нужно получить параметры из строки запроса. С помощью хука useSearchParams от next/navigation
    const searchParams = useSearchParams()

    //используем этот компонент для реализации оповещения об успешной оплате. Нужно "отловить" параметр paid, возвращаемый при прохождении успешной оплаты
    useEffect(() => {

        // * создать оповещение для тостера
        let toastMessage = ''

        // ** создаётся оповещение выводимое при успешном оплате заказа
        if (searchParams.has('paid')) {//если в поисковой строке будет параметр paid

            // задаётся значение оповещения при успешной оплате
            toastMessage = 'Заказ успешно оплачен! 🎉', { position: 'top-center' }
        }

        // ** создаётся оповещение выводимое при успешной регистрации
        if (searchParams.has('verified')) {//если в поисковой строке будет параметр verified
            // задаётся значение оповещения при успешной оплате
            toastMessage = 'Почта успешно подтверждена! 🎉', { position: 'top-center' }
        }

        // *** выводится "тостер" с задержкой с оповещением созданным в зависимости от параметра строки браузера()
        if (toastMessage) {
            setTimeout(() => {
                router.replace('/')
                toast.success(toastMessage, {
                    duration: 3000
                })
            }, 500);
        }

    }, [])

    return (
        <header className={cn(' border-b', className)}>

            {/* Используем универсальный контейнер из компонентов /shared */}
            <Container className='flex items-center justify-between py-8'>

                {/* Левая часть */}
                <Link href={"/"}>
                    <div className="flex items-center gap-4">
                        <Image src="/logo.png" alt="Logo" width={35} height={35} />
                        <div>
                            <h1 className="text-2xl uppercase font-black">Next Pizza</h1>
                            <p className="text-sm text-gray-400 leading-3">вкусней уже некуда</p>
                        </div>
                    </div>
                </Link>

                {/* поиск. отображается только если параметр hasSearch = true */}
                {hasSearch && <div className="mx-10 flex-1">
                    <SearchInput />
                </div>}

                {/* правая часть */}
                <div className="flex items-center gap-3">

                    {/* вызвать компонент кнопки регистрации. передаёт значения для поля open(openAuthModal) и onClose(setOpenAuthModal(false)) */}
                    <AuthModal open={openAuthModal} onClose={() => setOpenAuthModal(false)} />

                    {/* Кнопка - ссылка на профиль. при нажатии переводит значение openAuthModal в true(открывает модальное окно) */}
                    <ProfileButton onClickSignIn={() => setOpenAuthModal(true)} />

                    {/* Кнопка - ссылка на корзину. отображается только если параметр hasCart = true */}
                    {hasCart && <CartButton />}
                    
                </div>
            </Container>
        </header>
    )
}

// export default header
