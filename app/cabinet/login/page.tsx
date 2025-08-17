import dynamic from 'next/dynamic'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Вход в личный кабинет',
  description: 'Авторизация на платформе AI Studio',
}

const LoginClient = dynamic(() => import('./Client'), { ssr: false })

export default function LoginPage() {
  return <LoginClient />
}
