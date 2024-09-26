//метод для поиска продуктов

import { Product } from "@prisma/client" //типизация продуктов созданная в prisma/client
import { axiosInstance } from "./axios-instance"
import { ApiRoutes } from "./constants"
import axios from "axios"

export const search = async (query: string): Promise<Product[]> => {
  //с помощью axios делаем запрос на сервер

  //получим данные (data) вызвав axiosInstance(/api) и поллучить список продуктов из ApiRoutes.SEARCH_PRODUCTS (products/search)
  // const { data } = await axios.create({baseURL: process.env.NEXT_PUBLIC_API_URL}).get<Product[]>('products/search', {//укажем путь к запросу и сгенерированную призмой типизацию полей<Product>
  const { data } = await axiosInstance.get<Product[]>( ApiRoutes.SEARCH_PRODUCTS,//укажем путь к запросу и сгенерированную призмой типизацию полей<Product>
    {      
      params: {//и объявим что используем параметры из строки браузера ?qwery=...      
        query,
      },
    }
  )
  return data
}
