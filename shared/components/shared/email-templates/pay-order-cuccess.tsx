//шаблон для отправки письма после успешной оплаты

import { CartItemDTO } from '@/shared/services/dto/cart.dto';
import React from 'react';

interface Props {
	//   firstName: string
	orderId: number
	items: CartItemDTO[]
}

export const PayOrderSuccessTemplate: React.FC<Props> = ({ orderId, items }) => (

	<div>
		<h1>Спасибо за покупку! </h1>

		<p>Ваш заказ No{orderId} оплачен. Теперь вы можете. Список товаров</p>

		<hr />

		<ul>
			{/* {console.log('items', items.productItem)} */}

			{items.map((item) => (
				<li key={item.id}>
					{item.productItem?.product.name} | {item.productItem.price} ₽ x {item.quantity} шт. = {(item.productItem?.price ?? 0) * (item.quantity ?? 0)} ₽
				</li>
			))
			}
		</ul>
	</div>
);
