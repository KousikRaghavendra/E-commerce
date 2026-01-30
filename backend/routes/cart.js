const express = require("express")
const router = express.Router()

const Cart = require("../models/Cart")
const Product = require("../models/Product")

/* ================= AUTH ================= */
const isAuthenticated = (req, res, next) => {
  const userId = req.query.userId
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" })
  }
  req.userId = userId
  next()
}

/* ================= GET CART ================= */
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const cart = await Cart
      .findOne({ user: req.userId })
      .populate("items.product")

    if (!cart) {
      return res.status(200).json({ items: [] })
    }

    return res.status(200).json(cart)
  } catch (err) {
    console.log("fetch cart error", err)
    return res.status(500).json({ message: "Server error" })
  }
})

/* ================= ADD / UPDATE CART ================= */
router.post("/add", isAuthenticated, async (req, res) => {
  const { productId, quantity } = req.body

  try {
    let cart = await Cart.findOne({ user: req.userId })
    if (!cart) {
      cart = new Cart({ user: req.userId, items: [] })
    }

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    const totalStock = product.stock
    let limitReached = false

    const existingItem = cart.items.find(
      item => item.product.toString() === productId
    )

    if (existingItem) {
      existingItem.quantity += quantity

      if (existingItem.quantity > totalStock) {
        existingItem.quantity = totalStock
        limitReached = true
      }

      if (existingItem.quantity < 1) {
        existingItem.quantity = 1
      }
    } else {
      if (quantity > totalStock) {
        limitReached = true
      }

      cart.items.push({
        product: productId,
        quantity: Math.min(quantity, totalStock)
      })
    }

    await cart.save()

    const finalQty =
      cart.items.find(i => i.product.toString() === productId)?.quantity || 0

    return res.status(200).json({
      message: limitReached ? "Stock limit reached" : "Added to cart",
      limitReached,
      totalStock,
      currentInCart: finalQty,
      remaining: Math.max(totalStock - finalQty, 0)
    })
  } catch (err) {
    console.log("cart update error", err)
    return res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
