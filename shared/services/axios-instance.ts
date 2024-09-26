import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,//путь к апи(в нашем случае это будет путь к собственному api '/api')
})