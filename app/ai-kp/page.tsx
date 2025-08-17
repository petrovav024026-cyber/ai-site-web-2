import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "AI KP — интерактивное КП",
  description: "Соберите КП из каталога и получите ссылку на оплату"
};

export default function Page(){ return <Client/>; }