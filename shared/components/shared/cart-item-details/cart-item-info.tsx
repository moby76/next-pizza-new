//компонент для информации о товаре в корзине: название и, если это пицца, то добавляется инфо о ингредиентах, размере и типе теста


import React from 'react'
import { cn } from '@/shared/lib/utils';

interface Props {
	name: string;
	details: string
	className?: string;
}

export const CartItemInfo = ({ name, className, details}: Props) => {

	return (
		<div>
			<div className={cn('flex items-center justify-between', className)}>
				{/* название варианта продукта */}
				<h2 className="text-lg font-bold flex-1 leading-6">{name}</h2>
			</div>			
			{/* если есть детали для пиццы(тип теста, размер и ингредиенты), то выводим их*/}
			{details  && <p className="text-xs text-gray-800 w-[90%]">{details}</p>}
		</div>
	);
};
