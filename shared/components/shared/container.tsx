// данный универсальный контейнер будет использован в других компонентах приложения в виде обёртки содержимого компонента

import { cn } from '@/shared/lib/utils'
import React from 'react'

interface containerProps {
    className?: string,
    children: React.ReactNode
}

export const Container = ({ className, children }: containerProps) => {//className - значение которое будет передаваться из компонента где используется этот контейнер 
                                                                       //и будет добавляться к значению 'mx-auto max-w-[1280px]' путём сшивания функцией cn
    return <div className={cn('mx-auto max-w-[1280px]', className)}> 
        {children}
    </div>
}

