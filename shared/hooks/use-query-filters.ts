//реализация взаимодействия фильтров и строки запроса браузера
//Формируется строка запроса на основе значений переданных из useFilters 

import { useEffect, useRef } from "react"
import { Filters } from "./use-filters"//импортируем интерфейс Filters из ./use-filters
import QueryString from "qs"
import { useRouter } from "next/navigation"

//Хук отвечает за взаимодействие с строкой запроса
export const useQueryFilters = (filters: Filters) => { //получим из компонента Filters параметры filters с интерфейсом Filters из ./use-filters

    //переменная для контроля - был-ли элемент смонтирован раннее
    const isMounted = useRef(false)//по умолчанию/при первом рендеринге false (не смонтирован)

    const router = useRouter()


    useEffect(() => {

        //запустим код только если компонент смонтирован раннее
        if (isMounted.current) {
            //создаётся значения параметров для формирования строки запроса из сохранённых при выборе значений(Цена, размеры, типы теста, ингредиентов)
            const params = {
                ...filters.selectedPrices,
                productTypes: Array.from(filters.selectedProductTypes),
                sizes: Array.from(filters.selectedSizes),
                ingredients: Array.from(filters.selectedIngredients)
            }
            // console.log({ filters });
            const queryString = QueryString.stringify(params, { arrayFormat: 'comma' }) //перевести массив в строку запроса(браузера)
            //{arrayFormat: 'comma'} - отсекает наименование значения и оставляет только их значения                     

            router.push(`?${queryString}`, {
                scroll: false,
            })//передаём строку запроса в роутер(строка браузера)

            console.log(filters, 999);            
        }

        isMounted.current = true //но значение true будет только в конце

    }, [filters])//useeffect срабатывает при изменении фильтров

}