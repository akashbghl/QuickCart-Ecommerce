import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/user";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export const inngest = new Inngest({ id: "quickcart-next" });

// Inngest function to CREATE user
export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const {
      id,
      first_name = "",
      last_name = "",
      image_url = "",
      email_addresses = [],
    } = event.data;

    const userData = {
      _id: id,
      name: `${first_name} ${last_name}`.trim(),
      email: email_addresses[0]?.email_address || "",
      imageURL: image_url,
    };

    await connectDB();
    await User.create(userData);
  }
);

// Inngest function to UPDATE user
export const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const {
      id,
      first_name = "",
      last_name = "",
      image_url = "",
      email_addresses = [],
    } = event.data;

    const userData = {
      name: `${first_name} ${last_name}`.trim(),
      email: email_addresses[0]?.email_address || "",
      imageURL: image_url,
    };

    await connectDB();
    await User.findByIdAndUpdate(id, userData);
  }
);

// Inngest function to DELETE user
export const syncUserDeletion = inngest.createFunction(
  { id: "user-delete-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;
    await connectDB();
    await User.findByIdAndDelete(id);
  }
);

// Inngest Function to create user's Order in Database

export const createUserOrder = inngest.createFunction(
  {id: 'create-user-order',
    batchEvents:{
      maxSize: 5,
      timeout: '5s'
    }
  },
  {event: 'order/created'},
  async({events})=>{
    const orders = events.map((event)=>{
      return{
        userId: event.data.userId,
        items: event.data.items,
        amount: event.data.amount,
        address: event.data.address,
        date: event.data.date,
      }
    })
    await connectDB()
    await Order.insertMany(orders)

    return NextResponse.json({success: true , processed: orders.length})
  }
)