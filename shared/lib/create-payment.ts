//функция для создания платежа через сервис - Юkassa

import { PaymentData } from "@/@types/yookassa";
import axios from "axios";

interface Props {
    amount: number
    orderId: number
    description: string
}

export async function createPayment(details: Props) {

    //в рамках этой функции нужно сделать запрос на Юкассу через axios. 
    //ATTENTION - используем сам axios, а не его экземплят(axiosInstance), т.к. в созданном нами экземпляр работает с нашими API
    const { data } = await axios.post<PaymentData>(//NOTE - для сопоставления типов данных(data) используем дженерик <PaymentData> https://www.youtube.com/watch?v=L1ONtRnIxcY&ab_channel=wise.js
        'https://api.yookassa.ru/v3/payments',//доступ к api платежей на Юкассе
        {//указать доп. информацию для формирования запроса и что нам нужно получить 
            amount: {//сумма для оплаты
                value: details.amount,//получим из details
                currency: 'RUB',
            },
            capture: true,
            description: details.description,//описание для элемента оплаты в Юкассе
            metadata: {//данные для отслеживания платежа. По которым будет производиться оплата
                order_id: details.orderId//
            },
            confirmation: {//перенаправление пользователя после успешной оплаты
                type: 'redirect',
                return_url: process.env.YOOKASSA_CALLBACK_URL//
            }
        }, {//вторым параметром указать параметры для авторизации(auth, headers)
        
        auth: {
            username: process.env.YOOKASSA_STORE_ID as string, //id магазина
            password: process.env.YOOKASSA_API_KEY as string//передать ключ авторизации (?)
        },
        headers: {
            'content-type': 'application/json',
            'Idempotence-Key': Math.random().toString(36).substring(7)//<Ключ идемпотентности>. Идемпоте́нтность — свойство объекта или операции при повторном применении операции к объекту давать тот же результат, что и при первом.
        }
    }
    )

    return data
}