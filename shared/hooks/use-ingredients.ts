
//Хук(middleware) для полученя, хранения в useSet ингредиентов в блоке фильтров (левая панель)
//useSet - Перехватчик состояния React, который отслеживает Set.
//Объект Set (javascript) позволяет хранить уникальные значения любого типа, будь то примитивные значения или ссылки на объекты.
//Хук useSet полезен для управления и манипулирования структурой данных Set внутри компонента React. Он предоставляет возможность создавать и поддерживать набор значений, предлагая дополнительную функциональность с помощью пользовательских методов, таких как «добавление», «очистка» и «удаление». Используя этот хук, разработчики могут легко обновлять и отслеживать изменения в наборе, запуская повторную визуализацию компонента при каждом изменении

import { Api } from "@/shared/services/api-client"
import { Ingredient } from "@prisma/client"
import { useEffect, useState } from "react"

export const useIngredients = () => {

    const [ingredients, setIngredients] = useState<Ingredient[]>([])//состояние для ингредиентов

    const [loading, setLoading] = useState(true)//состояние для загрузки

    useEffect(() => {
        async function fetchIngredients() {
            try {
                setLoading(true)//во время запроса переводить в значение true
                const getAllIngredients = await Api.ingredients.getAll() //получим все ингредиенты
                setIngredients(getAllIngredients) //присвоить значение полученных ингредиентов
            } catch (error) {
                console.log("error", error)
            } finally {
                setLoading(false)//при завершении запроса переводить в значение false
            }
        }
        fetchIngredients() //запустить
    }, [])

    return { ingredients, loading  } //вернуть ингредиенты и loading

} 