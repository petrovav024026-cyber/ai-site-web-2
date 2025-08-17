// app/cabinet/login/page.tsx
import dynamic from 'next/dynamic'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Вход в кабинет',
  description: 'Авторизация пользователя',
}

const LoginClient = dynamic(() => import('./Client'), { ssr: false })

export default function LoginPage() {
  return <LoginClient />
}
