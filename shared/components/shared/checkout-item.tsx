//Компонент - элемент корзины в блоке 1. Корзина в компоненте Оформления заказа CheckoutPage
//аналогичен компоненту CartDrawerItem, но с изменённой разметкой

'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';
import { X } from 'lucide-react';
import { CartItemProps } from './cart-item-details/cart-item-details.types';
import * as CartItemDetails from './cart-item-details';

interface CheckoutItemProps extends CartItemProps {//дополним универс. интерфейс CartItemProps
	//TODO - объяснить и занести в документацию
	onClickCountButton?: (type: 'plus' | 'minus') => void//обработчик добавления/уменьшения количества
	onClickRemove?: () => void
	className?: string
}


export const CheckoutItem = ({
	name,
	price,
	imageUrl,
	quantity,
	details,
	className,
	disabled,
	onClickCountButton,
	onClickRemove,
}: CheckoutItemProps) => {
	return (
		<div
			className={cn(
				'flex items-center justify-between',
				{ 'opacity-50 pointer-events-none': disabled, },//применяется свойства css неактивным и недоступным  при значении disabled = true
				className,
			)}>
			<div className="flex items-center gap-5 flex-1">
				{/* Картинка */}
				<CartItemDetails.Image src={imageUrl} />
				{/* параметры варианта и список добавленных ингредиентов */}
				<CartItemDetails.Info name={name} details={details} />
			</div>
			{/* цена */}
			<CartItemDetails.Price value={price} />

			<div className="flex items-center gap-5 ml-20">
				{/* компонент с добавлением количества активирует функцию onClickCountButton */}
				<CartItemDetails.CountButton onClick={onClickCountButton} value={quantity} />
				<button type="button" onClick={onClickRemove}>
					<X className="text-gray-400 cursor-pointer hover:text-gray-600" size={20} />
				</button>
			</div>
		</div>
	);
};
