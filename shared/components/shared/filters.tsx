//Компонент фильтрации товаров на главной странице

'use client'

import { Title } from './title'
import { Input } from '../ui'
import { RangeSlider } from './range-slider'
import { CheckBoxFiltersGroup } from './checkbox-filters-group'
import { useQueryFilters, useFilters, useIngredients } from '@/shared/hooks'

interface FiltersProps {
    className?: string
}

export const Filters = ({ className }: FiltersProps) => {

    const { ingredients, loading } = useIngredients()//получим из хука ингредиентов

    const filters = useFilters()//получим из хука фильтры
    useQueryFilters(filters)//и передать filters в хук useQueryFilters в качестве параметров для формирования строки запроса.

    //переменная/объект items на основе полученных данных с присвоением ему полей-значений value и text
    const items = ingredients.map((item) => ({ value: String(item.id), text: item.name })) //передаётся в компонент CheckBoxFiltersGroup

    const updatePrices = (prices: number[]) => {
        // console.log(prices, 999);
        filters.updatePrice('priceFrom', prices[0]);
        filters.updatePrice('priceTo', prices[1]);
    }

    return (
        <div className={className}>
            <Title text="Фильтрация" size="sm" className="mb-5 font-bold" />

            {/* группа чекбоксов для выбора типа теста(в БД(и в directus) это тип продукта productType) */}
           
                <CheckBoxFiltersGroup
                    title='Тип теста'//передаём Заголовок группы
                    name='sizes'//это название передаётся в компонент CheckBoxFiltersGroup для дополнительного обозначения элемента htmlFor 
                    className='mb-5'//передаём доп. классы
                    // limit={6}//ограничим список 6 элементов
                    // defaultItems={items.slice(0, 6)}
                    onClickCheckbox={filters.toggleproductTypes}//передаём значение чекбокса toggleproductTypes в функцию onClickCheckbox 
                    selected={filters.selectedProductTypes}//значение выбранных чекбоксов - типов теста
                    items={[
                        { text: 'Толстое', value: '1' },
                        { text: 'Тонкое', value: '2' }
                    ]}//передаются значения value(id в БД) и text(name в БД) из списка ингредиентов
                // loading={loading}//передаём состояние загрузки

                />
            


            {/* группа чекбоксов для выбора размеров */}
            <CheckBoxFiltersGroup
                title='Размеры'//передаём Заголовок группы
                name='sizes'//это название передаётся в компонент CheckBoxFiltersGroup для дополнительного обозначения элемента htmlFor 
                className='mb-5'//передаём доп. классы
                // limit={6}//ограничим список 6 элементов
                // defaultItems={items.slice(0, 6)}
                onClickCheckbox={filters.toggleSizes}//передаём значение чекбокса toggleSizes в функцию onClickCheckbox
                selected={filters.selectedSizes}//список выбранных чекбоксов - размеров
                items={[
                    { text: '20см', value: '20' },
                    { text: '30см', value: '30' },
                    { text: '40см', value: '40' }
                ]}//передаются значения value(id в БД) и text(name в БД) из списка ингредиентов
            // loading={loading}//передаём состояние загрузки

            />


            {/* Фильтрация по цене */}
            <div className='mt-5 border-y border-y-neutral-100 py-6 pb-7'>
                <p className="font-bold mb-3">Цена от и до:</p>
                <div className='flex gap-3 mb-5'>
                    <Input
                        type="number"
                        placeholder="0"
                        min={0}
                        max={1000}
                        // defaultValue={0}
                        value={String(filters.selectedPrices.priceFrom)}//значение цены в виде строки
                        onChange={(e) => filters.updatePrice('priceFrom', Number(e.target.value))}//передаём значение цены в функцию updatePrice
                    />
                    <Input
                        type="number"
                        min={100}
                        max={1000}
                        // defaultValue={500}
                        placeholder="1000"
                        value={String(filters.selectedPrices.priceTo)}//значение цены в виде строки
                        onChange={(e) => filters.updatePrice('priceTo', Number(e.target.value))}//передаём значение цены в функцию updatePrice
                    />
                </div>
                <RangeSlider
                    min={0}
                    max={1000}
                    step={10}
                    value={[
                        filters.selectedPrices.priceFrom || 0,
                        filters.selectedPrices.priceTo || 1000
                    ]}
                    onValueChange={updatePrices}//передаём значения цены в функцию setPrice
                // value={[filters.prices.priceFrom || 0, filters.prices.priceTo || 1000]}
                // onValueChange={updatePrices}
                />
            </div>

            {/* группа чекбоксов ингредиентов*/}
            <CheckBoxFiltersGroup
                title='Ингредиенты'//передаём Заголовок группы
                name='ingredients'//это название передаётся в компонент CheckBoxFiltersGroup для дополнительного обозначения элемента htmlFor 
                className='mt-5'//передаём доп. классы
                limit={6}//ограничим список 6 элементов
                defaultItems={items.slice(0, 6)}
                items={items}//передаются значения value(id в БД) и text(name в БД) из списка ингредиентов
                loading={loading}//передаём состояние загрузки
                onClickCheckbox={filters.toggleIngredients}//передаём значение чекбокса toggleIngredients в функцию onClickCheckbox
                selected={filters.selectedIngredients}//значение выбранных чекбоксов - ингредиентов
            />

        </div>
    )
}