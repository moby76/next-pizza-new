'use client'

import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'
import NextTopLoader from 'nextjs-toploader';

export default function Providers({ children }: React.PropsWithChildren) {
    return (
        <>
            <SessionProvider  >
                {children}
            </SessionProvider>
            <Toaster />
            <NextTopLoader color='orangered' height={10} shadow={false} />
        </>
    )
}