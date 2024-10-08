//в этот API-endpoint будут попадать сведения о статусе оплаты нашего заказа с сервиса yookassa
//данный адрес прописываем в сервисе yookassa в разделе "интеграция" -> HTTP-уведомления - > поле URL для уведомлений
//этот эндпоинт не используется для получения/передачи данных внутри приложения. Его исполльзует только сервис yookassa 
//NOTE - Для доступа к локальному хосту используется "туннельный" путь через сервис localtunnel (npm install -g localtunnel) и будет иметь адрес типа https://giant-parrots-battle.loca.lt/api/checkout/callback
//здесь мы должны ожидать запрос

import { PaymentCallbackData } from "@/@types/yookassa";
import { prisma } from "@/prisma/prisma-client";
import { PayOrderSuccessTemplate } from "@/shared/components/shared/email-templates/pay-order-cuccess";
import { sendEmail } from "@/shared/lib";
import { CartItemDTO } from "@/shared/services/dto/cart.dto";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
// import { OrderStatus } from '@prisma/client';

export async function POST(req: NextRequest) {

    try {
        // * получить тело запроса и типизировать его по типу PaymentCallbackData.
        const body = (await req.json()) as PaymentCallbackData

        // ** Найти заказ и обработать/обновить его данные(например, после успешной оплаты поменять статус заказа)
        const order = await prisma.order.findFirst({
            where:{//найти заказ на основе метаданных из функции createPayment. эта информация вернётся нам после успешной оплаты
                id: Number(body.object.metadata.order_id)//в виде Number
            },
            // include: {
            //     user: true//и получить пользователя. Для формирования письма этому пользователю
            // }
        })

        if(!order) {    
            return NextResponse.json({ error: 'Order not found' })      
        }

        // *** обновить этот --^ заказ изменив в нём статус с Pending на Success

        //получить из тела запроса статус из платёжной системы. При успешной оплате значение статуса будет "succeeded" 
        const isSucceeded = body.object.status === 'succeeded'

        await prisma.order.update({
            where: {
                id: order.id
            },
            data: {
                status: {
                    set: isSucceeded ? { id: 2 } : { id: 3}
                }
            } as Prisma.OrderUpdateInput
        })

        // **** получить все элементы из этого заказа
        const items = JSON.parse(order?.items as string) as CartItemDTO[]

        // ***** Отправить письмо
        if(isSucceeded) {
            await sendEmail(
                order.email,
                'Next-Pizza | Ваш заказ №' + order.id + ' успешно оплачен :pizza:',
                PayOrderSuccessTemplate({ orderId: order.id, items })
            )
        } else {
            // Письмо о неуспешной оплате
            // console.log('order not succeeded')
        }
        
    } catch (error) {
        console.log('[Checkout Callback] error', error);
        return NextResponse.json({ error: 'Server error' })
    }

}