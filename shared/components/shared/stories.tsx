//компонент с историями(???)

'use client'

import { Api } from '@/shared/services/api-client'
import { IStory } from '@/shared/services/stories'
import React from 'react'
import { Container } from './container'
import { cn } from '@/shared/lib/utils'
import { X } from 'lucide-react'
import ReactStories from 'react-insta-stories';

interface Props {
    className?: string
}

export const Stories = ({ className }: Props) => {

    //создать состояние для stories
    const [stories, setStories] = React.useState<IStory[]>([])
    //состояние для открытия stories
    const [open, setOpen] = React.useState(false)
    //состояние для выбранного story. Начальное состояние - undefined
    const [selectedStory, setSelectedStory] = React.useState<IStory>()

    //запросить истории при загрузке страницы. через useefect
    React.useEffect(() => {

        async function fetchStories() {
            //получить все истории(массив[]) через функцию getAll из srvices/stories
            const data = await Api.stories.getAll()
            setStories(data)//вшить эти данные (массив с историями) в stories
        }
        fetchStories()
    }, [])

    //функция открывающая историю
    const onClickStory = (story: IStory) => {
        setSelectedStory(story)//задаём для стейта selectedStory (выбранная история) значение story из перебора массива stories в контейнере 
        //выполнить проверк: есть ли в этом story элементы(storyItems[])
        if (story.items.length > 0) {
            //только тогда открывать stories. Задав состояние open = true
            setOpen(true)//переводим состояние open в true
        }
    }

    return (
        <>
            <Container className={cn('flex items-center justify-between gap-2 my-10', className)}>

                {/* рендерим скелетоны(6 штук). При условии что stories ещё нет: stories.length = 0 //FIXME - можно было это выполнить через компонент skeleton*/}
                {stories.length === 0 &&
                    [...Array(6)].map((_, index) => (
                        <div key={index} className="w-[200px] h-[250px] bg-gray-200 rounded-md animate-pulse" />
                    ))}

                {/* отрендерить массив превью историй */}
                {stories.map((story) => (
                    <img
                        key={story.id}
                        onClick={() => onClickStory(story)}//при нажатии вызываем функцию открытия истории onClickStory
                        className="rounded-md cursor-pointer"
                        height={250}
                        width={200}
                        src={story.previewImageUrl}//ссылка на превью
                    />
                ))}

                {/* окно отображения истории после нажатия на один из элементов списка историй */}
                {open && (//если состояние open = true, то рендерим:
                    // блок для заднего фона модального окна на всю ширину и высоту экрана и прозрачностью 80%
                    <div className="absolute left-0 top-0 w-full h-full bg-black/80 flex items-center justify-center z-30">
                        {/* внутри этого --^ блока блок шириной 520 px */}
                        <div className="relative" style={{ width: 520 }}>
                            {/* кнопка закрытия модального окна. При нажатии задаёт состояние open = false */}
                            <button className="absolute -right-10 -top-5 z-30" onClick={() => setOpen(false)}>
                                <X className="absolute top-0 right-0 w-8 h-8 text-white/50" />
                            </button>

                            {/* компонент модального окна из пакета instaStories */}
                            <ReactStories
                                onAllStoriesEnd={() => setOpen(false)}// функция на закрытие модального окна. Обрабатывает условие которое последуе после завершения отображения слайдов внутри компонента
                                stories={selectedStory?.items.map((item) => ({ url: item.sourceUrl })) || []}//для константы stories(пакета instaStories) создаётся массив из объектов в виде ссылок(url) на каждый элемент 
                                defaultInterval={3000} //интервал между отображением слайдов(в мс)
                                width={520}
                                height={800}
                            />

                        </div>
                    </div>
                )}

            </Container>
        </>
    )
}