//функция реализующая фильтрацию данных по продуктам из призмы согласно параметрам из строки браузера

import { prisma } from "@/prisma/prisma-client";

export interface GetSearchParams {//интерфейс для поисковых параметров из браузерной строки для фильтрации
    query?: string//параметр для запроса из браузерной строки
    sortBy?: string;
    sizes?: string;//параметр для фильтрации по размеру
    productTypes?: string;//параметр для фильтрации по типу
    ingredients?: string;//параметр для фильтрации по ингредиентам
    priceFrom?: string;
    priceTo?: string;

    limit?: string
    page?: string
}

//значения по умолчанию в случае если параметр не передан
const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 1000;

export const findPizzas = async (params: GetSearchParams) => {//
    //превратить ЗНАЧЕНИЯ параметров из браузерной строки в массив числовых значений разделённых запятой: например sizes=20%2C30%2C40 в [20,30,40]
    const sizes = params.sizes?.split(',').map(Number);//для фильтрации по размеру
    const pizzaTypes = params.productTypes?.split(',').map(Number);//для фильтрации по типу
    const ingredientsIdArr = params.ingredients?.split(',').map(Number);//для фильтрации по ингредиентам

    //задать значения для минимальной и максимальной цены. Конвертировать в число Number
    const minPrice = Number(params.priceFrom) || DEFAULT_MIN_PRICE;//если не передано, то присваивается значение по умолчанию DEFAULT_MIN_PRICE
    const maxPrice = Number(params.priceTo) || DEFAULT_MAX_PRICE;

    const categories = await prisma.category.findMany({
        include: {
            Product: {
                orderBy: {//отсортировать продукцию по id
                    id: 'desc',//gпо уменьшению
                },
                // * сортировка * //
                where: {
                    // сортировка по ингредиентам на основе значений массива ingredientsIdArr
                    ProductIngredient: ingredientsIdArr //если есть массив ingredientsIdArr ТО:
                        ? {//отфильтровать
                            some: { // найти какие-то соответствия
                                ingredientId: {// id ингредиента в таблице ProductIngredient
                                    in: ingredientsIdArr // данным из массива ingredientsIdArr
                                }
                            }
                        } : undefined,
                    // сортировка по вариантам продуктов на основе размеров и типа теста
                    ProductItem: {
                        some: {//какие-то значения должны совпадать при выборке
                            size: {//размеры варианта продукта
                                in: sizes //из значений массива sizes
                            },
                            productType: {//типы вариантов продукта
                                in: pizzaTypes //из значений массива pizzaTypes
                            },
                            price: { //
                                //для выборки вариантов у которых есть цена "между" используем параметры предоставленныз prisma: gte и lte
                                gte: minPrice,//Значение n больше или равно x 
                                lte: maxPrice,//Значение n меньше или равно x
                            }
                        }
                    }
                },
                // вернуть поля включая ингредиенты и варианты продуктов
                include: {
                    ProductIngredient: {
                        include: {
                            Ingredient: true
                        }
                    },
                    ProductItem: {
                        orderBy: {//отсортировать варианты продуктов по цене в порядке возрастания. Для отображения цены в карточке варианта продукта. 
                                  //Формирует массив вариантов в порядке возрастания цены элементов массива
                            price: 'asc'
                        },
                        where: {//Выдаёт только цены вариантов из массива вариантов от минимальной до максимальной. 
                                //эти цены попадают в заданный при фильтрации диапазон и выводятся согласно ему
                            price: {
                                gte: minPrice,//Значение n больше или равно x 
                                lte: maxPrice,//Значение n меньше или равно x
                            }
                        },
                    }
                }
            }
        }
    }
    )

    //NOTE - код из оригинала
    // const categories = await prisma.category.findMany({
    //   include: {
    //     Product: {
    //       orderBy: {
    //         id: 'desc',
    //       },
    //       where: {
    //         ProductIngredient: ingredientsIdArr?//FIXME - 
    //            {
    //               some: {
    //                 id: {
    //                   in: ingredientsIdArr,
    //                 },
    //               },
    //             }
    //           : undefined,
    //         items: {
    //           some: {
    //             size: {
    //               in: sizes,
    //             },
    //             pizzaType: {
    //               in: pizzaTypes,
    //             },
    //             price: {
    //               gte: minPrice, // >=
    //               lte: maxPrice, // <=
    //             },
    //           },
    //         },
    //       },
    //       include: {
    //         ingredients: true,
    //         items: {
    //           where: {
    //             price: {
    //               gte: minPrice,
    //               lte: maxPrice,
    //             },
    //           },
    //           orderBy: {
    //             price: 'asc',
    //           },
    //         },
    //       },
    //     },
    //   },
    // });

    return categories;
};