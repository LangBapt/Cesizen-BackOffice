import { useEffect, useState } from "react";
import api from "../api/axiosInstance";

const emptyForm = { title: "", description: "", duration: "", instructions: "" };

const ExercisesPage = () => {
  const [exercises, setExercises] = useState([]);
  const [phases, setPhases] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [exercisePhases, setExercisePhases] = useState([{ respirationPhaseId: "", phaseOrder: 1, durationSeconds: "" }]);
  const [msg, setMsg] = useState("");

  const load = async () => {
    const [exos, ph] = await Promise.all([api.get("/exercises"), api.get("/exercises/phases")]);
    setExercises(exos.data);
    setPhases(ph.data);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setExercisePhases([{ respirationPhaseId: "", phaseOrder: 1, durationSeconds: "" }]);
    setShowModal(true);
  };

  const openEdit = (ex) => {
    setEditing(ex.id);
    setForm({ title: ex.title, description: ex.description, duration: ex.duration, instructions: ex.instructions });
    setExercisePhases(ex.composes.map(c => ({ respirationPhaseId: c.respirationPhaseId, phaseOrder: c.phaseOrder, durationSeconds: c.durationSeconds })));
    setShowModal(true);
  };

  const addPhaseRow = () => setExercisePhases([...exercisePhases, { respirationPhaseId: "", phaseOrder: exercisePhases.length + 1, durationSeconds: "" }]);
  const removePhaseRow = (i) => setExercisePhases(exercisePhases.filter((_, idx) => idx !== i));
  const updatePhaseRow = (i, field, val) => setExercisePhases(exercisePhases.map((p, idx) => idx === i ? { ...p, [field]: val } : p));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, duration: parseInt(form.duration), phases: exercisePhases };
    try {
      if (editing) {
        await api.put(`/exercises/${editing}`, payload);
        setMsg("Exercice mis à jour !");
      } else {
        await api.post("/exercises", payload);
        setMsg("Exercice créé !");
      }
      setShowModal(false);
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || "Erreur.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet exercice ?")) return;
    await api.delete(`/exercises/${id}`);
    load();
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2 style={{ color: "#01bf60" }}>🫁 Gestion des Exercices de Respiration</h2>
        <button className="btn btn-primary" onClick={openCreate}>+ Créer</button>
      </div>
      {msg && <p className="success-msg">{msg}</p>}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table>
          <thead><tr><th>Titre</th><th>Durée (s)</th><th>Phases</th><th>Actions</th></tr></thead>
          <tbody>
            {exercises.map(ex => (
              <tr key={ex.id}>
                <td>{ex.title}</td>
                <td>{ex.duration}s</td>
                <td>{ex.composes.map(c => `${c.respirationPhase.respirationPhaseName} (${c.durationSeconds}s)`).join(" → ")}</td>
                <td>
                  <button className="btn btn-primary" onClick={() => openEdit(ex)}>Modifier</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(ex.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editing ? "Modifier l'exercice" : "Créer un exercice"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Titre</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
              <div className="form-group"><label>Description</label><input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required /></div>
              <div className="form-group"><label>Durée totale (secondes)</label><input type="number" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} required /></div>
              <div className="form-group"><label>Instructions</label><textarea value={form.instructions} onChange={e => setForm({ ...form, instructions: e.target.value })} required /></div>
              <div className="form-group">
                <label>Phases de respiration</label>
                {exercisePhases.map((p, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", alignItems: "center" }}>
                    <select value={p.respirationPhaseId} onChange={e => updatePhaseRow(i, "respirationPhaseId", e.target.value)} required style={{ flex: 2 }}>
                      <option value="">Phase...</option>
                      {phases.map(ph => <option key={ph.id} value={ph.id}>{ph.respirationPhaseName}</option>)}
                    </select>
                    <input type="number" placeholder="Durée(s)" value={p.durationSeconds} onChange={e => updatePhaseRow(i, "durationSeconds", e.target.value)} required style={{ flex: 1 }} />
                    <button type="button" className="btn btn-danger" onClick={() => removePhaseRow(i)}>✕</button>
                  </div>
                ))}
                <button type="button" className="btn btn-success" onClick={addPhaseRow} style={{ marginTop: "0.3rem" }}>+ Ajouter une phase</button>
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

export default ExercisesPage;