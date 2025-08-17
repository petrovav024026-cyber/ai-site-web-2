"use client";
import { useState } from "react";

type Input = {
  N: number;
  complexity: "low" | "mid" | "high";
  K: number;
  R: number;
  A: number;
};

type Result = {
  capex: number;
  opex: number;
  saving: number;
  roi: number;
  payback: number | null;
};

export default function Client() {
  const [inp, setInp] = useState<Input>({
    N: 3,
    complexity: "mid",
    K: 10000,
    R: 1000,
    A: 40,
  });

  const [res, setRes] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  function upd<K extends keyof Input>(key: K, value: Input[K]) {
    setInp((s) => ({ ...s, [key]: value }));
  }

  async function calcLocal() {
    setLoading(true);
    try {
      const coeff = inp.complexity === "low" ? 1 : inp.complexity === "high" ? 2.3 : 1.6;
      const capex = 50000 * inp.N * coeff;
      const opex = 0.1 * capex + 0.02 * inp.K;
      const saving = (inp.K * inp.R * 0.3) * (inp.A / 100);
      const denom = capex + 12 * opex;
      const roi = (12 * saving - denom) / denom;

      let payback: number | null = null;
      if (saving > opex) {
        const t = capex / (saving - opex);
        payback = Math.max(1, Math.round(t));
      }

      setRes({
        capex: Math.round(capex),
        opex: Math.round(opex),
        saving: Math.round(saving),
        roi,
        payback,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1>AI TOK — токенизатор внедрения AI (демо)</h1>
      <div className="tok-layout">
        <section>
          <label>Количество процессов</label>
          <input type="number" min={1} max={50} value={inp.N} onChange={e => upd("N", Number(e.target.value))} />

          <label>Сложность</label>
          <select value={inp.complexity} onChange={e => upd("complexity", e.target.value as Input["complexity"])}>
            <option value="low">низкая</option>
            <option value="mid">средняя</option>
            <option value="high">высокая</option>
          </select>

          <label>Обращений/мес</label>
          <input type="number" min={0} max={1000000} value={inp.K} onChange={e => upd("K", Number(e.target.value))} />

          <label>₽/час сотрудника</label>
          <input type="number" min={100} max={20000} value={inp.R} onChange={e => upd("R", Number(e.target.value))} />

          <label>% автоматизации</label>
          <input type="number" min={0} max={100} value={inp.A} onChange={e => upd("A", Number(e.target.value))} />

          <div className="form-actions">
            <button className="pill" onClick={calcLocal} disabled={loading}>Рассчитать</button>
          </div>
        </section>

        <aside className="tok-result">
          {!res ? (
            <p>Заполните параметры и нажмите «Рассчитать».</p>
          ) : (
            <div>
              <div className="kpi-row">
                <div>CAPEX: {res.capex.toLocaleString()} ₽</div>
                <div>OPEX/мес: {res.opex.toLocaleString()} ₽</div>
              </div>
              <div className="kpi-row">
                <div>Экономия/мес: {res.saving.toLocaleString()} ₽</div>
                <div>ROI (12м): {(res.roi * 100).toFixed(1)}%</div>
              </div>
              <div style={{ margin: "4px 0 12px" }}>
                Окупаемость: {res.payback === null ? "не окупается" : `${res.payback} мес`}
              </div>
              <button className="pill" onClick={() => alert("Сохранить расчёт → КП (mock)")}>
                Сохранить расчёт → КП
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
