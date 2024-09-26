//Серверные действия(Server Actions). Все server actions должны быть в ОДНОМ файле. Это должны быть асинхронные функции
//позволяет отправлять данные в обход API, напрямую в БД
//NOTE - серверными действиями нельзя возвращать данные, как это делали через API + services

'use server'

import { prisma } from "@/prisma/prisma-client";
import { PayOrderTemplate, VerificationUserTemplate } from "@/shared/components";
import { CheckoutFormSchemaValues } from "@/shared/constants";
import { createPayment, sendEmail } from "@/shared/lib";
import { getUserSession } from "@/shared/lib/get-user-session";
import { OrderStatus, Prisma } from "@prisma/client";
import { hashSync } from "bcrypt";
import { cookies } from "next/headers";

// * server action на создание заказа * //
export async function createOrder(data: CheckoutFormSchemaValues) {//данные согласно типизации CheckoutFormSchemaValues
    // console.log('data', data);

    try {
        // * сначала получить значение токен корзины из cookies функцией cookies() для server actions
        //NOTE - server actions не имеют доступа к request/response, но для получения заголовков можно использовать пакет next/headers и извлекать из него cookies
        const cookieStore = cookies()
        const cartToken = cookieStore.get('cartToken')?.value

        if (!cartToken) {
            throw new Error('Токен корзины не найден')
        }

        // ** если cookie-токен корзины найден, получить корзину по токену из БД
        const userCart = await prisma.cart.findFirst({
            where: {
                token: cartToken
            },
            include: {
                user: true,
                cartItems: {
                    include: {
                        Ingredient_CartItem: {
                            include: {
                                Ingredient: true
                            }
                        },
                        productItem: {
                            include: {
                                product: true
                            }
                        }
                    }
                }
            }
        })
        //
        if (!userCart) {
            throw new Error('Корзина не найдена')
        }
        //выполнить проверку по сумме
        if (userCart?.totalAmount === 0) {
            throw new Error('Корзина пуста')
        }

        // *** если проверки --^ пройдены, создать новый заказ в БД
        const order = await prisma.order.create({
            data: {
                token: cartToken,
                fullName: `${data.firstName} ${data.lastName}`,//создаётся
                email: data.email,//создаётся
                phone: data.phone,//создаётся
                address: data.address,//создаётся
                comment: data.comment,//создаётся
                totalAmount: userCart.totalAmount,//сумму получаем из корзины. //NOTE - После создания заказа корзина очичается
                status: OrderStatus.PENDING,//первоначальный статус - В Ожидании
                items: JSON.stringify(userCart.cartItems),//получаем из корзины и преобразовав в строчный JSON-объект
            }
        })

        // **** после создания заказа нужно очистить корзину. //ATTENTION - очистить, но не удалить! через update
        await prisma.cart.update({
            where: {
                // token: cartToken,
                id: userCart.id//нужно указать id корзины в которой будут произведены обновления
            },
            data: {
                // cartItems: [], //сделать пустым массивом
                totalAmount: 0 //обнулить сумму
            }
        })

        // ***** и удалить товары привязанные к этой корзине
        await prisma.cartItem.deleteMany({
            where: {
                cartId: userCart.id
            }
        })

        // ****** произвести оплату через Юкасса используя функцию createPayment передав в неё детали для формирования оплаты
        const paymentData = await createPayment({
            amount: order.totalAmount ?? 0,
            orderId: order.id,
            description: 'Оплата заказа №' + order.id//это описание будет на странице списка платежей в личном кабинете магазина на yookassa
        })

        //
        if (!paymentData) {
            throw new Error('Оплата не произведена')
        }

        // ******* если paymentData(оплата) был создан, то делаем обновление определённого заказа в БД
        await prisma.order.update({
            where: {
                id: order.id
            },
            data: {//обновляемые данные
                paimentId: paymentData.id,//идентификатор оплаты
            }
        })

        // ******** отправить письмо о создании заказа через функцию sendEmail
        const paymentUrl = paymentData.confirmation.confirmation_url//url после оплаты(для локального это будет http://localhost:3000/?paid)

        await sendEmail(
            data.email,
            'Next-Pizza / Оплатите Заказ No' + order.id,
            PayOrderTemplate({
                orderId: order.id,
                totalAmount: order.totalAmount ?? 0,
                paymentUrl
            })
        )

        // * и вернуть страницу с успешной оплатой
        return paymentUrl

    } catch (error) {
        console.log('[CreateOrderAction] error', error);
    }
}

// * server action для изменения профиля * //
export async function updateUserInfo(body: Prisma.UserUpdateInput) {//данные сопоставить через Prisma type - UserUpdateInput
    try {
        //сначала получить сессию серверную функцию getUserSession(ака getServerSession(authOptions))
        const session = await getUserSession()

        //если пользователь не найден
        if (!session?.user) {
            throw new Error('Пользователь не найден')
        }

        //при получении сессии, найти пользователя из БД по id из сессии
        const findUser = await prisma.user.findFirst({
            where: {
                id: Number(session?.user?.id)
            }
        })

        //и обновить данные пользователя в БД по id из сессии
        await prisma.user.update({
            where: {
                id: Number(session?.user?.id)
            },
            data: {
                fullName: body.fullName,
                email: body.email,
                //если новый пароль переданный из формы профиля, то закодировать его иначе оставить старый
                password: body.password ? hashSync(body.password as string, 10) : findUser?.password
            }
        })
    } catch (error) {
        console.log('Error [UPDATE_USER]', error);
    }
}

// * server action для регистрации профиля * //
export async function registerUser(body: Prisma.UserCreateInput) {//данные сопоставить через Prisma type - UserCreateInput
    try {

        // * сначала найти пользователя по емейлу из данных из формы регистрации(которая вызывает данную функцию)
        const user = await prisma.user.findFirst({
            where: {
                email: body.email,
            },
        });

        // ** после нахождения пользователя
        if (user) {
            if (!user.verifiedDate) {// если найден по почте и НЕ верифицирован
                throw new Error('Почта не подтверждена');
            }
            // если найден по почте и верифицирован 
            throw new Error('Пользователь уже существует');
        }

        // *** если пользователя нет в БД, то создать его
        const createdUser = await prisma.user.create({
            data: {
                fullName: body.fullName,
                email: body.email,
                password: hashSync(body.password, 10),
            },
        });
        
        // **** теперь нужно подтвердить пользователя через почту

        // 1. сгенерировать код подтверждения
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        //передать код подтверждения в БД
        await prisma.verificationCode.create({
            data: {
                code,
                userId: createdUser.id,
                // createdAt: new Date(),
            },
        });

        // 2. отправить письмо с кодом подтверждения функцией sendEmail
        await sendEmail(
            createdUser.email,
            'Next Pizza / 📝 Подтверждение регистрации',//описание письма
            VerificationUserTemplate({//шаблон
                code,//передать код в шаблон
            }),
        );
    } catch (err) {
        console.log('Error [CREATE_USER]', err);
        throw err;
    }
}

