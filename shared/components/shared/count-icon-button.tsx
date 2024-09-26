//выбор типа иконки для кнопок блока добавления количества товара в корзине 

import React from 'react'
import { Minus, Plus } from 'lucide-react';
import { CountButtonProps } from './count-button';
import { Button } from '../ui/button';
import { cn } from '@/shared/lib/utils';

interface IconButtonProps {
	size?: CountButtonProps['size'] //получаем значение размера из экспортированного интерфейса из countButton
	disabled?: boolean;
	type?: 'plus' | 'minus';
	onClick?: () => void;
}

export const CountIconButton = ({
	size = 'sm',
	disabled,
	type,
	onClick,
}: IconButtonProps) => {
	return (
		// переиспользуем UI-компонент Button
		<Button
			variant="outline"
			disabled={disabled}
			onClick={onClick}
			type="button"
			className={cn(
				'p-0 hover:bg-primary hover:text-white disabled:bg-white disabled:border-gray-400 disabled:text-gray-400',
				size === 'sm' ? 'w-[30px] h-[30px] rounded-[10px]' : 'w-[38px] h-[38px] rounded-md',
			)}>
			{/* рендерит иконку в зависимости от полученного значения из countButton */}
			{type === 'plus' ? (
				<Plus className={size === 'sm' ? 'h-4' : 'h-5'} />
			) : (
				<Minus className={size === 'sm' ? 'h-4' : 'h-5'} />
			)}
		</Button>
	);
};
