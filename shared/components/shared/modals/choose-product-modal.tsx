//компонент модального окна. формирует модальное окно для отображения свойств продукта. 
//Запрашивается из перехватчика/слота @modal/(.)product/id

'use client'

import { Dialog } from '@/shared/components/ui'
import { DialogContent, DialogDescription, DialogTitle } from '@/shared/components/ui/dialog'
import React from 'react'
//import { Prisma, Product, ProductIngredient, ProductItem, Ingredient } from '@prisma/client' //типизацию для продуктов из схемы клиента призмы
import { cn } from '@/shared/lib/utils'
import { useRouter } from 'next/navigation'
import { ChooseProductForm } from '../choose-product-form'
import { ProductWithRelations } from '@/@types/prisma'
import { ChoosePizzaForm } from '../choose-pizza-form'
import { useCartStore } from '@/shared/store'
import toast from 'react-hot-toast'
import { ProductForm } from '../product-form'


interface ChooseProductModalProps {
    // product: Product //значение интерфейса для поля product = схема из клиента призмы. Через неё-же можно и получать данные из БД
    product: ProductWithRelations //расширенный продукт с ингредиентами = пицца. Значения для него приходят из слота @modal/(.)product/id
    className?: string
}

//получаем пропсы product из слота @modal/(.)product/id
export const ChooseProductModal = ({ product, className }: ChooseProductModalProps) => {

    const router = useRouter()

    return (
        //окно открывается только при условии что параметр product не равен 0 . При закрытии(onOpenChange) переводит router на предыдущую страницу(router.back)
        <Dialog open={Boolean(product)} onOpenChange={() => router.back()}  >

            
            {/* содержимое модального окна */}
            <DialogContent className={cn(
                'p-0 w-[1060px] max-w-[1060px] min-h-[500px] bg-white overflow-hidden',
                className,
            )}>
                <DialogTitle />
                <DialogDescription />
                {/* При выполнении условия isPizzaForm = true */}
                <ProductForm product={product} onSubmit={() => router.back()} />
            </DialogContent>
        </Dialog>
    )
}