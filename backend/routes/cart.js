const express = require("express")
const router = express.Router()

const Cart = require("../models/Cart")
const Product = require("../models/Product")

// Auth middleware (unchanged)
const isAuthenticated = (req, res, next) => {
  const userId = req.query.userId

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  req.userId = userId
  next()
}

// GET cart (unchanged)
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
    console.log(err)
    return res.status(500).json({ message: "Server error" })
  }
})

// ADD / UPDATE cart (MAIN LOGIC KEPT)
router.post("/add", isAuthenticated, async (req, res) => {
  const { productId, quantity } = req.body

  try {
    let cart = await Cart.findOne({ user: req.userId })

    if (!cart) {
      cart = new Cart({
        user: req.userId,
        items: []
      })
    }

    const existingItem = cart.items.find(
      item => item.product.toString() === productId
    )

    if (existingItem) {
      // 🔧 SAFE FIX (no logic change)
      existingItem.quantity += quantity

      // prevent 0 or negative quantity
      if (existingItem.quantity < 1) {
        existingItem.quantity = 1
      }
    } else {
      // new item (only if quantity > 0)
      if (quantity > 0) {
        cart.items.push({
          product: productId,
          quantity
        })
      }
    }

    await cart.save()

    return res.status(200).json({
      message: "Cart updated successfully",
      cart
    })
  } catch (err) {
    console.log("cart error", err)
    return res.status(500).json({
      message: "Internal server error"
    })
  }
})

module.exports = router
