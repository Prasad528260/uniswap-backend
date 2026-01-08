import Book from "../models/book.js";
import Order from "../models/order.js";
import mongoose from "mongoose";

// * Get Pending Orders of Seller
export const getOrders = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      console.log("ERROR : USER NOT FOUND");
      return res.status(400).json({ message: "User Not Found" });
    }
    const orders = await Order.find({
      sellerId: user._id,
      status: "pending",
    })
      .populate("sellerId", "firstName lastName _id department profilePicture")
      .populate("productId", "title author _id bookImg");
    if (!orders) {
      console.log("ERROR : ORDERS NOT FOUND");
      return res.status(400).json({ message: "Orders Not Found" });
    }
    res.status(200).json(orders);
  } catch (error) {
    console.log("ERROR : GET ACCEPTED REQUEST FAILED", error.message);
    return res.status(400).json({ message: "Get Accepted Request Failed" });
  }
};

// * Get Completed Orders of Seller
export const getCompletedOrders = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      console.log("ERROR : USER NOT FOUND");
      return res.status(400).json({ message: "User Not Found" });
    }
    const orders = await Order.find({
      sellerId: user._id,
      status: "completed",
    })
      .populate("sellerId", "firstName lastName _id department profilePicture")
      .populate("productId", "title author _id bookImg");
    if (!orders) {
      console.log("ERROR : ORDERS NOT FOUND");
      return res.status(400).json({ message: "Orders Not Found" });
    }
    res.status(200).json(orders);
  } catch (error) {
    console.log("ERROR : GET ACCEPTED REQUEST FAILED", error.message);
    return res.status(400).json({ message: "Get Accepted Request Failed" });
  }
};

// * complete order
export const completeOrder = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      console.log("ERROR : USER NOT FOUND");
      return res.status(400).json({ message: "User Not Found" });
    }
    const orderId = req.params.orderId;
    const objctOrderId = new mongoose.Types.ObjectId(orderId);
    if (!mongoose.Types.ObjectId.isValid(objctOrderId)) {
      return res.status(400).json({ message: "Invalid Order ID" });
    }
    const order = await Order.findOneAndUpdate(
      { _id: objctOrderId, sellerId: user._id, status: "pending" },
      { status: "completed" },
      { new: true }
    );
    if (!order) {
      console.log("ERROR : ORDER NOT FOUND");
      return res.status(400).json({ message: "Order Not Found" });
    }
    const book = await Book.findOneAndUpdate(
      { _id: order.productId },
      { status: "sold" },
      { new: true }
    );
    if (!book) {
      console.log("ERROR : BOOK NOT FOUND");
      return res.status(400).json({ message: "Book Not Found" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.log("ERROR : COMPLETE ORDER FAILED", error.message);
    return res.status(400).json({ message: "Complete Order Failed" });
  }
};

// * Get Pending Orders of Reciever
export const getRecieverOrders = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      console.log("ERROR : USER NOT FOUND");
      return res.status(400).json({ message: "User Not Found" });
    }
    const orders = await Order.find({
      recieverId: user._id,
      status: "pending",
    })
      .populate("sellerId", "firstName lastName _id department profilePicture")
      .populate(
        "productId",
        "title author _id bookImg subject condition price semester category description bookImg"
      );
    if (!orders) {
      console.log("ERROR : ORDERS NOT FOUND");
      return res.status(400).json({ message: "Orders Not Found" });
    }
    res.status(200).json(orders);
  } catch (error) {
    console.log("ERROR : GET ACCEPTED REQUEST FAILED", error.message);
    return res.status(400).json({ message: "Get Accepted Request Failed" });
  }
};

// * Get Completed Orders of Reciever
export const getRecieverCompletedOrders = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      console.log("ERROR : USER NOT FOUND");
      return res.status(400).json({ message: "User Not Found" });
    }
    const orders = await Order.find({
      recieverId: user._id,
      status: "completed",
    })
      .populate("sellerId", "firstName lastName _id department profilePicture")
      .populate("productId", "title author _id bookImg");
    if (!orders) {
      console.log("ERROR : ORDERS NOT FOUND");
      return res.status(400).json({ message: "Orders Not Found" });
    }
    res.status(200).json(orders);
  } catch (error) {
    console.log("ERROR : GET ACCEPTED REQUEST FAILED", error.message);
    return res.status(400).json({ message: "Get Accepted Request Failed" });
  }
};

// * Get History
export const getHistory = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      console.log("ERROR : USER NOT FOUND");
      return res.status(400).json({ message: "User Not Found" });
    }
    const orders = await Order.find({
      $or: [{ sellerId: user._id }, { recieverId: user._id }],
      status: "completed",
    })
      .populate("sellerId", "firstName lastName _id department profilePicture")
      .populate("productId", "title author _id bookImg")
      .populate(
        "recieverId",
        "firstName lastName _id department profilePicture"
      );
    if (!orders) {
      console.log("ERROR : ORDERS NOT FOUND");
      return res.status(400).json({ message: "Orders Not Found" });
    }
    res.status(200).json(orders);
  } catch (error) {
    console.log("ERROR : GET ACCEPTED REQUEST FAILED", error.message);
    return res.status(400).json({ message: "Get Accepted Request Failed" });
  }
};
