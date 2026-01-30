import React, { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate, useLocation } from "react-router-dom"
import Swal from "sweetalert2"

function Cart() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [limitMsg, setLimitMsg] = useState("")

  const userId = localStorage.getItem("userId")
  const navigate = useNavigate()
  const location = useLocation()

  /* 🔄 Reload on user / route change */
  useEffect(() => {
    if (!userId) {
      setItems([])
      setLoading(false)
      navigate("/login")
      return
    }

    setItems([])
    setLoading(true)
    fetchCart()

    return () => setItems([])
  }, [location.pathname, userId])

  async function fetchCart() {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/cart",
        { params: { userId } }
      )
      setItems(res.data?.items || [])
      setLoading(false)
    } catch (err) {
Swal.fire({
  title: "Error!",
  text: "Could not fetch cart items!",
  icon: "error"
});
      console.log(err)
      setItems([])
      setLoading(false)
    }
  }

  /* ⚡ FAST OPTIMISTIC UPDATE */
  async function updateQty(productId, delta) {
    setLimitMsg("")

    setItems(prev =>
      prev
        .map(item =>
          item.product._id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter(item => item.quantity > 0)
    )

    try {
      const res = await axios.post(
        "http://localhost:4000/api/cart/add",
        { productId, quantity: delta },
        { params: { userId } }
      )

      if (res.data.limitReached) {
        Swal.fire({
  title: "Limit Reached!",
  text: "Cannot add more of this product!",
  icon: "warning"
});
        setLimitMsg(`Limit reached! Only ${res.data.totalStock} available`)
        fetchCart()
      }
    } catch (err) {
      fetchCart()
    }
  }

  if (loading) {
    return <h2 style={{ textAlign: "center", marginTop: "60px" }}>Loading...</h2>
  }

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your cart is empty 🛒</h2>
        <button onClick={() => navigate("/")}>Go Shopping</button>
        <style>{styles}</style>
      </div>
    )
  }

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>

      {limitMsg && <p className="limit-msg">{limitMsg}</p>}

      <div className="cart-grid">
        {items.map(item => (
          <div key={item.product._id} className="cart-card">
            <h3>{item.product.name}</h3>
            <p>₹ {item.product.price}</p>

            <div className="qty-row">
              <button
                className="qty-btn minus"
                onClick={() => updateQty(item.product._id, -1)}
              >
                −
              </button>

              <span>{item.quantity}</span>

              <button
                className="qty-btn plus"
                onClick={() => updateQty(item.product._id, 1)}
              >
                +
              </button>
            </div>

            <p>Subtotal: ₹ {item.product.price * item.quantity}</p>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>Total: ₹ {total}</h3>
        <button className="checkout-btn">Checkout</button>
      </div>

      <style>{styles}</style>
    </div>
  )
}

export default Cart

/* ================= GLASSMORPHIC CSS ================= */
const styles = `
.cart-page {
  min-height: 100vh;
  padding: 30px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
}

.cart-grid {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.cart-card {
  width: 260px;
  padding: 18px;
  border-radius: 16px;
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(14px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.25);
}

.qty-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.qty-btn {
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
}

.qty-btn.minus { background: #ff4d4d; }
.qty-btn.plus { background: #4caf50; }

.cart-summary {
  margin-top: 30px;
  padding: 20px;
  border-radius: 16px;
  background: rgba(0,0,0,0.3);
  display: flex;
  justify-content: space-between;
}

.checkout-btn {
  padding: 10px 22px;
  border-radius: 12px;
  border: none;
  background: #00e5ff;
  font-weight: bold;
}

.limit-msg {
  color: #ffeb3b;
  margin-bottom: 15px;
}

.cart-empty {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
`
