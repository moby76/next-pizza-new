//ФУНКЦИЯ формирует детали для отображения варианта-ПИЦЦЫ вкорзине
//рендерятся в компоненте CartDrawerItem

import { mapPizzaSize, mapPizzaType, PizzaSize, PizzaType } from '@/shared/constants/pizza';
import { CartStateItem } from './get-cart-details'//импортируем тип-абстракцию по которому 


export const getCartItemDetails = (
    ingredients: CartStateItem['ingredients'],//получим только поле ingredients(name, price) из Типа CartStateItem
    pizzaType?: PizzaType,
    pizzaSize?: PizzaSize, 

): string => {//NOTE - в виде строки!

    const details = [];

    //если присутствует параметры pizzaSize и type, то это пицца и в НАЧАЛО массива details[] добавляем объект {тип и размер пиццы}
    if (pizzaSize && pizzaType) {
        //берём из массива mapPizzaType объект с нужным типом и размером
        const typeName = mapPizzaType[pizzaType]
        details.push(`${typeName} | ${pizzaSize} см`)
    }

    //если есть ингредиенты, то добавляем их ИМЕНА в массив details(к уже существующим в нём)
    if (ingredients) {
        details.push(...ingredients.map((ingredient) => ingredient.name))
    }


    return details.join(', ')//вернуть разделив запятой(как массив из названий ингредиентов)
};
