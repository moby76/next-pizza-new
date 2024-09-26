//Компонент заголовка

import clsx from 'clsx';
import { createElement } from 'react';

//указывается какие типы размеров 
type TitleSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface titleProps {
  size?: TitleSize;
  className?: string;
  text: string;
}

//в зависимости от указанного размера будет подстраиваться размер тип заголовка и шрифта
export const Title = ({ text, size = 'sm', className }: titleProps) => {//переменная Title, размер size по умолчанию = sm
  const mapTagBySize = {//классы тегов заголовка
    xs: 'h5',
    sm: 'h4',
    md: 'h3',
    lg: 'h2',
    xl: 'h1',
    '2xl': 'h1',
  } as const;//Когда вы используете as const для переменной или значения, TypeScript уточняет тип этой переменной до ее точного значения или комбинации литеральных типов. Это часто используется для создания неизменяемых значений и гарантирования того, что TypeScript будет рассматривать значения как конкретные литералы, а не расширять типы.

  const mapClassNameBySize = {//размеры шрифта 
    xs: 'text-[16px]',
    sm: 'text-[22px]',
    md: 'text-[26px]',
    lg: 'text-[32px]',
    xl: 'text-[40px]',
    '2xl': 'text-[48px]',
  } as const;

  return createElement(//Функция createElement позволяет создать элемент React. 
    mapTagBySize[size],//создаётся тип/тег заголовка в зависимости от значения size
    { className: clsx(mapClassNameBySize[size], className) },//формируется класс для текста путём приращения значения mapClassNameBySize(в зависимости от size) к className указанному непосредственно в компоненте где будет использовано
    text,//сам текст
  );
};
