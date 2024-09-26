//схема для валидации формы авторизации и регистрации. Через библиотеку zod
import { z } from 'zod'

//отдельная схема для пароля
export const passwordSchema = z.string().min(4, { message: 'Пароль должен быть больше 4 символов' })

//схема валидации формы авторизации
export const formLoginSchema = z.object({
    email: z.string().email({ message: 'Неверный формат почты' }),
    password: passwordSchema
})

//схема валидации формы регистрации. Сделать её расширив/дополнив схему formLoginSchema. Методом слияния(merge)
export const formRegisterSchema = formLoginSchema
    .merge(
        z.object({
            fullName: z.string().min(3, { message: 'Введите имя и фамилию' }),
            confirmPassword: passwordSchema//значение confirmPassword этой схемы будет равно значению password схемы formLoginSchema
        })
    )
    .refine((data) => data.password === data.confirmPassword, {//методом refine проверяет соответствие паролей. data - это данные из нашей формы
        message: 'Пароли не совпадают',
        path: ['confirmPassword']//на основе чего проверяется соответствие паролей
    })

//создать тип TS для валидации формы где будет применяться эта --^ схема. c помощью метода zod.infer 
export type FormLoginSchemaValues = z.infer<typeof formLoginSchema>
export type FormRegisterSchemaValues = z.infer<typeof formRegisterSchema>

