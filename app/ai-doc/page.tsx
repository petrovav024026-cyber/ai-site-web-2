import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI DOC — интерактивный договор",
  description: "Шаги работы и функционал раздела (MVP)"
};

export default function Page(){
  return (
    <div className="container">
      <h1>AI DOC — интерактивный договор (демо)</h1>
      <ol className="stepper">
        <li className="active">Шаблон</li>
        <li>Реквизиты</li>
        <li>Модули</li>
        <li>Просмотр</li>
        <li>Шэйр/Экспорт</li>
      </ol>
      <p>В этой версии описаны шаги и целевой функционал. На следующих итерациях появится мастер с превью и шарингом.</p>
    </div>
  );
}