'use client';
import React, { useEffect, useState, useRef } from 'react';
import { auth, db } from '@/firebase/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { FaPen } from 'react-icons/fa';
import { useToast } from '../hooks/useToast';
import DashboardLayout from '../components/DashboardLayout';
import CryptoJS from 'crypto-js';

const ProfilePage = () => {
    const [user, setUser] = useState<Record<string, any>>({});
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isFormChanged, setIsFormChanged] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { showToast } = useToast();

    // Cloudinary configuration
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || "";
    const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    const userDoc = await getDoc(doc(db, "Users", currentUser.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUser({ ...userData, uid: currentUser.uid, email: currentUser.email });
                        setFormData({ ...userData, uid: currentUser.uid, email: currentUser.email });
                    } else {
                        // Handle admin user or user without Firestore document
                        setUser({
                            uid: currentUser.uid,
                            email: currentUser.email,
                            displayName: currentUser.displayName || "",
                            photoURL: currentUser.photoURL || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
                            role: "Admin"
                        });
                        setFormData({
                            uid: currentUser.uid,
                            email: currentUser.email,
                            displayName: currentUser.displayName || "",
                            photoURL: currentUser.photoURL || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
                            role: "Admin"
                        });
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    showToast({
                        type: "error",
                        message: "Failed to load user profile.",
                    });
                } finally {
                    setIsLoading(false);
                }
            } else {
                // Redirect to login if not authenticated
                window.location.href = '/login';
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        // Check if form data has changed from original user data
        if (JSON.stringify(user) !== JSON.stringify(formData)) {
            setIsFormChanged(true);
        } else {
            setIsFormChanged(false);
        }
    }, [formData, user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleProfileImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUpdating(true);

            // Create a FormData object to upload to Cloudinary
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', uploadPreset);
            formData.append('folder', `profile_images/${user.uid}`);

            // Generate timestamp and signature for Cloudinary (if using signed uploads)
            const timestamp = Math.floor(Date.now() / 1000);
            const signature = CryptoJS.SHA1(`folder=profile_images/${user.uid}&timestamp=${timestamp}${apiSecret}`).toString();

            formData.append('api_key', apiKey);
            formData.append('timestamp', timestamp.toString());
            formData.append('signature', signature);

            // Upload to Cloudinary
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.secure_url) {
                // Update the photoURL in formData
                setFormData((prev) => ({ ...prev, photoURL: data.secure_url }));

                showToast({
                    type: "success",
                    message: "Profile image uploaded successfully. Click Update to save changes.",
                });
            } else {
                throw new Error(data.error?.message || 'Failed to upload image');
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            showToast({
                type: "error",
                message: "Failed to upload profile image.",
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const handlePasswordChange = async () => {
        if (!auth.currentUser) return;

        if (newPassword !== confirmPassword) {
            setPasswordError("New passwords don't match");
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError("Password must be at least 6 characters");
            return;
        }

        try {
            setIsPasswordUpdating(true);
            // Re-authenticate the user
            const credential = EmailAuthProvider.credential(
                auth.currentUser.email!,
                currentPassword
            );

            await reauthenticateWithCredential(auth.currentUser, credential);

            // Update the password
            await updatePassword(auth.currentUser, newPassword);

            showToast({
                type: "success",
                message: "Password updated successfully.",
            });

            // Clear password fields
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setPasswordError('');
        } catch (error: any) {
            console.error("Error updating password:", error);
            if (error.code === 'auth/wrong-password') {
                setPasswordError("Current password is incorrect");
            } else {
                setPasswordError(error.message || "Failed to update password");
            }
            showToast({
                type: "error",
                message: "Failed to update password.",
            });
        } finally {
            setIsPasswordUpdating(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isFormChanged) return;

        try {
            setIsUpdating(true);

            // Update user document in Firestore
            const userRef = doc(db, "Users", user?.uid);

            // Create an object with only the fields that should be updated
            const updateData: Record<string, any> = {};

            // Add fields that exist in the original user data
            for (const key in formData) {
                if (key !== 'uid' && key !== 'email' && key !== 'role' && formData[key] !== user[key]) {
                    updateData[key] = formData[key];
                }
            }

            if (Object.keys(updateData).length > 0) {
                await updateDoc(userRef, updateData);
            }

            // Update local user state
            setUser(formData);

            showToast({
                type: "success",
                message: "Profile updated successfully.",
            });
        } catch (error) {
            console.error("Error updating profile:", error);
            showToast({
                type: "error",
                message: "Failed to update profile.",
            });
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout active="Profile">
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout active="Profile">
            <div className="container mx-auto py-8 px-4">
                <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold mb-6 text-primary-700">My Profile</h1>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Profile Image Section */}
                        <div className="flex flex-col items-center">
                            <div className="relative z-0">
                                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-primary-100">
                                    <img
                                        src={formData.photoURL || "/assets/images/default user.png"}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <button
                                    onClick={handleProfileImageClick}
                                    className="absolute bottom-2 right-2 border-4 border-primary-100 bg-primary-400 text-white p-2 rounded-full hover:bg-primary-500 transition"
                                >
                                    <FaPen size={14} />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </div>
                            <h2 className="mt-4 text-xl font-semibold capitalize">
                                {formData.firstName ? `${formData.firstName} ${formData.lastName}` : formData.displayName}
                            </h2>
                            <p className="text-gray-500">{formData.role || "User"}</p>
                        </div>

                        {/* Profile Form */}
                        <div className="flex-1">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName || ""}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName || ""}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username || ""}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email || ""}
                                            disabled
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                        <input
                                            type="text"
                                            name="department"
                                            value={formData.department || ""}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                                        <input
                                            type="text"
                                            name="course"
                                            value={formData.course || ""}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <input
                                            type="text"
                                            name="phoneNumber"
                                            value={formData.phoneNumber || ""}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                        <input
                                            type="text"
                                            value={formData.role || "User"}
                                            disabled
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                                        />
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                            <input
                                                type="password"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>

                                            {passwordError && (
                                                <p className="text-red-500 text-sm">{passwordError}</p>
                                            )}

                                            <button
                                                type="button"
                                                onClick={handlePasswordChange}
                                                disabled={!currentPassword || !newPassword || !confirmPassword || isPasswordUpdating}
                                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                                            >
                                                {isPasswordUpdating ? 'Updating...' : 'Change Password'}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={!isFormChanged || isUpdating}
                                            className="px-6 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                                        >
                                            {isUpdating ? 'Updating...' : 'Update Profile'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ProfilePage;