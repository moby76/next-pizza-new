import { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/prisma/prisma-client";
import { compare, hashSync } from "bcrypt";
import { UserRole } from "@prisma/client";
import {  } from 

export const authOptions: AuthOptions = {
    //секрет который позволит генерироваться нашему jwt-токену
    secret: process.env.NEXTAUTH_SECRET,
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID || '',
            clientSecret: process.env.GITHUB_SECRET || '',
            //при входе через GitHub нужно: 
            //1. проверить есть-ли такой пользователь в БД, ес есть то просто авторизация
            //2. если такого польз. нет в БД, то создать его/зарегестрировать
            profile(profile) {//функция провайдера GH возвращает данные из профиля пользователя на GitHub
                return {
                    id: profile.id,
                    name: profile.name || profile.login,
                    email: profile.email,
                    image: profile.avatar_url,
                    role: 'USER' as unknown as UserRole, //добавим своё доп. значение role = 'USER' из enum prisma????
                }
            }
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text", placeholder: "email" },
                password: { label: "Password", type: "password" }
            },
            //создать функцию обрабатывающую реквизиты для входа
            async authorize(credentials) {
                //* если Реквизиты для входа не переданы, вернём "ничего"
                if (!credentials) {
                    return null
                }
                //** иначе создать объект с данными для входа
                const values = {
                    email: credentials.email,
                    // password: credentials.password
                }
                //*** найти пользователя с такой почтой в БД
                const findUser = await prisma.user.findFirst({
                    where: values
                })
                if (!findUser) {
                    return null
                }

                //**** проверить пароль на валидность методом сравнения compare из библиотеки bcrypt
                //превращает введённый пароль в hash и сравнивает с паролем из БД
                const isValidPassword = await compare(credentials.password, findUser.password)

                if (!isValidPassword) {
                    return null
                }

                //***** если у найденного пользователя нет даты верифмкации(он не верифицирован), вернём "ничего"
                if (!findUser.verifiedDate) {
                    return null
                }//нельзя пройти авторизацию

                //****** если все проверки пойдены вернуть определённые данные пользователя
                return {
                    id: findUser.id,//id 
                    email: findUser.email,
                    name: findUser.fullName,
                    role: findUser.role//роль понадобится когда будем работать с DashBoard(дашбоардом) и проверять на уровне дашборда это обычный пользователь или администратор
                }
            }
        })
    ],
    
    //обявить сессию и стратегию с которой будем работать
    session: {
        strategy: "jwt",//стратегия с jwt-токеном
        // maxAge: 30 * 24 * 60 * 60,//время жизни сессии
    },
    callbacks: { // коллбэки: 1.signIn, 2.jwt, 3.session 
        //метод для входа signIn принимает в себя 2 параметра: user, account. должен на выходе вернуть true или false для разрешения/запрета авторизации
        async signIn({ user, account, }) {
            try {
                // ----- блок проверки по провайдеру credentials ----- //

                if (account?.provider === 'credentials') {//если провайдер = credentials(email и пароль)
                    return true//вернём значение true
                }

                if (!user.email) {//если у пользователя нет email
                    return false//запрет для дальнейших действий
                }  

                // если есть email то находим пользователя в БД по провайдеру или по email
                const findUser = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { email: user.email },//или проверяем по email. 
                            
                            {//Или проверяем по социальной сети(github, google)
                                socialNetwork: account?.provider, //сопоставляем поле в БД с тем что получаем от провайдера
                                socialNetworkId: account?.providerAccountId//по Id социальной сети
                            }, //сопоставляем поле id соцсети в БД с тем что получаем от провайдера 
                        ]
                    }
                })

                //если пользователь найден, то обновляем аккаунт пользователя в БД
                if (findUser) {
                    await prisma.user.update({
                        where: {
                            id: findUser.id
                        },
                        data: {//обновляем ему данные
                            socialNetwork: account?.provider,
                            socialNetworkId: account?.providerAccountId
                        }
                    })
                    //можно разрешить авторизацию
                    return true
                }
                //НО если не нашли пользователя, значит нужно его создать(Зарегистрировать?)
                await prisma.user.create({
                    data: {
                        email: user.email,
                        fullName: user.name || 'User #' + user.id,// или имя пользователя из соцсети или конструкция на базе id пользователя: 'User #' + user.id
                        password: hashSync(user.id.toString(), 10),//NOTE - зашифрованный пароль на основе id пользователя
                        verifiedDate: new Date(),
                        socialNetwork: account?.provider,
                        socialNetworkId: account?.providerAccountId,
                        //role: "USER" //TODO - добавить роль по умолчанию(?)
                    }
                })

                return true

            } catch (error) {
                console.log('Error [SIGNIN]', error);
                return false;
            }
        },
        async jwt({ token }) {//понадобится только токен из всех данных из токена jwt(email, password, role и т.д.)

            //если в токене нет email, то вернём токен без изменений
            if (!token.email) {
                return token;
            }
            //найти пользователя из БД по данным из jwt
            const findUser = await prisma.user.findFirst({
                where: {
                    email: token.email
                }
            })

            //если пользователь с таким email найден, то довшиваем данные в token
            if (findUser) {
                token.id = String(findUser.id),//id привести к строке(зачем ? Не объясняется)
                    token.fullName = findUser.fullName,
                    token.email = findUser.email,
                    token.role = findUser.role
            }

            return token
        },
        //создаётся функция - сессия которая принимает в себя раннее объявленую session и token(с данными)
        session({ session, token }) {
            //если пользователь находится в сессии(создан объект session.user)
            if (session?.user) {
                //прикручиваем к сессии id и роль из токена
                session.user.id = token.id
                session.user.role = token.role
            }

            return session
        },
    },
    pages: {
        signIn: '/auth/signin'
    }
}
