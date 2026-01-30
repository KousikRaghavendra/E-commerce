import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Navigation() {
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("role");

  function handleLogout() {
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    navigate("/login");
  }

  return (
    <>
      {/* ===== NAVBAR STYLES ===== */}
      <style>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 32px;
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(16px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }

        .nav-left {
          font-size: 22px;
          font-weight: 600;
          text-decoration: none;
          color: #222;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 22px;
        }

        .nav-link {
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          color: #222;
          position: relative;
          transition: 0.3s;
        }

        .nav-link::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -4px;
          width: 0;
          height: 2px;
          background: linear-gradient(135deg, #00ffd5, #00bfa6);
          transition: width 0.3s;
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .logout-btn {
          border: none;
          padding: 8px 18px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          background: linear-gradient(135deg, #ff5f6d, #ffc371);
          color: #000;
          transition: 0.3s;
        }

        .logout-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 18px rgba(255, 95, 109, 0.4);
        }

        @media (max-width: 600px) {
          .navbar {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>

      {/* ===== NAVBAR UI ===== */}
      <nav className="navbar">
        <Link to="/" className="nav-left">
          MyStore
        </Link>

        <div className="nav-right">
          <Link to="/" className="nav-link">Home</Link>

          {userId ? (
            <>
              {userRole === "admin" ? (
                <>
                  <Link to="/add-product" className="nav-link">
                    Add Product
                  </Link>
                  <button className="logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/cart" className="nav-link">
                    Cart
                  </Link>
                  <button className="logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
