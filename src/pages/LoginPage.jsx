import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logoImg from '../assets/cesizen-logo.png';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Erreur de connexion.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <img 
        src={logoImg} 
        alt="Logo CESIZen" 
        style={styles.logo} 
      />
        <p style={{ textAlign: "center", color: "#718096", marginBottom: "1.5rem" }}>Interface Administrateur</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "0.8rem", marginTop: "0.5rem", fontSize: "1rem" }}>
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  logo: {
    width: '300px',         
    height: 'auto',            
  }
};

export default LoginPage;