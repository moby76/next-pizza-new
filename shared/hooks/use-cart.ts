//хук получает и возвращает данные из глобального хранилища по корзине
//используется в компоненте cartDrawer и в странице CheckoutPage

import { useEffect } from "react"
import { useCartStore } from "../store"
import { CartStateItem } from "../lib/get-cart-details";
import { CreateCartItemValues } from "../services/dto/cart.dto";

type ReturnProps = {//пропсы для возвратных значений. Тип, а не интерфейс.
    totalAmount: number | null;
    items: CartStateItem[];
    loading: boolean;
    updateItemQuantity: (id: number, quantity: number) => void;
    removeCartItem: (id: number) => void;
    addCartItem: (values: CreateCartItemValues) => void;
    // fetchCartItems: () => void;
};

export const useCart = (): ReturnProps => {

    //получить все стейты из хранилища(хука) useCartStore
    const cartState = useCartStore((state) => state)

    //Используем хук useEffect для получения данных по корзине через хук useCartStore(fetchCartItems)
    useEffect(() => {
        //вытащить функцию fetchCartItems из хука useCartStore
        cartState.fetchCartItems()
    }, [])

    //вернём всё из useCartStore
    return cartState 
}