import { useEffect, useState } from "react";
import api from "../api/axiosInstance";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "USER" });
  const [msg, setMsg] = useState("");

  const load = async () => {
    const res = await api.get("/users");
    setUsers(res.data);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/users", form);
      setMsg("Utilisateur créé !");
      setShowModal(false);
      setForm({ username: "", email: "", password: "", role: "USER" });
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || "Erreur.");
    }
  };

  const toggleActivation = async (id) => {
    await api.put(`/users/${id}/toggle`);
    load();
  };

  const changeRole = async (id, role) => {
    await api.put(`/users/${id}/role`, { role });
    load();
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    await api.delete(`/users/${id}`);
    load();
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2 style={{ color: "#01bf60" }}>👥 Gestion des Utilisateurs</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Créer un utilisateur</button>
      </div>
      {msg && <p className="success-msg">{msg}</p>}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table>
          <thead>
            <tr><th>Username</th><th>Email</th><th>Rôle</th><th>Statut</th><th>Créé le</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td><span className={`badge badge-${u.role.toLowerCase()}`}>{u.role}</span></td>
                <td><span className={`badge ${u.activated ? "badge-active" : "badge-inactive"}`}>{u.activated ? "Actif" : "Inactif"}</span></td>
                <td>{new Date(u.createdAt).toLocaleDateString("fr-FR")}</td>
                <td>
                  <button className="btn btn-warning" onClick={() => toggleActivation(u.id)}>
                    {u.activated ? "Désactiver" : "Activer"}
                  </button>
                  <button className="btn btn-primary" onClick={() => changeRole(u.id, u.role === "ADMIN" ? "USER" : "ADMIN")}>
                    {u.role === "ADMIN" ? "→ USER" : "→ ADMIN"}
                  </button>
                  <button className="btn btn-danger" onClick={() => deleteUser(u.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Créer un utilisateur</h3>
            <form onSubmit={handleCreate}>
              <div className="form-group"><label>Username</label><input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required /></div>
              <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div>
              <div className="form-group"><label>Mot de passe</label><input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required /></div>
              <div className="form-group"><label>Rôle</label>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                <button type="submit" className="btn btn-primary">Créer</button>
                <button type="button" className="btn" onClick={() => setShowModal(false)} style={{ background: "#e2e8f0" }}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;