import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { userService } from "../services/api";
import type { User } from "../types";

const AdminPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getAll();
        setUsers(data.users);
        setFiltered(data.users);
      } catch {
        setError("No se pudo cargar la lista de usuarios");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      users.filter(
        (u) =>
          u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
      ),
    );
  }, [search, users]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Top bar */}
        <div style={styles.topBar}>
          <div style={styles.logo}>W</div>
          <span style={styles.appName}>WoowTechnology</span>
          <div style={styles.spacer} />
          <button
            style={styles.profileBtn}
            onClick={() => navigate("/profile")}
          >
            Mi perfil
          </button>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>

        {/* Título */}
        <div style={styles.pageHeader}>
          <h2 style={styles.pageTitle}>Panel de administración</h2>
          <p style={styles.pageSubtitle}>
            {users.length} usuario{users.length !== 1 ? "s" : ""} registrado
            {users.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Card */}
        <div style={styles.card}>
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.search}
          />

          {error && <div style={styles.errorBox}>{error}</div>}

          {loading ? (
            <p
              style={{ color: "#64748b", textAlign: "center", padding: "2rem" }}
            >
              Cargando...
            </p>
          ) : filtered.length === 0 ? (
            <p
              style={{ color: "#64748b", textAlign: "center", padding: "2rem" }}
            >
              No se encontraron usuarios
            </p>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Nombre</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Rol</th>
                    <th style={styles.th}>Registro</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={u.id} style={styles.tr}>
                      <td style={styles.td}>
                        <div style={styles.nameCell}>
                          <div style={styles.miniAvatar}>
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          {u.name}
                        </div>
                      </td>
                      <td style={styles.td}>{u.email}</td>
                      <td style={styles.td}>
                        <span
                          style={
                            u.role === "admin"
                              ? styles.badgeAdmin
                              : styles.badgeUser
                          }
                        >
                          {u.role === "admin" ? "⭐ Admin" : "👤 User"}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {u.createdat
                          ? new Date(u.createdat).toLocaleDateString("es-EC")
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    padding: "1.5rem",
    fontFamily: "'Segoe UI', sans-serif",
  },
  container: { maxWidth: "900px", margin: "0 auto" },
  topBar: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    marginBottom: "2rem",
  },
  logo: {
    width: "36px",
    height: "36px",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    color: "#fff",
    fontSize: "1rem",
    flexShrink: 0,
  },
  appName: { color: "#e2e8f0", fontWeight: 600, fontSize: "1rem" },
  spacer: { flex: 1 },
  profileBtn: {
    padding: "0.5rem 1rem",
    background: "rgba(99,102,241,0.2)",
    border: "1px solid #6366f1",
    borderRadius: "8px",
    color: "#a5b4fc",
    fontSize: "0.85rem",
    cursor: "pointer",
    fontWeight: 600,
  },
  logoutBtn: {
    padding: "0.5rem 1rem",
    background: "rgba(239,68,68,0.15)",
    border: "1px solid rgba(239,68,68,0.4)",
    borderRadius: "8px",
    color: "#fca5a5",
    fontSize: "0.85rem",
    cursor: "pointer",
    fontWeight: 600,
  },
  pageHeader: { marginBottom: "1.5rem" },
  pageTitle: {
    color: "#f1f5f9",
    fontSize: "1.75rem",
    fontWeight: 700,
    margin: "0 0 0.25rem",
  },
  pageSubtitle: { color: "#64748b", margin: 0, fontSize: "0.9rem" },
  card: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "1.5rem",
    boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
  },
  search: {
    width: "100%",
    padding: "0.75rem 1rem",
    border: "2px solid #e5e7eb",
    borderRadius: "10px",
    fontSize: "0.95rem",
    outline: "none",
    color: "#0f172a",
    marginBottom: "1.25rem",
    boxSizing: "border-box",
  },
  tableWrapper: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    textAlign: "left",
    padding: "0.75rem 1rem",
    background: "#f8fafc",
    color: "#64748b",
    fontSize: "0.8rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderBottom: "2px solid #e5e7eb",
  },
  tr: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: "0.85rem 1rem", color: "#374151", fontSize: "0.9rem" },
  nameCell: { display: "flex", alignItems: "center", gap: "0.6rem" },
  miniAvatar: {
    width: "32px",
    height: "32px",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: 700,
    fontSize: "0.8rem",
    flexShrink: 0,
  },
  badgeAdmin: {
    background: "#fef3c7",
    color: "#d97706",
    padding: "0.2rem 0.6rem",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: 600,
  },
  badgeUser: {
    background: "#ede9fe",
    color: "#7c3aed",
    padding: "0.2rem 0.6rem",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: 600,
  },
  errorBox: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#dc2626",
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    fontSize: "0.875rem",
  },
};

export default AdminPage;
