//Страница профиля(.../profile). будет получать сессию нашего профиля 
//если пользователь неавторизирован, то для него нет доступа на страницу профиля. Доступ только для авторизованного пользователя

import { prisma } from "@/prisma/prisma-client";
import { ProfileForm } from "@/shared/components";
import { getUserSession } from "@/shared/lib/get-user-session";
import { redirect } from "next/navigation";

export default async function ProfilePage() {

    // /сначала получить сессию серверную функцию getUserSession(ака getServerSession(authOptions))
    const session = await getUserSession()
    // console.log('session', session);
    // * если получаем null из getServerSession, значит пользователь неавторизирован и переносим на страницу /not-auth
    if (!session) {
        redirect('/not-auth')
    }     

    // ** Выполнить проверку на наличие пользователя в БД по id из сессии
    const user = await prisma.user.findFirst({
        where: {
            id: Number(session?.user?.id)            
        }
    })

    // *** Если нет пользователя в БД, то переносим на страницу /not-auth
    if (!user) {
        return redirect('/not-auth')
    }
    
    // *** иначе, если авторизован и есть в БД, то отображаем сам профиль
    return <ProfileForm data={user} />

}