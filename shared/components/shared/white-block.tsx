//этот компонент отображается в контенте корзины/оформления заказа. Повторяется там 3 раза и рендерит разные но однотипные данные

import React from 'react';
import { Title } from './title';
import { cn } from '@/shared/lib/utils';

interface Props {
  title?: string;//название блока
  endAdornment?: React.ReactNode;//свойство для добавления jsx-кода в блок. На подобии {children}
  className?: string;//базовый стиль
  contentClassName?: string;//стиль для содержимого конкретного блока
}

export const WhiteBlock: React.FC<React.PropsWithChildren<Props>> = ({
  title,
  endAdornment,
  className,
  contentClassName,
  children,//встраиваемый контент
}) => {
  return (
    <div className={cn('bg-white rounded-3xl', className)}>
      {title && (
        <div className="flex items-center justify-between p-5 px-7 border-b border-gray-100">
          <Title text={title} size="sm" className="font-bold" />
          {endAdornment}
        </div>
      )}

      <div className={cn('px-5 py-4', contentClassName)}>{children}</div>
    </div>
  );
};
