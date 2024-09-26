//Асинхронная функция получающая сессию из cookies пользователя.
//Создана для создания АСИНХРОННОГО запроса. Так-как в клиентском компоненте нельзя использовать асинхронные функции


import { getServerSession } from 'next-auth';
import { authOptions } from '../constants/auth-options';

export const getUserSession = async () => {
    const session = await getServerSession(authOptions)

    //вернёт пользователя сессии или null
    return session ?? null
}