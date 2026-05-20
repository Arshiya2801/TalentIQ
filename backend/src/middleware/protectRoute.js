import { requireAuth, clerkClient } from "@clerk/express";
import User from "../models/User.js";
import { upsertStreamUser } from "../lib/stream.js";

export const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      console.log(`[protectRoute] Auth object:`, req.auth);
      // FIX: req.auth is an object in the new @clerk/express SDK
      const clerkId = req.auth?.userId;
      console.log(`[protectRoute] Parsed clerkId: ${clerkId}`);

      if (!clerkId) {
        console.log(`[protectRoute] No clerkId found, sending 401.`);
        return res.status(401).json({ message: "Unauthorized - invalid token" });
      }

      // Find user in db by clerk ID
      let user = await User.findOne({ clerkId });
      console.log(`[protectRoute] Found user in DB:`, user ? user._id : 'null');

      // Fallback: If user is not found (because Inngest webhooks couldn't run locally), 
      // fetch their identity from Clerk and create the user directly.
      if (!user) {
        console.log(`User not found in DB. Automatically fetching from Clerk for ID: ${clerkId}`);
        try {
          const clerkUser = await clerkClient.users.getUser(clerkId);
          
          if (!clerkUser) {
            return res.status(404).json({ message: "User not found in Clerk" });
          }

          const newUser = {
            clerkId,
            email: clerkUser.emailAddresses[0]?.emailAddress,
            name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
            profileImage: clerkUser.imageUrl || "",
          };

          // Save to local MongoDB
          user = await User.create(newUser);
          console.log("Local User created via fallback system.");

          // Sync with Stream (Video & Chat)
          await upsertStreamUser({
            id: clerkId,
            name: newUser.name,
            image: newUser.profileImage,
          });
          console.log("Stream User synced via fallback system.");
          
        } catch (syncError) {
          console.error("Error syncing missing user from Clerk:", syncError);
          return res.status(500).json({ message: "Failed to sync user data" });
        }
      }

      // attach user to req
      req.user = user;

      next();
    } catch (error) {
      console.error("Error in protectRoute middleware", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
];
