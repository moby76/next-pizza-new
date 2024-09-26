//эта страница будет отображаться в случае попытки входа на сайт без авторизации.

import { InfoBlock } from "@/shared/components"

export default function UnauthorizedPage() {
    return (
        <div className="flex flex-col items-center justify-center mt-36">
            <InfoBlock                
                title="Доступ запрещён"
                text="Данную страницу могут просматривать только авторизованные пользователи"
                imageUrl="/assets/images/lock.png"
            />
        </div>
    )
}