import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/user";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

// Inngest Function to save the userData to database

export const syncUSerCreation = inngest.createFunction(
    {
        id: 'sync-user-from-clerk'
    },
    {event: 'clerk/user.created'},
    async ({event}) => {
        const {id, first_name ,last_name , image_url, email_address} = event.data
        const userData = {
            _id : id,
            name: first_name + ' ' + last_name,
            email: email_address[0].email_address,
            imageURL: image_url,
        }
        await connectDB();
        await User.create(userData);
    }
)

// Inngest function to Update the user data in database

export const syncUserUpdation = inngest.createFunction(
    {
        id: 'udate-user-from-clerk'
    },
    {event: 'clerk/userAgent.updated'},
    async ({event}) => {
        const {id, first_name ,last_name , image_url, email_address} = event.data
        const userData = {
            _id : id,
            name: first_name + ' ' + last_name,
            email: email_address[0].email_address,
            imageURL: image_url,
        }
        await connectDB();
        await User.findByIdAndUpdate(id,userData);
    }
)

// Inngest Function delete user from database

export const syncUserDeletion = inngest.createFunction(
    {id: 'user-delete-with-clerk'},
    {event: 'clerk/user.deleted'},
    async (event) => {
        const {id} = event.data
        await connectDB()
        await User.findByIdAndDelete(id)
    }
)