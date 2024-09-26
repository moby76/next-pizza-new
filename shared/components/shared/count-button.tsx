//блок кнопок добавления/убавления количества товара в корзине

import React from 'react'
import { cn } from '@/shared/lib/utils';
import { CountIconButton } from './count-icon-button';

export interface CountButtonProps {
	value?: number;//получает значение количества товаров
	size?: 'sm' | 'lg' //размер кнопки в зависимости от компонента в котором рендерится
	onClick?: (type: 'plus' | 'minus') => void //логическое условие(нажал на "плюс" или на "минус")
	className?: string;
}

export const CountButton = ({
	className,
	onClick,
	value = 1,// значение по умолчанию - 1
	size = 'sm',// размер кнопки по умоч. маленький
}: CountButtonProps) => {
	return (
		<div className={cn('inline-flex items-center justify-between gap-3', className)}>
			{/* левая кнопка minus с передачей в него значений "минус"*/}
			<CountIconButton
				onClick={() => onClick?.('minus')}//передаёт тип "минус"
				disabled={value === 1}//отключение кнопки при количестве = 1
				size={size}
				type="minus"
			/>

			<b className={size === 'sm' ? 'text-sm' : 'text-md'}>{value}</b>

			{/* правая кнопка minus с передачей в него значений "плюс"*/}
			<CountIconButton
				onClick={() => onClick?.('plus')} //передаёт тип "плюс"
				size={size}
				type="plus" />
		</div>
	);
};
