//Главная страница сайта


import { Container, Filters, ProductGroupList, Title, TopBar, Stories } from '@/shared/components'
import { Suspense } from 'react'
import { findPizzas } from '@/shared/lib'
import { GetSearchParams } from '@/shared/lib/find-pizzas'

export default async function Home({searchParams}: {searchParams: GetSearchParams}) {    
 
    //получить отфильтрованные данные из ф-ции findPizzas предав параметром searchParams(попадают из строки браузера(?qwery))
    //FIXME - скорее всего нужно переделать на использование хука useSearchParams предоставленного из nextjs
    const categories = await findPizzas(searchParams)
    // const searchParams = useSearchParams() as GetSearchParams 
    // const search = searchParams.get('search')
    
    // console.log('categories-products', categories[0].Product);
    return <>

        {/* Используем универсальный контейнер из компонентов /shared */}
        <Container className='mt-10'>
            {/* для заголовка используем компонент Title передав в него - 'Все пиццы' в качестве значения для аргумента text, значение 'lg' для аргумента size и значение 'font-extrabold' для className */}
            <Title text='Все пиццы' size='lg' className='font-extrabold' />
        </Container>

        {/* передать в компонент  TopBar только категории в которых есть продукты (>0)*/}        
        <TopBar categories={categories.filter((cat) => cat.Product.length > 0)} />
        
        <Stories />

        {/* контент главной страницы */}
        <Container className='pb-14 mt-10'>

            {/* див который рендерит внутри себя 2 части: фильтры(слева) и каталог продукции(справа). Разделённых промежутком в 60 px */}
            <div className='flex gap-x-[60px]'>

                {/* компонент фильтрации */}
                <div className='w-[250px]'>

                    <Suspense fallback={<div>Loading...</div>}>
                        {/* //FIXME - сделать скелетон при загрузке фильтров */}
                        <Filters />
                    </Suspense>
                </div>

                {/* Список товаров */}
                <div className="flex-1">
                    <div className="flex flex-col gap-16">
                        {categories.map(
                            (category) => (
                                // category.products.length > 0 && (//NOTE - оригинальный код
                                category.Product.length > 0 && (
                                    <ProductGroupList //отображаем список продуктов и передаём в него значения:
                                        key={category.id} //уникальный ключ компонента
                                        title={category.name ?? ''}//название категории(или, если его нет - пустую строку - '')
                                        categoryId={category.id}//
                                        //productItems={category.products}//NOTE - оригинальный код.
                                        items={category.Product}//в значение items передаём массив продуктов(Product) принадлежащих данной категории из БД 
                                    />
                                )
                            )
                        )}
                    </div>
                </div>
            </div>
        </Container>

    </>
}
