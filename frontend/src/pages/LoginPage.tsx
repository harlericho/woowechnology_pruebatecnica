import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/api";
import axios from "axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // Validaciones básicas
    if (!form.email || !form.password) {
      setError("Todos los campos son requeridos");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("El email no es válido");
      return;
    }

    setLoading(true);
    try {
      const data = await authService.login(form);
      login(data.token, data.user);
      navigate("/profile");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Error al iniciar sesión");
      } else {
        setError("Error inesperado, intenta de nuevo");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>W</div>
          <h1 style={styles.title}>WoowTechnology</h1>
          <p style={styles.subtitle}>Inicia sesión en tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <div style={styles.errorBox}>{error}</div>}

          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="xyz@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={styles.input}
              disabled={loading}
              autoFocus
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={styles.input}
              disabled={loading}
            />
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Iniciando sesion..." : "Iniciar sesion"}
          </button>
        </form>

        <p style={styles.footerText}>
          ¿No tienes cuenta?{" "}
          <Link to="/register" style={styles.link}>
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
    fontFamily: "'Segoe UI', sans-serif",
  },
  card: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "2.5rem",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
  },
  header: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  logo: {
    width: "56px",
    height: "56px",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
    fontWeight: 800,
    color: "#fff",
    margin: "0 auto 1rem",
  },
  title: {
    margin: 0,
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#0f172a",
  },
  subtitle: {
    margin: "0.25rem 0 0",
    color: "#64748b",
    fontSize: "0.9rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#374151",
  },
  input: {
    padding: "0.75rem 1rem",
    border: "2px solid #e5e7eb",
    borderRadius: "10px",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border-color 0.2s",
    color: "#0f172a",
  },
  button: {
    padding: "0.85rem",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "0.5rem",
  },
  errorBox: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#dc2626",
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    fontSize: "0.875rem",
  },
  footerText: {
    textAlign: "center",
    marginTop: "1.5rem",
    color: "#64748b",
    fontSize: "0.875rem",
  },
  link: {
    color: "#6366f1",
    fontWeight: 600,
    textDecoration: "none",
  },
};

export default LoginPage;
