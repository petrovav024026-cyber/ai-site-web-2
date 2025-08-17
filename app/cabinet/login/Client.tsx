"use client";

import { useRouter } from "next/navigation";
import type { Route } from "next";
import { useState } from "react";

export default function Client() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Здесь может быть логика аутентификации (заглушка)
    if (email && password) {
      // Переход в dashboard
      router.push("/cabinet/dashboard" as Route);
    } else {
      alert("Введите email и пароль");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "2rem" }}>
      <h2>Вход в личный кабинет</h2>

      <label>Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        style={{ display: "block", width: "100%", marginBottom: "1rem" }}
      />

      <label>Пароль</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="********"
        style={{ display: "block", width: "100%", marginBottom: "1rem" }}
      />

      <button
        onClick={handleLogin}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#00AEEF",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Войти
      </button>
    </div>
  );
}
