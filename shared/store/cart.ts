//временное хранение данных корзины

import { create } from "zustand";
import { Api } from "../services/api-client";
import { getCartDetails } from "../lib";//
import { CartStateItem } from "../lib/get-cart-details";
import { CreateCartItemValues } from "../services/dto/cart.dto";

export interface CartState {
    loading: boolean;//инфа о загрузке корзины
    error: boolean;
    totalAmount: number | null//Сумма
    items: CartStateItem[];//список товаров по интерфейсу CartStateItem из функции getCartDetails ( lib/get-cart-details.ts )

    /* Получение товаров из корзины */
    fetchCartItems: () => Promise<void>;

    /* Запрос на обновление количества товара */
    updateItemQuantity: (id: number, quantity: number) => Promise<void>;

    /* Запрос на добавление товара в корзину */
    addCartItem: (values: CreateCartItemValues) => Promise<void>;

    /* Запрос на удаление товара из корзины */
    removeCartItem: (id: number) => Promise<void>;
}


//создаём хранилище/хук
export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    totalAmount: 0,
    loading: false,
    error: false,

    //получим все товары корзины
    fetchCartItems: async () => {
        try {
            set({ loading: true, error: false })//устанавливает загрузку, сообщает что ошибки нету
            const data = await Api.cart.getCart()//делает запрос на получение данных по корзине
            set(getCartDetails(data))//после обработки запроса вернёт информацию о корзине прогнав её через функцию getCartDetails и сохранит в стейт для перерисовки
        } catch (error) {
            console.error(error);
            set({ error: true });
        } finally {
            set({ loading: false });
        }
    },

    //обновление количества элемента корзины
    updateItemQuantity: async (id: number, quantity: number) => {
        try {
            set({ loading: true, error: false });
            const data = await Api.cart.updateItemQuantity(id, quantity);//запрос на обновление количества
            set(getCartDetails(data));
        } catch (error) {
            console.error(error);
            set({ error: true });
        } finally {
            set({ loading: false });
        }
    },

    addCartItem: async (values: CreateCartItemValues) => {//значения values на основе интерфейса CreateCartItemValues(productItemId: number, ingredients?: number[])
        try {
            set({ loading: true, error: false });
            const data = await Api.cart.addCartItem(values);//
            set(getCartDetails(data));
        } catch (error) {
            console.error(error);
            set({ error: true });
        } finally {
            set({ loading: false });
        }
    },


    removeCartItem: async (id: number) => {
        try {
            set(state => ({
                loading: true,
                error: false,
                //при соблюдении условий когда id элемента в хранилище = id удаляемого элемента в корзине, изменить disabled на true //NOTE - Не до конца понятно
                items: state.items.map((item) => (item.id === id ? { ...item, disabled: true } : item))
            }));
            const data = await Api.cart.removeCartItem(id);//запрос на удаление элемента корзины
            set(getCartDetails(data));
        } catch (error) {
            console.error(error);
            set({ error: true });
        } finally {
            set(state => ({
                loading: false,
                items: state.items.map(item => ({ ...item, disabled: false }))//после завершения отработки функции возвращаем состояние disabled в false
            }));
        }
    },


}))