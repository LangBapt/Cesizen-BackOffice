import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  return (
    <div className="navbar">
      <h1>🧘 CESIZen Admin</h1>
      {user && (
        <nav>
          <Link to="/">Dashboard</Link>
          <Link to="/users">Utilisateurs</Link>
          <Link to="/informations">Informations</Link>
          <Link to="/exercises">Exercices</Link>
          <button onClick={logout} style={{ marginLeft: "1.5rem" }}>Déconnexion</button>
        </nav>
      )}
    </div>
  );
};

export default Navbar;