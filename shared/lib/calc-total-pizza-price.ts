//Вычисление стоимости пиццы при выборе в модальном окне pizzaForm: базовая стоимость варианта продукта + стоимость выбранных ингредиентов 

import { Ingredient, ProductItem } from "@prisma/client"
import { PizzaSize, PizzaType } from "../constants/pizza"
// import { productIngredients } from "../components/shared/choose-pizza-form"

/**
 * Функция для подсчета общей стоимости пиццы
 * 
 * @param type - тип теста выбранной пиццы
 * @param size - размер выбранной пиццы
 * @param items - список вариаций
 * @param ingredients - список ингредиентов
 * @param selectedIngredients - выбранные ингредиенты
 * @returns number - общая стоимость
 */

export const calcTotalPizzaPrice = (
    type: PizzaType,
    size: PizzaSize,
    items: ProductItem[],
    // ingredients: Ingredient[],
    ingredients: any[],
    selectedIngredients: Set<number>
) => {

    //Сформировать цену пиццы на основании типа теста и размера пиццы
    const pizzaPrice = items.find((item) => item.productType === type && item.size === size)?.price ?? 0

    //Стоимость всех выбранных ингредиентов выполняется только при условии изх наличия 'ingredient.Ingredient &&'
    const totalIngredientsPrice = ingredients
        .filter((ingredient) => ingredient.Ingredient?.id && selectedIngredients.has(ingredient.Ingredient?.id))
        .reduce((acc, ingredient) => acc + ingredient.Ingredient.price, 0)

    return pizzaPrice + totalIngredientsPrice

}