//Страница отдельного продукта формируется в зависимости от переданного параметра(id)
//ATTENTION - так-как в этом компоненте происходит запрос к БД, то он может быть только серверным компонентом

import { Container, ProductForm } from "@/shared/components/shared"
import { prisma } from "@/prisma/prisma-client"
import { notFound } from "next/navigation"

export default async function ProductPage({ params: { id } }: { params: { id: string } }) {

    //STEP-1 - получить из БД (первый)продукт где id = id из строки запроса. Предварительно переконвертировать его из строки в Number
    const product = await prisma.product.findFirst({
        where: {
            id: Number(id)
        },
        include: {//включая 
            ProductIngredient: {
                include: { Ingredient: true }//ингредиенты этого продукта
            },
            ProductItem: {//варианты созданные на основе этого продукта
                orderBy: {
                    createdAt: 'desc'//отсортированных по уменьшению(от последних к старым)
                }
            },
            //FIXME * Этот блок запроса лучше вынести в отдельный файл и подгружать его через useEffect. примерно описывает на 14:40:00  * //
            Category: {//категорию этого продукта
                include: {
                    Product: {//все другие продукты этой категории
                        include: {
                            ProductItem: true//и варианты созданные на их основе
                        }
                    }
                }
            }
        }
    })

    //STEP-2 - выполнить проверку: если нету продукта, вызвать функцию Nexta - notFound(редирект на страницу notFound)
    if (!product) {
        return notFound()
    }

    return (
        <Container className="flex flex-col my-10">
            {/* подключаем клиентский компоноент и передадим туда данные полученные из запроса к БД */}
            <ProductForm product={product} />
        </Container>
    )
}