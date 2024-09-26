//получаем данные продуктов из БД для реализации поиска
//В результате получим доступ к списку продуктов по параметру ?qwery=nameOfProduct по адресу localhost:3000/api/products/search?qwery=nameOfProduct

import { prisma } from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {

  const query = req.nextUrl.searchParams.get('query') || ''//получим параметр ?qwery из поисковой строки браузера

  const products = await prisma.product.findMany({//получить все продукты из БД
    where: {//где
      name: {//имя
        contains: query,//содержит параметр ?qwery
        mode: 'insensitive'//не чувствителен к регистру
      },
    },
    take: 5 //вернёт только 5 продуктов
  });

  return NextResponse.json(products);
}
