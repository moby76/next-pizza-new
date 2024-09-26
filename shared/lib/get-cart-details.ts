//Функция получает информацию о самой корзине и возвращает их в необходимом формате
//используется в store -> cart.ts

// import { CartStateItem } from "../store";
import { CartDTO } from "../services/dto/cart.dto";
import { calcCartItemTotalPrice } from "./calc-cart-item-total-price";

//уплощённый тип для вариантов-из-продуктов в корзине
export type CartStateItem = {
  id: number;
  quantity: number;
  name: string;
  imageUrl: string;
  price: number;
  disabled?: boolean;//тип для отработки признака отключения элемента(например при удалении из корзины)
  pizzaSize?: number | null;
  pizzaType?: number | null;
  ingredients: Array<{ name: string; price: number }>;//интерфейс для ингредиентов. только название и цена ингредиента
};

//общий интерфейс для корзины
interface ReturnProps {
  items: CartStateItem[]//массив вариантов-из-продуктов в корзине
  totalAmount: number | null;
}

export const getCartDetails = (data: CartDTO): ReturnProps => {
  //создать более упрощённый items включив в него только часть из всех полученных данных из cartItems[]
  const items = data.cartItems.map((item) => ({
    id: item.id,
    quantity: item.quantity,//
    name: item.productItem.product.name,//вычленить имя продукта и присвоить его варианту
    imageUrl: item.productItem.product.imageUrl,
    price: calcCartItemTotalPrice(item),//общая стоимость варианта. Передать в функцию calcCartItemTotalPrice сам продукт item
    // price: item.productItem.product.price,
    pizzaSize: item.productItem.size,//значения для распознования как Пицца
    pizzaType: item.productItem.productType,
    disabled: false,//признак отключения элемента
    ingredients: item.Ingredient_CartItem.map((ingredient) => ({
      name: ingredient.Ingredient?.name,
      price: ingredient.Ingredient?.price
    })),
  })) as CartStateItem[];

  return {
    items,
    totalAmount: data.totalAmount,
  };
};
