import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "AI TOK — токенизатор внедрения AI",
  description: "Расчёт CAPEX/OPEX/ROI и конвертация в КП"
};

export default function Page(){ return <Client/>; }