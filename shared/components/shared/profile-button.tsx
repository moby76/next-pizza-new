//Компонент реализует выбор одной из кнопок: "Войти" или "Профиль"

'use client'

import { useSession, signIn } from 'next-auth/react'
import React from 'react'
import { Button } from '../ui/button'
import { CircleUser, User } from 'lucide-react'
import Link from 'next/link'

interface Props {
    onClickSignIn?: () => void //эта функция должна открывать модальное окно
    className?: string
}

export const ProfileButton = ({ className, onClickSignIn }: Props) => {

    const { data: session } = useSession()

    // console.log('session-user', session?.user);

    return (
        <div className='className'>
            {!session //если сессия не создана 
                //то рендерим кнопку "Войти" при нажатии на которую активируем функцию onClickSignIn           
                ? <Button onClick={onClickSignIn} variant='outline' className='flex items-center gap-2'>
                    <User size={18} />
                    Войти
                </Button>
                //иначае(если сессия уже создана) рендерим ссылку на страницу профиля с кнопкой "Профиль" ? 
                : <Link href={'/profile'}>
                    <Button variant='secondary' className='flex items-center gap-2'>
                        <CircleUser size={18} />
                        Профиль
                    </Button>
                </Link>
            }
        </div>
    )
}