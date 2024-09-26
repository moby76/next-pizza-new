//Все константы относящиеся к ПИЦЦЕ
//Для составления матрицы цены в зависимости от размера и типа теста

export const mapPizzaSize = {
    20: 'Маленькая',
    30: 'Средняя',
    40: 'Большая',
  } as const;
  
  export const mapPizzaType = {
    1: 'традиционное',
    2: 'тонкое',
  } as const;

  //Создать массив размеров из объекта mapPizzaSize для использования в фильтрах
  export const pizzaSizes = Object.entries(mapPizzaSize).map(([value, name]) => ({
    name,
    value,
  }));
  
    //Создать массив типов пиццы из объекта mapPizzaType для использования в фильтрах
  export const pizzaTypes = Object.entries(mapPizzaType).map(([value, name]) => ({
    name,
    value,
  }));
  

  //keyof typeof определит тип объекта javascript и вернет тип, который является объединением его ключей. Поскольку он может определить точное значение ключей, он может возвращать объединение их литеральных типов вместо простого возврата «строки».
  export type PizzaSize = keyof typeof mapPizzaSize;//TS-тип {name, value} =  size: 20 | 30 | 40
  export type PizzaType = keyof typeof mapPizzaType;//type: 2 | 1
  