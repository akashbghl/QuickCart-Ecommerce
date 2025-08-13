import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/user";

export const inngest = new Inngest({ id: "quickcart-next" });

// CREATE user
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

// UPDATE user
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

// DELETE user
export const syncUserDeletion = inngest.createFunction(
  { id: "user-delete-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;
    await connectDB();
    await User.findByIdAndDelete(id);
  }
);
