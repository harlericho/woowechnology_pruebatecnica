import { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { userService } from "../services/api";
import type { User } from "../types";
import axios from "axios";

const ProfilePage = () => {
  const { user, logout, login, token } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userService.getMe();
        setProfile(data);
        setName(data.name);
      } catch {
        setError("No se pudo cargar el perfil");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim() || name.length < 2) {
      setError("El nombre debe tener al menos 2 caracteres");
      return;
    }

    setSaving(true);
    try {
      const data = await userService.updateMe({ name });
      setProfile(data.user);
      setName(data.user.name);
      setSuccess("Perfil actualizado correctamente");
      setEditMode(false);
      // Actualizar el contexto con el nuevo nombre
      if (user && token) {
        login(token, { ...user, name: data.user.name });
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Error al actualizar");
      } else {
        setError("Error inesperado");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loadingCard}>
          <p style={{ color: "#64748b" }}>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.topBar}>
          <div style={styles.logo}>W</div>
          <span style={styles.appName}>WoowTechnology</span>
          <div style={styles.spacer} />
          {user?.role === "admin" && (
            <button style={styles.adminBtn} onClick={() => navigate("/admin")}>
              Panel Admin
            </button>
          )}
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>

        {/* Avatar + nombre */}
        <div style={styles.avatarSection}>
          <div style={styles.avatar}>
            {profile?.name.charAt(0).toUpperCase()}
          </div>
          <h2 style={styles.userName}>{profile?.name}</h2>
          <span style={styles.badge}>
            {profile?.role === "admin" ? "⭐ Admin" : "👤 Usuario"}
          </span>
        </div>

        {/* Card de datos */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Información de perfil</h3>

          {error && <div style={styles.errorBox}>{error}</div>}
          {success && <div style={styles.successBox}>{success}</div>}

          {!editMode ? (
            <>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Nombre</span>
                <span style={styles.infoValue}>{profile?.name}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Email</span>
                <span style={styles.infoValue}>{profile?.email}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Rol</span>
                <span style={styles.infoValue}>{profile?.role}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Miembro desde</span>
                <span style={styles.infoValue}>
                  {profile?.createdat
                    ? new Date(profile.createdat).toLocaleDateString("es-EC", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "—"}
                </span>
              </div>

              <button
                style={styles.editBtn}
                onClick={() => {
                  setEditMode(true);
                  setError("");
                  setSuccess("");
                }}
              >
                Editar nombre
              </button>
            </>
          ) : (
            <form onSubmit={handleUpdate} style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>Nombre</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={styles.input}
                  disabled={saving}
                  autoFocus
                />
              </div>
              <div style={styles.btnRow}>
                <button
                  type="button"
                  style={styles.cancelBtn}
                  onClick={() => {
                    setEditMode(false);
                    setName(profile?.name || "");
                    setError("");
                  }}
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button type="submit" style={styles.saveBtn} disabled={saving}>
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </form>
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
  loadingCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
  },
  container: { maxWidth: "600px", margin: "0 auto" },
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
  adminBtn: {
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
  avatarSection: {
    textAlign: "center",
    marginBottom: "1.5rem",
  },
  avatar: {
    width: "80px",
    height: "80px",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2rem",
    fontWeight: 800,
    color: "#fff",
    margin: "0 auto 1rem",
  },
  userName: {
    color: "#f1f5f9",
    fontSize: "1.5rem",
    fontWeight: 700,
    margin: "0 0 0.5rem",
  },
  badge: {
    background: "rgba(99,102,241,0.2)",
    border: "1px solid rgba(99,102,241,0.4)",
    color: "#a5b4fc",
    padding: "0.25rem 0.75rem",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: 600,
  },
  card: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "2rem",
    boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
  },
  cardTitle: {
    margin: "0 0 1.5rem",
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "#0f172a",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.85rem 0",
    borderBottom: "1px solid #f1f5f9",
  },
  infoLabel: { color: "#64748b", fontSize: "0.875rem", fontWeight: 500 },
  infoValue: { color: "#0f172a", fontSize: "0.95rem", fontWeight: 600 },
  editBtn: {
    marginTop: "1.5rem",
    width: "100%",
    padding: "0.85rem",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  form: { display: "flex", flexDirection: "column", gap: "1.25rem" },
  field: { display: "flex", flexDirection: "column", gap: "0.4rem" },
  label: { fontSize: "0.875rem", fontWeight: 600, color: "#374151" },
  input: {
    padding: "0.75rem 1rem",
    border: "2px solid #e5e7eb",
    borderRadius: "10px",
    fontSize: "0.95rem",
    outline: "none",
    color: "#0f172a",
  },
  btnRow: { display: "flex", gap: "0.75rem" },
  cancelBtn: {
    flex: 1,
    padding: "0.75rem",
    background: "#f1f5f9",
    border: "none",
    borderRadius: "10px",
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
    color: "#64748b",
  },
  saveBtn: {
    flex: 2,
    padding: "0.75rem",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  errorBox: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#dc2626",
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    fontSize: "0.875rem",
    marginBottom: "1rem",
  },
  successBox: {
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    color: "#16a34a",
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    fontSize: "0.875rem",
    marginBottom: "1rem",
  },
};

export default ProfilePage;
