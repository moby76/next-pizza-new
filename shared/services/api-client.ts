//Создадим глобальную переменную API

import * as products from './products'//подключим запрос на products 
import * as ingredients from './ingredients'//получим всё из ingredients
import * as cart from './cart'//получим всё из ingredients
import * as auth from './auth'//получим всё из auth
import * as stories from './stories'//получим всё из auth

export const Api = {
    products,
    ingredients,
    cart,
    auth,
    stories
}