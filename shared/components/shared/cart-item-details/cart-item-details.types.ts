//универсальный интерфейс для использования его в разных компонентах

export interface CartItemProps {
  id: number;
  imageUrl: string;
  details: string
  name: string;
  price: number;
  quantity: number;
  disabled?: boolean;//для отработки признака отключения(гашения) элемента(например при удалении из корзины)
}
