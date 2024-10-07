//интерфейс расширяющий информацию о корзине

import { ingredients } from "@/prisma/constants";
import { Cart, CartItem, Ingredient, CartItem_Ingredient, Prisma, Product, Product_Ingredient, ProductItem } from "@prisma/client";

type IngredientsInCartitem = Prisma.CartItem_IngredientGetPayload<{
	include: {
		Ingredient: true
	}
}>

// тип для items
export type CartItemDTO = CartItem & {//вернёт тип CartItem из Prisma
	productItem: ProductItem & {//включая в себя тип ProductItem с продуктами
		product: Product
	}
	// ingredients: IngredientsInCartitem[]
	CartItem_Ingredient: IngredientsInCartitem[]
	totalAmount: number
};

//для столбца cartItems назначим расширенный интерфейс CartItem[] -> CartItemDTO[] --^ и назовём его CartDTO
export interface CartDTO extends Cart {
	cartItems: CartItemDTO[]
}

//эти поля передаются от браузера на сервер
export interface CreateCartItemValues {
	productItemId: number
	ingredients?: number[]
	// ingredients?: number[]
	// IngredientsInCartitems?: number[]
	// quantity: number
}