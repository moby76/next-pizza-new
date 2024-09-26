//Хук отвечающий за хранение состояния фильтров

import { useSearchParams } from "next/navigation"
import { useSet } from "react-use"
import { useMemo, useState } from "react"

interface PriceProps {// свойства для цен
    priceFrom?: number
    priceTo?: number
}

interface QueryFilters extends PriceProps {//Типизация интерфейса для запросов передаваемых в фильтры. Расширенный PriceProps

    productTypes: string
    sizes: string
    ingredients: string
}

export interface Filters {// Типизация для сохранённых значений фильтров 
    //В TypeScript Set — это новая структура данных, представленная в ES6, похожая на Map, которая позволяет нам хранить отдельные значения. Он похож на массив или список, но с тем отличием, что не допускает дублирования значений.
    //Чтобы создать Set в TypeScript, мы можем просто использовать конструктор Set:
    selectedSizes: Set<string>
    selectedProductTypes: Set<string>
    selectedIngredients: Set<string>
    selectedPrices: PriceProps//и включим внего интерфейс для цен PriceProps
}

interface ReturnProps extends Filters {
    updatePrice: (name: keyof PriceProps, value: number) => void //
    toggleproductTypes: (value: string) => void
    toggleSizes: (value: string) => void
    toggleIngredients: (value: string) => void
}

export const useFilters = (): ReturnProps => {
    
    //применяем useSearchParams для получения параметров из строки запроса
    const searchParams = useSearchParams() as unknown as Map<keyof QueryFilters, string>
     
    /* Фильтр ингредиентов */
    //используем хук useSet для хранения состояния выбранных ингредиентов 
    //Чтобы создать Set в TypeScript, мы можем просто использовать конструктор Set:
    //параметром для useSet в хуке useFilterIngredients передаем массив значений id из строки запроса браузера после ?ingredients=1,2,3,5,7,... или пустой массив
    //используем метод toggle, который добавляет или убирает при повторном нажатии переданные в массив selectedIngredients значкения на полученное из Set-а созданного хуком useSet на основании значений из строки запроса, если в строке запроса (searchParams) нет параметра указанного в скобках, то возвращаем пустой массив
    const [selectedIngredients, { toggle: toggleIngredients }] = useSet(new Set<string>(searchParams.has('ingredients') ? searchParams.get('ingredients')?.split(',') : []));
        
    /* Фильтр Размеров */
    //используем хук useSet для хранения состояния выбранных размеров
    const [selectedSizes, { toggle: toggleSizes }] = useSet(new Set<string>(searchParams.has('sizes') ? searchParams.get('sizes')?.split(',') : [])) // параметром для useSet передаем массив id размеров из строки запроса браузера после ?sizes=1,2,3,5,7,... или пустой массив

    /* Фильтр типов продуктов */
    //используем хук useSet для хранения состояния выбранных типов продукции. Если в строке запроса уже есть параметр sizes, то добавляем его в состояние productTypes отделив его запятыми
    const [selectedProductTypes, { toggle: toggleproductTypes }] = useSet(new Set<string>(searchParams.has('productTypes') ? searchParams.get('productTypes')?.split(',') : [])) // параметром для useSet передаем массив id типов из строки запроса браузера после ?productTypes=1,2,3,5,7,... или пустой массив

    /* Фильтр стоимостей */
    //создать состояние для цен(от-до) при первоначальной загрузки страницы.Для этого используем useState
    const [selectedPrices, setSelectedPrices] = useState<PriceProps>({
        priceFrom: Number(searchParams.get('priceFrom')) || undefined,//при перезагрузке страницы начальная цена будет получена из сохранённых параметров поисковой строки 
        priceTo: Number(searchParams.get('priceTo')) || undefined,//при перезагрузке страницы конечная цена будет получена из сохранённых параметров поисковой строки
    })

    //фунуция для передачи значения цены из слайдера в инпуты и наоборот
    const updatePrice = (name: keyof PriceProps, value: number) => {//значение для name - priceFrom или priceTo(получаем его из PriceProps), а для value - пере
        setSelectedPrices((prev) => ({ ...prev, [name]: value }))//меняет предыдущее значение selectedPrices на новое с присвоением через setSelectedPrices
    }

    //ATTENTION - Не до конца понял этот момент:
    return useMemo(() => ({//использовать React хук useMemo для предотвращения перерисвки выбранных значений //NOTE - если не применить useMemo, а просто возвращать через return --^ , то при попытке закрыть окно выбора варианта продукта и при отмеченных фильтрах, оно не закроется
        selectedSizes,
        selectedProductTypes,
        selectedIngredients,
        selectedPrices,

        updatePrice,
        toggleproductTypes,
        toggleSizes,
        toggleIngredients,
    }), [ selectedSizes, selectedPrices,  selectedProductTypes, selectedIngredients ])//кэш пересоздаётся только при изменении значений в [ selectedSizes, ... , ... , ... ]

}
