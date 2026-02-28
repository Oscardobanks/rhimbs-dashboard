import { db, auth } from "@/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

export enum UserRole {
  SUPERADMIN = "superadmin",
  ADMIN = "admin",
  PRESIDENT = "president",
  LECTURER = "lecturer",
  DIRECTOR = "director",
}

export const getCurrentUserRole = async (): Promise<UserRole | null> => {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;
  const adminEmail = process.env.NEXT_DEFAULT_ADMIN_EMAIL

  // Check if user exists in Firestore
  const userDoc = await getDoc(doc(db, "Users", currentUser.uid));

  // If user is not in Firestore, assign ADMIN role
  if(!userDoc.exists() && currentUser.email === adminEmail) {
    return UserRole.SUPERADMIN;
  }

  // For users in Firestore, return their stored role
  return userDoc?.data()?.role as UserRole;
};
