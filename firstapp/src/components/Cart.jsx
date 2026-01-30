import React, { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function Cart() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()
  const userId = localStorage.getItem("userId")

  useEffect(() => {
    if (!userId) {
      alert("Please login to view cart")
      navigate("/login")
      return
    }
    fetchCart()
  }, [])

  // Fetch cart items for logged-in user
  async function fetchCart() {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/cart",
        { params: { userId } }
      )

      setItems(res.data?.items || [])
      setLoading(false)
    } catch (err) {
      console.log("Error fetching cart", err)
      setLoading(false)
    }
  }

  // Increase quantity
  async function increaseQty(productId) {
    try {
      await axios.post(
        "http://localhost:4000/api/cart/add",
        { productId, quantity: 1 },
        { params: { userId } }
      )
      fetchCart()
    } catch (err) {
      console.log("Error increasing quantity", err)
    }
  }

  // Decrease quantity (min = 1)
  async function decreaseQty(productId, qty) {
    if (qty <= 1) return

    try {
      await axios.post(
        "http://localhost:4000/api/cart/add",
        { productId, quantity: -1 },
        { params: { userId } }
      )
      fetchCart()
    } catch (err) {
      console.log("Error decreasing quantity", err)
    }
  }

  if (loading) return <h2>Loading cart...</h2>

  if (items.length === 0) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate("/")}>
          Go Shopping
        </button>
      </div>
    )
  }

  // Calculate total price
  const totalAmount = items.reduce(
    (sum, item) =>
      sum + item.product.price * item.quantity,
    0
  )

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Cart</h2>

      {/* Same grid style as Home.jsx */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {items.map((item) => (
          <div
            key={item.product._id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              width: "250px"
            }}
          >
            <h3>{item.product.name}</h3>
            <p>₹ {item.product.price}</p>

            {/* Quantity Controls */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "10px"
              }}
            >
              <button
                disabled={item.quantity <= 1}
                onClick={() =>
                  decreaseQty(item.product._id, item.quantity)
                }
              >
                −
              </button>

              <strong>{item.quantity}</strong>

              <button
                onClick={() => increaseQty(item.product._id)}
              >
                +
              </button>
            </div>

            <p style={{ marginTop: "10px" }}>
              Subtotal: ₹{" "}
              {item.product.price * item.quantity}
            </p>
          </div>
        ))}
      </div>

      <hr style={{ margin: "20px 0" }} />

      <h3>Total Amount: ₹ {totalAmount}</h3>

      <button
        style={{ marginTop: "10px", padding: "8px 15px" }}
        onClick={() => alert("Checkout coming soon 🚀")}
      >
        Checkout
      </button>
    </div>
  )
}

export default Cart
