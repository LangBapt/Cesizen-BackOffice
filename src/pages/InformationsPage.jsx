import { useEffect, useState } from "react";
import api from "../api/axiosInstance";

const emptyForm = { title: "", description: "", content: "", category: "", status: true };

const InformationsPage = () => {
  const [infos, setInfos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [msg, setMsg] = useState("");

  const load = async () => {
    const res = await api.get("/informations");
    setInfos(res.data);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (info) => { setEditing(info.id); setForm({ title: info.title, description: info.description, content: info.content, category: info.category, status: info.status }); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/informations/${editing}`, form);
        setMsg("Information mise à jour !");
      } else {
        await api.post("/informations", form);
        setMsg("Information créée !");
      }
      setShowModal(false);
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || "Erreur.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette information ?")) return;
    await api.delete(`/informations/${id}`);
    load();
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2 style={{ color: "#01bf60" }}>📰 Gestion des Informations</h2>
        <button className="btn btn-primary" onClick={openCreate}>+ Créer</button>
      </div>
      {msg && <p className="success-msg">{msg}</p>}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table>
          <thead><tr><th>Titre</th><th>Catégorie</th><th>Date</th><th>Statut</th><th>Actions</th></tr></thead>
          <tbody>
            {infos.map(info => (
              <tr key={info.id}>
                <td>{info.title}</td>
                <td>{info.category}</td>
                <td>{new Date(info.publicationDate).toLocaleDateString("fr-FR")}</td>
                <td><span className={`badge ${info.status ? "badge-active" : "badge-inactive"}`}>{info.status ? "Publié" : "Masqué"}</span></td>
                <td>
                  <button className="btn btn-primary" onClick={() => openEdit(info)}>Modifier</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(info.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editing ? "Modifier l'information" : "Créer une information"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Titre</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
              <div className="form-group"><label>Catégorie</label><input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required /></div>
              <div className="form-group"><label>Description courte</label><input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required /></div>
              <div className="form-group"><label>Contenu complet</label><textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required /></div>
              <div className="form-group"><label>Statut</label>
                <select value={form.status.toString()} onChange={e => setForm({ ...form, status: e.target.value === "true" })}>
                  <option value="true">Publié</option>
                  <option value="false">Masqué</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                <button type="submit" className="btn btn-primary">{editing ? "Mettre à jour" : "Créer"}</button>
                <button type="button" className="btn" onClick={() => setShowModal(false)} style={{ background: "#e2e8f0" }}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InformationsPage;