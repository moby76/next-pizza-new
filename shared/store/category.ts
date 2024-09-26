import { create } from 'zustand'

interface State {
    activeId: number // активный id
    setActiveId: (activeId: number) => void  //Функция обновления активного id
}

export const useCategoryStore = create<State>()((set) => ({ //создаём состояние с помощью метода create библиотеки Zustand
    activeId: 1, //по умолчанию активный пункт будет 1
    setActiveId: (activeId: number) => set({ activeId }) //set - установить активным пунктом activeId
  }));