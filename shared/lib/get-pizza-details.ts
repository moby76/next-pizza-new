import { ProductItem } from "@prisma/client";
import { calcTotalPizzaPrice } from "./calc-total-pizza-price";
import { mapPizzaType, PizzaSize, PizzaType } from "../constants/pizza";
// import { productIngredients } from "../components/shared/choose-pizza-form";

export const getPizzaDetails = (
    type: PizzaType,
    size: PizzaSize,
    items: ProductItem[],
    // ingredients: Ingredient[],
    ingredients: any[],
    selectedIngredients: Set<number>
) => {
    
    //цена общая
    const totalPrice = calcTotalPizzaPrice(type, size, items, ingredients, selectedIngredients)

    //информация о размерах и типе теста
    const textDetails = `${size} см, ${mapPizzaType[type]} тесто. Ингредиенты: ${selectedIngredients.size}`

    return { totalPrice, textDetails }
}