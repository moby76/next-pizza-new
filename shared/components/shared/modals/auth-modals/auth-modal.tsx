 'use client'

import { Button, Dialog } from '@/shared/components/ui'
import { DialogContent, DialogDescription, DialogTitle } from '@/shared/components/ui/dialog'
import { signIn } from 'next-auth/react'
import React, { useState } from 'react'
import { LoginForm } from './forms/login-form'
import { RegisterForm } from './forms/register-form'

interface Props {
    open: boolean
    onClose: () => void
    // className?: string
}

export const AuthModal = ({  open, onClose }: Props) => {

    //состояние типа 'login' или 'register'. по умолчанию 'login'
    const [type, setType] = useState<'login' | 'register'>('login')

    //функция для переключения с 'login' на 'register' и наоборот. 
    //если пользователь уже вошёл('login), то установить значение 'register', иначе 'login'
    const onSwitchType = () => {
        setType(type === 'login' ? 'register' : 'login')
    }

    //функция обрабатывающая событие на закрытие модального окна
    const handleClose = () => {
        onClose()// * передаёт функцию onClose(?)
        // ** ещё что-то делает ...
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}  >

            <DialogContent className='w-[450px] bg-white p-10'  >
                <DialogTitle />
                <DialogDescription />
                    {/* если стейт type имеет значение login то отрендерить форму логина иначе вывести форму регистрации */}
                    { type === 'login' ? (<LoginForm onClose={handleClose} />) : (<RegisterForm onClose={handleClose} />) }

                <hr />
                {/* две кнопки для авторизации(через githud и google)  */}
                <div className='flex gap-2'>
                    {/* кнопка авторизации через github */}
                    <Button
                        variant="secondary"
                        onClick={() =>
                            signIn('github', {//будет делать запрос на github
                                callbackUrl: '/',
                                redirect: true,
                            })
                        }
                        type="button"
                        className="gap-2 h-12 p-2 flex-1">
                        <img className="w-6 h-6" src="https://github.githubassets.com/favicons/favicon.svg" />
                        GitHub
                    </Button>
                    
                    {/* кнопка авторизации через google */}
                    <Button
                        variant="secondary"
                        onClick={() =>
                            signIn('google', {//будет делать запрос на google
                                callbackUrl: '/',
                                redirect: true,
                            })
                        }
                        type="button"
                        className="gap-2 h-12 p-2 flex-1">
                        <img
                            className="w-6 h-6"
                            src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
                        />
                        Google
                    </Button>
                </div>
            
                <Button variant="outline" onClick={onSwitchType} type="button" className='h-12' > 
                {type !== 'login' ? 'Войти' : 'Регистрация'}
                </Button>
            </DialogContent>

        </Dialog>
    )
}