export const metadata = { title: "Админка — ЛК" };
export default function AdminIndex(){
  return (
    <div className="container">
      <h1>Админка</h1>
      <ul>
        <li><a href="/cabinet/admin/services">Услуги сайта</a></li>
      </ul>
    </div>
  );
}
