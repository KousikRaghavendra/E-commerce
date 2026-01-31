import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");

  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();

    const newUser = {
      name,
      email,
      password,
      mobile: Number(mobile),
      address,
    };

    try {
      const res = await axios.post(
        "https://e-commerce-ych6.onrender.com/api/create-user",
        newUser
      );

      if (res.data.status === 201) {
        Swal.fire({
  title: "Success!",
  text: "Registration successful! Please login.",
  icon: "success"
});
        navigate("/login");
      }
    } catch (err) {
      Swal.fire({
  title: "Error!",
  text: "Registration failed!",
  icon: "error"
});
    }
  }

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
          font-family: 'Poppins', sans-serif;
        }

        body, html {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
        }

        .register-page {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100vh;
          background: linear-gradient(135deg, #5f2c82, #49a09d);
          background-size: 200% 200%;
          animation: bgAnim 8s ease infinite alternate;
        }

        @keyframes bgAnim {
          0% { background-position: left; }
          100% { background-position: right; }
        }

        .register-card {
          width: 380px;
          padding: 40px;
          border-radius: 20px;
          backdrop-filter: blur(14px);
          background: rgba(255, 255, 255, 0.15);
          box-shadow: 0 25px 60px rgba(0,0,0,0.3);
          animation: cardSlide 0.8s ease;
        }

        @keyframes cardSlide {
          from { transform: translateY(40px); opacity: 0 }
          to { transform: translateY(0); opacity: 1 }
        }

        .title {
          text-align: center;
          font-size: 28px;
          font-weight: 600;
          color: #fff;
          margin-bottom: 8px;
        }

        .subtitle {
          text-align: center;
          font-size: 14px;
          color: #ddd;
          margin-bottom: 30px;
        }

        .input-group {
          position: relative;
          margin-bottom: 25px;
        }

        .input-group input {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          padding: 12px 0;
          font-size: 16px;
          color: #fff;
        }

        .input-group label {
          position: absolute;
          left: 0;
          top: 12px;
          color: #ccc;
          pointer-events: none;
          transition: 0.4s;
        }

        .input-group span {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: #aaa;
          transition: 0.4s;
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

        .register-btn {
          width: 100%;
          padding: 14px;
          border-radius: 30px;
          border: none;
          background: linear-gradient(135deg, #00ffd5, #00bfa6);
          color: #000;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s ease;
        }

        .register-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0,255,213,0.4);
        }

        .register-btn:active {
          transform: scale(0.97);
        }

        .login-link {
          text-align: center;
          margin-top: 16px;
          color: #eee;
          font-size: 14px;
          cursor: pointer;
          transition: 0.3s;
        }

        .login-link:hover {
          color: #00ffd5;
        }
      `}</style>

      <div className="register-page">
        <div className="register-card">
          <div className="title">Create Account</div>
          <div className="subtitle">Sign up to get started</div>

          <form onSubmit={handleRegister}>
            <div className="input-group">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label>Name</label>
              <span></span>
            </div>

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

            <div className="input-group">
              <input
                type="text"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
              <label>Mobile</label>
              <span></span>
            </div>

            <div className="input-group">
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <label>Address</label>
              <span></span>
            </div>

            <button className="register-btn" type="submit">
              Register
            </button>
          </form>

          <div
            className="login-link"
            onClick={() => navigate("/login")}
          >
            Already have an account? Login
          </div>
        </div>
      </div>
    </>
  );
}
