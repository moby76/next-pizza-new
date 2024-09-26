//метод для получения всех ингредиентов

import { Ingredient } from "@prisma/client"
import { axiosInstance } from "./axios-instance"
import { ApiRoutes } from "./constants"

export const getAll = async (): Promise<Ingredient[]> => {
  //с помощью axios делаем запрос на сервер

  //получим данные (data) вызвав axiosInstance(/api) и поллучить список продуктов из ApiRoutes.SEARCH_PRODUCTS (products/search)
  const { data } = await axiosInstance.get<Ingredient[]>(
    ApiRoutes.INGREDIENTS
  )
  return data
}
