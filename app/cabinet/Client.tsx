'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginClient() {
  const router = useRouter();
  const [state, setState] = useState('');

  return (
    <div>
      {/* TODO: Здесь может быть форма логина */}
      <button onClick={() => router.push('/dashboard' as const)}>Войти</button>
    </div>
  );
}
