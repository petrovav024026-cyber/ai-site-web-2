
"use client";

import { useState } from "react";

export default function ContactsPage() {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="contacts-form">
      <h1>Контакты</h1>
      <form>
        <label>
          Имя: <input type="text" name="name" required />
        </label>
        <label>
          Email: <input type="email" name="email" required />
        </label>
        <label>
          Комментарий:
          <textarea name="comment" />
        </label>
        <label>
          <input type="checkbox" required checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
          Я принимаю <a
  href="/privacy_policy_ai_studio.pdf"
  target="_blank"
  rel="noopener noreferrer"
  className="text-[#00AEEF] underline hover:text-[#26A5E4]"
>
  Политику обработки персональных данных
</a>

        </label>
        <button type="submit" disabled={!accepted}>Отправить</button>
      </form>
    </div>
  );
}
