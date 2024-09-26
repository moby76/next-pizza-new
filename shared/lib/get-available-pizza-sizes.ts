//Реализация  Матрицы для формирования вариантов пицц

import { ProductItem } from "@prisma/client"
import { pizzaSizes, PizzaType } from "../constants/pizza"
import { Variant } from "../components/shared/group-variants"

export const getAvailablePizzaSizes = (  items: ProductItem[], type: PizzaType): Variant[] => {

    //создать исключения для вывода размеров в зависимости от типа теста: если для выбранного типа теста данной пиццы нет какого-то размера, то этот вариант отображаться не будет
    //STEP-1 - оставить только те типы теста которые выбрали. создаётся массив из элементов на основании одинаковых типов теста (var-1: size:30, type:2 | var-2: size:40, type:2 | var-3: size:40, type:2 )
    const filteredPizzasByType = items.filter((item) => item.productType === type)
    
    //STEP-2 - На основании этих полученных данных сформируем список вариантов в котором будет значение disabled для каждого варианта размера. и при условии оно будет true/false
    return pizzaSizes.map((item) => ({//STEP-2.1 проверяем массив pizzaSizes(все размеры)
        name: item.name,
        value: item.value,
        //STEP-2.2 - значение disabled будет в false если размер любого(some) значения размера элемента массива availablePizzas совпадает со значением value элемента массива pizzaSizes
        //иначе disabled для данного варианта будет в true
        disabled: !filteredPizzasByType.some((pizza) => pizza.size === Number(item.value)) //значение "отключено" если нет такого варианта
    }))
}