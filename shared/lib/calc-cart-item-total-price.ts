//Функция для вычисления общей стоимости позиции в корзине в зависимости от количества

// import { Product_Ingredients } from '@/@types/prisma';
import { CartItemDTO } from '../services/dto/cart.dto';


export const calcCartItemTotalPrice = (item: CartItemDTO): number => {

    //Метод reduce() применяет функцию reducer к каждому элементу массива (слева-направо), возвращая одно результирующее значение.
    
    //общая стоимость массива ингредиентов
    const ingredientsPrice = item.CartItem_Ingredient.reduce((acc, ingredient) => acc + (ingredient.Ingredient?.price ?? 0), 0);

    // цена варианта продукта
    const productItemPrice = item.productItem?.price ?? 0;

    // сумма ингредиентов + цена варианта * на количество
    return (ingredientsPrice + productItemPrice) * (item.quantity ?? 0)

};
