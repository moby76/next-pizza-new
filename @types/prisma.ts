//расширенный тип от продукта: сам продукт + вариант продукта включающий в себя ингредиенты
//на базе типов сгенерированных Призмой

import { Ingredient, Product, ProductItem, Prisma } from '@prisma/client'
// import { Ingredient, Product, ProductItem,  Prisma } from '@prisma/client'; //NOTE - оригинал

//NOTE ----- оригинал ----------- //
//export type ProductWithRelations = Product & { 
//items: ProductItem[]; 
//ingredients: Ingredient[] }

//NOTE - Для извлечения ингредиентов через соединительную таблицу productIngredients используем метод Prisma: GetPayload
//создать тип включающий в себя ингредиенты
export type ProductIngredientWithPayload = Prisma.ProductIngredientGetPayload<{
    include: {
        Ingredient: true
    }
}>

export type ProductWithRelations = Product & {
    ProductItem: ProductItem[]
    // ProductIngredient: ({ Ingredient: { id: number; name: string; updatedAt: Date | null; createdAt: Date | null; price: number | null; imageUrl: string | null; } | null; } & { id: number; productId: number | null; ingredientId: number | null; })[];
    ProductIngredient: ProductIngredientWithPayload[]
    
}