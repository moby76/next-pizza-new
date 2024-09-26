// Содержимое диалогового окна при выборе ПИЦЦЫ

'use client'

import { cn } from '@/shared/lib/utils';
import React from 'react'
import { PizzaImage } from './pizza-image';
import { Title } from './title';
import { Button } from '../ui';
import { GroupVariants } from './group-variants';
import { PizzaSize, PizzaType, pizzaTypes } from '@/shared/constants/pizza';
import { IngredientItem } from './ingredient-item';
import { ProductWithRelations } from '@/@types/prisma';
import { getPizzaDetails } from '@/shared/lib';
import { usePizzaOptions } from '@/shared/hooks';

interface ChoosePizzaFormProps {
    imageUrl: string;
    name: string;
    // items: ProductItem[]
    items: ProductWithRelations['ProductItem']//варианты пицц(мал., сред. и больш. / тонкое тесто и традиционное тесто)
    ingredients: ProductWithRelations['ProductIngredient']//ingredients получаем из типа ProductWithRelations
    loading?: boolean;//получим состояние загрузки из компонента модального окна для дальнейшей передачи его в состояние компонента кнопки < Button />
    onSubmit: (itemId: number, ingredients: number[]) => void;//функция не возвращает ничего. Отрабатывает в родительском компоненте chooseProductModal при нажатии на кнопку "Добавить в корзину". отправляет параметры 1(itemId) и 2(ingredients)  для добавления пиццы. ОБРАТНО в < ChooseProductModal / >? а затем в store?
    className?: string;
    onClickAddCard?: VoidFunction
}


//** Форма выбора ПИЦЦЫ */
export const ChoosePizzaForm = ({
    name,
    items,
    imageUrl,
    // productIngredients,
    ingredients,
    loading,
    onSubmit,
    className,
    onClickAddCard
}: ChoosePizzaFormProps) => {


    // получить данные из хука usePizzaOptions 
    const { size, setSizes, type, setTypes, selectedIngredients, availableSizes, currentItemId, toggleIngredients } = usePizzaOptions(items)

    //получить детали пиццы(цена, заголовок, ингредиенты) из функции getPizzaDetails передав в неё тип, размер, варианты пицц, ингредиенты, выбранные ингредиенты из хука usePizzaOptions
    const { totalPrice, textDetails } = getPizzaDetails(type, size, items, ingredients, selectedIngredients)

    //обработчик кнопки отправки в корзину
    const handleClickAdd = () => {
        //запустить функцию onSubmit для добавления пиццы в корзину передав текущий id(currentItemId) варианта на основе типа и размера + ингредиенты
        if (currentItemId) {//при получении id текущего варианта пиццы
            onSubmit(
                currentItemId, //первый аргумент для onSubmit. это значение передаётся в функцию addCartItem Компонента высшего порядка chooseProductModal в значение productItemId 
                Array.from(selectedIngredients)//массив выбранных ингредиентов. Второй аргумент для onSubmit. это значение передаётся в функцию addCartItem Компонента высшего порядка chooseProductModal в значение ingredients 
            )
        }
    }

    // console.log({items , availablePizzas, availablePizzaSizes});

    return (
        <div className={cn(className, 'flex flex-1')}>

            {/* картинка для отображения продуктов типа ПИЦЦА*/}
            <PizzaImage imageUrl={imageUrl} size={size} />

            {/* блок с описанием */}
            <div className="w-[510px] bg-[#f7f6f5] p-4">
                {/* название */}
                <Title text={name} size='md' className='font-extrabold mb-1' />

                {/* {console.log(ingredients.map((ingredient) => ingredient.Ingredient))} */}

                {/* Детали */}
                <p className='text-gray-800'>{textDetails}</p>

                {/* отображение компонента выбора вариантов и размеров товаров */}
                <div className='flex flex-col gap-1 mt-5'>
                    {/* отобразим кнопки сразмерами */}
                    <GroupVariants items={availableSizes} selectedValue={String(size)} onClick={value => setSizes(Number(value) as PizzaSize)} />
                    {/* отобразим кнопки с типами пицц */}
                    <GroupVariants items={pizzaTypes} selectedValue={String(type)} onClick={value => setTypes(Number(value) as PizzaType)} />
                </div>

                {/* отобразим ингредиенты */}
                <div className='bg-gray-50 rounded-md h-[240px] mt-3 overflow-y-auto overflow-x-hidden scrollbar'>
                    <div className='grid grid-cols-3 gap-3'>
                        {ingredients.map((ingredient) => (
                            <IngredientItem
                                key={ingredient.id}
                                name={ingredient.Ingredient?.name}
                                price={ingredient.Ingredient?.price ?? 0}
                                imageUrl={ingredient.Ingredient?.imageUrl ?? ''}
                                //ATTENTION - обязательно указать такой кортеж и с ! - ingredient.Ingredient!.id
                                active={selectedIngredients.has(ingredient.Ingredient!.id)}//для параметра active передаём логическое true если переменная/массив selectedIngredients содержит id ингредиента  
                                onClick={() => toggleIngredients(ingredient.Ingredient!.id)}//при нажатии на кнопку добавляем/убираем ингредиент в/из массив selectedIngredients
                            />
                            // 'IngredientItem'
                        ))}

                    </div>
                </div>

                {/* кнопка добавления в корзину */}
                <Button
                    loading={loading}
                    onClick={handleClickAdd}//при нажатии добавляем
                    className="h-[55px] px-10 text-base rounded-[18px] w-full mt-10">
                    Добавить в корзину за {totalPrice} ₽
                </Button>
            </div>

        </div>
    )
}