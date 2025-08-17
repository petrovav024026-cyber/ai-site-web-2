export default function DashboardPage() {
  return (
    <main
      style={{
        maxWidth: "960px",
        margin: "0 auto",
        padding: "2rem",
        fontFamily: "sans-serif",
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          color: "#00AEEF",
          marginBottom: "1rem",
        }}
      >
        Добро пожаловать в личный кабинет
      </h1>

      <p style={{ fontSize: "1.1rem", color: "#374151", marginBottom: "1.5rem" }}>
        Здесь вы можете управлять своими проектами, заявками и расчетами.
      </p>

      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        }}
      >
        <div style={cardStyle}>
          <h3 style={cardTitle}>Мои проекты</h3>
          <p style={cardText}>Просматривайте и редактируйте текущие проекты.</p>
        </div>

        <div style={cardStyle}>
          <h3 style={cardTitle}>Расчёты</h3>
          <p style={cardText}>Доступ к сохранённым расчётам и токенизации.</p>
        </div>

        <div style={cardStyle}>
          <h3 style={cardTitle}>Профиль</h3>
          <p style={cardText}>Настройка данных аккаунта и выход из системы.</p>
        </div>
      </div>
    </main>
  );
}

const cardStyle: React.CSSProperties = {
  backgroundColor: "#F9FAFB",
  borderRadius: "12px",
  padding: "1rem",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  transition: "transform 0.2s ease",
  cursor: "pointer",
};

const cardTitle: React.CSSProperties = {
  fontSize: "1.2rem",
  color: "#00AEEF",
  marginBottom: "0.5rem",
};

const cardText: React.CSSProperties = {
  fontSize: "0.95rem",
  color: "#374151",
};
