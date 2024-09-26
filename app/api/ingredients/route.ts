//Получить  список всех ингредиентов из БД и сформировать endpoint для запроса с клиента через fetch/axios
//В результате получим доступ к списку ингредиентов по адресу localhost:3000/api/ingredients

import { prisma } from '@/prisma/prisma-client'
import { NextResponse } from 'next/server';

export async function GET() {
  const ingredients = await prisma.ingredient.findMany();

  return NextResponse.json(ingredients);
}
