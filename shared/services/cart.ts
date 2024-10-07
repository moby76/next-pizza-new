//получаем данные с эндпоинта api/cart
import { axiosInstance } from './axios-instance';
import { CartDTO, CreateCartItemValues } from './dto/cart.dto';


//получение всех корзин с эндпоинта api/cart. Простое получение методом GET 
export const getCart = async (): Promise<CartDTO> => {//CartResponse - это ответ от сервера
  return (await axiosInstance.get<CartDTO>('/cart')).data//получение данных с эндпоинта /cart в соответствии с интерфейсом CartDTO
};

//запрос на патч элемента определённой корзины с эндпоинта api/cart/[id] по id корзины с передачей в количества для элементов корзины
export const updateItemQuantity = async (itemId: number, quantity: number): Promise<CartDTO> => {
  return (await axiosInstance.patch<CartDTO>('/cart/' + itemId, { quantity })).data;
};

//запрос на удаление элемента определённой корзины с эндпоинта api/cart/[id] по id корзины
export const removeCartItem = async (itemId: number): Promise<CartDTO> => {
  return (await axiosInstance.delete<CartDTO>('/cart/' + itemId)).data;
};

//Запрос на добавление элемента в корзину
export const addCartItem = async (values: CreateCartItemValues): Promise<CartDTO> => {
    return (await axiosInstance.post<CartDTO>('/cart/', values)).data
}
