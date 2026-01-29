import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/api/login", {
        email,
        password,
      });

      if (res.status === 200) {
        localStorage.setItem("userId", res.data.userId);
        localStorage.setItem("role", res.data.role);
        navigate("/");
      }
    } catch (err) {
      alert("Invalid email or password");
    }
  }

  return (
    <>
      {/* ===== FULLSCREEN STYLES ===== */}
      <style>{`
        * {
          box-sizing: border-box;
          font-family: 'Poppins', sans-serif;
        }

        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
        }

        .login-page {
          height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;

          /* 🔥 BACKGROUND IMAGE + OVERLAY */
          background:
            linear-gradient(
              rgba(0, 0, 0, 0.45),
              rgba(0, 0, 0, 0.65)
            ),
            url("data:image/jpeg;base64,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");

          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;

          animation: bgZoom 8s ease-in-out infinite alternate;
        }

        @keyframes bgZoom {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(1.03);
          }
        }

        .login-card {
          width: 380px;
          padding: 42px 36px;
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.18);
          backdrop-filter: blur(14px);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.35);
          animation: fadeUp 0.9s ease;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .title {
          text-align: center;
          font-size: 28px;
          font-weight: 600;
          color: #fff;
        }

        .subtitle {
          text-align: center;
          font-size: 14px;
          color: #e0e0e0;
          margin: 6px 0 34px;
        }

        .input-group {
          position: relative;
          margin-bottom: 30px;
        }

        .input-group input {
          width: 100%;
          padding: 12px 0;
          font-size: 16px;
          background: transparent;
          border: none;
          outline: none;
          color: #fff;
        }

        .input-group label {
          position: absolute;
          top: 12px;
          left: 0;
          color: #ccc;
          pointer-events: none;
          transition: 0.4s ease;
        }

        .input-group span {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: #aaa;
          transition: 0.4s ease;
        }

        .input-group input:focus ~ label,
        .input-group input:valid ~ label {
          top: -10px;
          font-size: 12px;
          color: #00ffd5;
        }

        .input-group input:focus ~ span {
          background: #00ffd5;
        }

        .login-btn {
          width: 100%;
          padding: 14px;
          margin-top: 8px;
          border: none;
          border-radius: 30px;
          background: linear-gradient(135deg, #00ffd5, #00bfa6);
          color: #000;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 30px rgba(0, 255, 213, 0.45);
        }

        .login-btn:active {
          transform: scale(0.96);
        }

        .forgot {
          text-align: center;
          margin-top: 22px;
          font-size: 14px;
          color: #eee;
          cursor: pointer;
          transition: 0.3s;
        }

        .forgot:hover {
          color: #00ffd5;
        }

        @media (max-width: 420px) {
          .login-card {
            width: 90%;
          }
        }
      `}</style>

      {/* ===== UI ===== */}
      <div className="login-page">
        <div className="login-card">
          <div className="title">Welcome Back</div>
          <div className="subtitle">Sign in to continue</div>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label>Email</label>
              <span></span>
            </div>

            <div className="input-group">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label>Password</label>
              <span></span>
            </div>

            <button className="login-btn" type="submit">
              Login
            </button>
          </form>

          <div className="forgot">Forgot Password?</div>
        </div>
      </div>
    </>
  );
}
