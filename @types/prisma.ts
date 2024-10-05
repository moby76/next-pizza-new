//расширенный тип от продукта: сам продукт + вариант продукта включающий в себя ингредиенты
//на базе типов сгенерированных Призмой

import { Ingredient, Product, ProductItem, Prisma } from '@prisma/client'
// import { Ingredient, Product, ProductItem,  Prisma } from '@prisma/client'; //NOTE - оригинал

//NOTE ----- оригинал ----------- //
//export type ProductWithRelations = Product & { 
//items: ProductItem[]; 
//ingredients: Ingredient[] }

//NOTE - Для извлечения ингредиентов через соединительную таблицу Product_Ingredients используем метод Prisma: GetPayload
//создать тип включающий в себя ингредиенты
export type Product_IngredientWithPayload = Prisma.Product_IngredientGetPayload<{
    include: {
        Ingredient: true
    }
}>

export type ProductWithRelations = Product & {
    ProductItem: ProductItem[]
    // Product_Ingredient: ({ Ingredient: { id: number; name: string; date_updated: Date | null; date_created: Date | null; price: number | null; imageUrl: string | null; } | null; } & { id: number; productId: number | null; ingredientId: number | null; })[];
    Product_Ingredient: Product_IngredientWithPayload[]
    
}