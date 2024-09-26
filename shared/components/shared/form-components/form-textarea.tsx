//html-тег textarea(Текстовая область) интегрированный с react-hook-form

'use client'

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Textarea } from '../../ui/textarea';//получаем textarea из ui
import { ClearButton } from '../clear-button';//импортируем компонент ClearButton

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	className?: string;
	name: string;
	label?: string;
	required?: boolean;
}

export const FormTextarea = ({ className, name, label, required, ...props }: FormTextareaProps) => {
	const {
		register,
		formState: { errors },
		watch,
		setValue,
	} = useFormContext();

	const value = watch(name);
	const errorText = errors[name]?.message as string;

	const onClickClear = () => {
		setValue(name, '');
	};

	return (
		<div className={className}>
			{/* лейбл */}
			<p className="font-medium mb-2">
				{label} {required && <span className="text-red-500">*</span>}
			</p>
			{/* текстовая область */}
			<div className="relative">
				<Textarea className="h-12 text-md" {...register(name)} {...props} />
				{/* кнопка очистки */}
				{value && <ClearButton onClick={onClickClear} />}
			</div>
			{/* ошибка */}
			{errorText && <p className="text-red-500 text-sm mt-2">{errorText}</p>}
		</div>
	);
};
