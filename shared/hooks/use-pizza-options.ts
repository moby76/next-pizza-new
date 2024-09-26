// реализация  Хука обрабатывающего опции пиццы * //

import { useEffect, useState } from "react"
import { Variant } from "../components/shared/group-variants"
import { PizzaSize, PizzaType } from "../constants/pizza"
import { useSet } from "react-use"
import { getAvailablePizzaSizes } from "../lib"
import { ProductItem } from "@prisma/client"

interface ReturnProps {
    size: PizzaSize
    type: PizzaType
    selectedIngredients: Set<number>
    availableSizes: Variant[]
    currentItemId?: number
    setSizes: (size: PizzaSize) => void
    setTypes: (type: PizzaType) => void
    toggleIngredients: (id: number) => void
}

export const usePizzaOptions = (
    items: ProductItem[]
): ReturnProps => {

    //создать состояния для размеров и типа пиццы
    const [size, setSizes] = useState<PizzaSize>(20)
    const [type, setTypes] = useState<PizzaType>(1)

    // * Матрица для формирования вариантов пицц * //
    const availableSizes = getAvailablePizzaSizes(items, type)

    //Состояние для отслеживания выбранных ингредиентов. Через хук useSet (библиотека react-use) можно управлять состоянием Set.
    const [selectedIngredients, { toggle: toggleIngredients }] = useSet(new Set<number>([]))

    //найти id вариации на основе размера и типа. Каждый вариант(сочетание размера и типа) пиццы имеет свой id. На основании этого id можно определить вариант пиццы в зависимости от размера и типа.
    const currentItemId = items.find((item) => item.productType === type && item.size === size)?.id
    
    //переключение на первый размер доступного выбранного типа теста (type) с возможностью сохранения выбранного размера при переключении на другой тип теста, если этот размер доступен 
    useEffect(() => {

        //найти первый неотключенный размер из списка доступных для данного типа теста размеров и 
        const isAvailableSize = availableSizes?.find((item) => Number(item.value) === size && !item.disabled)

        //получить первый доступный неотключенный размер из полученных доступных для данного типа теста размеров
        const availableTypeSize = availableSizes?.find((item) => !item.disabled)

        //если получаем первый доступный неотключенный размер , задаём его значение для стейта size функцией setSizes
        if (!isAvailableSize && availableTypeSize) {
            setSizes(Number(availableTypeSize.value) as PizzaSize)
        }
    }, [type])

    return {
        size,
        type,
        selectedIngredients,
        availableSizes,
        currentItemId,
        setSizes,
        setTypes,
        toggleIngredients
    }
}