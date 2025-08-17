export const metadata = { title: "Контакты | AI Studio B2BcAI" };
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Client from "./Client";

export default function Page() {
  return <Client />;
}
