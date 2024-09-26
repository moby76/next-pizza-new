//Схема Формы заказа для валидации в zodResolver

import { Type } from "lucide-react"
import { z } from "zod"

export const checkoutFormSchema = z.object({
    //обязательные поля
    firstName: z.string().min(2, { message: 'Имя должно содержать не менее 2-х символов' }),
    lastName: z.string().min(2, { message: 'Фамилия должна содержать не менее 2-х символов' }),
    email: z.string().email({ message: 'Введите корректный e-mail' }),
    phone: z.string().min(10, { message: 'Введите корректный номер телефона' }),
    address: z.string().min(5, { message: 'Введите корректный адрес' }),
    //опциональное поле
    comment: z.string().optional(),
})

//тип для валидации на основе полей схемы zod. создаётся методом infer
export type CheckoutFormSchemaValues = z.infer<typeof checkoutFormSchema>