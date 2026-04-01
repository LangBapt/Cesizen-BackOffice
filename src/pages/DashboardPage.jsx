import { useEffect, useState } from "react";
import api from "../api/axiosInstance";

const DashboardPage = () => {
  const [stats, setStats] = useState({ users: 0, infos: 0, exercises: 0 });

  useEffect(() => {
    const load = async () => {
      const [users, infos, exos] = await Promise.all([
        api.get("/users"),
        api.get("/informations"),
        api.get("/exercises"),
      ]);
      setStats({ users: users.data.length, infos: infos.data.length, exercises: exos.data.length });
    };
    load();
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: "1.5rem", color: "#2c7a7b" }}>Tableau de bord</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="number">{stats.users}</div>
          <div className="label">👥 Utilisateurs</div>
        </div>
        <div className="stat-card">
          <div className="number">{stats.infos}</div>
          <div className="label">📰 Informations</div>
        </div>
        <div className="stat-card">
          <div className="number">{stats.exercises}</div>
          <div className="label">🫁 Exercices</div>
        </div>
      </div>
      <div className="card">
        <h2>Bienvenue sur CESIZen Admin</h2>
        <p style={{ color: "#718096", marginTop: "0.5rem" }}>
          Gérez les utilisateurs, les contenus d'information sur la santé mentale et les exercices de respiration depuis ce panneau d'administration.
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;