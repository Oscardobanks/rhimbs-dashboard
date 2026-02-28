"use client"
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useToast } from "../hooks/useToast";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebase";
import { UserRole } from "../services/permissions";
import { usePermissions } from "../hooks/usePermissions";

const UserForm = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [department, setDepartment] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(false);
    const { showToast } = useToast();
    const { userRole } = usePermissions();

    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const router = useRouter();

    const superAdmin = userRole === UserRole.SUPERADMIN

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Basic validation
        if (!firstName || !lastName || !email || !department) {
            setError(true);
            showToast({
                type: "error",
                message: "Please fill in all fields.",
            });
            setTimeout(() => {
                setError(false);
            }, 3000);
            setIsSubmitting(false);
            return;
        }

        if (!firstName) {
            setError(true);
            showToast({
                type: "error",
                message: "Please enter a First Name.",
            });
            setTimeout(() => {
                setError(false);
            }, 3000);
            setIsSubmitting(false);
            return;
        }

        if (!lastName) {
            setError(true);
            showToast({
                type: "error",
                message: "Please enter a Last Name.",
            });
            setTimeout(() => {
                setError(false);
            }, 3000);
            setIsSubmitting(false);
            return;
        }

        if (!email || !email.match(emailFormat)) {
            setError(true);
            showToast({
                type: "error",
                message: "Please enter a valid email address",
            });
            setTimeout(() => {
                setError(false);
            }, 3000);
            setIsSubmitting(false);
            return;
        }

        if (!department) {
            setError(true);
            showToast({
                type: "error",
                message: "Please enter a Department.",
            });
            setTimeout(() => {
                setError(false);
            }, 3000);
            setIsSubmitting(false);
            return;
        }

        if (!password || password.length < 8) {
            setError(true);
            showToast({
                type: "error",
                message: "Password must be 8+ characters",
            });
            setTimeout(() => {
                setError(false);
            }, 3000);
            setIsSubmitting(false);
            return;
        }

        if (!role) {
            setError(true);
            showToast({
                type: "error",
                message: "Role is required",
            });
            setTimeout(() => {
                setError(false);
            }, 3000);
            setIsSubmitting(false);
            return;
        }

        try {
            // Create user with Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Add user details to Firestore
            await setDoc(doc(db, "Users", user.uid), {
                userId: user.uid,
                firstName,
                lastName,
                username,
                email,
                department,
                role,
            });

            showToast({
                type: "success",
                message: "User has been created successfully!!",
            });
            router.push('/users');

        } catch (error) {
            showToast({
                type: "error",
                message: (error as Error).message,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="lg:p-10 md:p-6 p-4 bg-white border-2 border-gray-300 rounded-md">
            <h2 className="text-lg font-bold capitalize">
                Fill the form to add user
            </h2>
            <hr className='mt-1 mb-5 border' />
            {error && <p className="text-center text-red-500 font-bold my-2 transition duration-300 ease-in-out">{error}</p>}
            <form className="w-full space-y-8 mt-6" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 grid-cols-1 md:gap-20 gap-8">
                    <div className="flex flex-col">
                        <label htmlFor="firstName"
                            className="font-semibold text-gray-600">First Name <span className="text-red-500 text-2xl font-bold">*</span></label>
                        <input
                            id="firstName"
                            placeholder="Enter first name"
                            className={`px-4 py-1 focus:outline-none focus:border-teal-600 border border-gray-400 rounded hover:border-2 hover:border-teal-500 capitalize ${error && !firstName && "border-red-500"}`}
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="lastName"
                            className="font-semibold text-gray-600">Last Name <span className="text-red-500 text-2xl font-bold">*</span></label>
                        <input
                            id="lastName"
                            placeholder="Enter last name"
                            className={`px-4 py-1 focus:outline-none focus:border-teal-600 border border-gray-400 rounded hover:border-2 hover:border-teal-500 capitalize ${error && !lastName && "border-red-500"}`}
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                </div>
                <div className="grid md:grid-cols-2 grid-cols-1 md:gap-20 gap-8">
                    <div className="flex flex-col">
                        <label htmlFor="lastName"
                            className="font-semibold text-gray-600">Username <span className="text-red-500 text-2xl font-bold">*</span></label>
                        <input
                            id="username"
                            placeholder="Enter last name"
                            className={`px-4 py-1 focus:outline-none focus:border-teal-600 border border-gray-400 rounded hover:border-2 hover:border-teal-500 capitalize ${error && !username && "border-red-500"}`}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="email"
                            className="font-semibold text-gray-600">Email <span className="text-red-500 text-2xl font-bold">*</span></label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter email address"
                            className={`px-4 py-1 focus:outline-none focus:border-teal-600 border border-gray-400 rounded hover:border-2 hover:border-teal-500 ${error && !email && !email.match(emailFormat) && "border-red-500"}`}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 grid-cols-1 md:gap-20 gap-8">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="department"
                            className="font-semibold text-gray-600">Department <span className="text-red-500 text-2xl font-bold">*</span></label>
                        <input
                            id="department"
                            type="text"
                            placeholder="Enter Department"
                            className={`px-4 py-1 focus:outline-none focus:border-teal-600 border border-gray-400 rounded hover:border-2 hover:border-teal-500 capitalize ${error && !department && "border-red-500"}`}
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="password"
                            className="font-semibold text-gray-600"
                        >
                            Password <span className="text-red-500 text-2xl font-bold">*</span>
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`px-4 py-1 focus:outline-none focus:border-teal-600 pe-8 border border-gray-400 rounded w-full ${error && !password && password.length < 8 && "border-red-500"}`}
                            />
                            <div
                                className={`absolute cursor-pointer end-2 top-2 ${showPassword ? "show" : ""
                                    }`}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <FiEye />
                                ) : (
                                    <FiEyeOff />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 grid-cols-1 md:gap-20 gap-8">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="role"
                            className="font-semibold text-gray-600">Role <span className="text-red-500 text-2xl font-bold">*</span></label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className={`px-4 py-1 focus:outline-none focus:border-teal-600 border border-gray-400 rounded hover:border-2 hover:border-teal-500 ${error && !role && "border-red-500"}`}
                        >
                            <option value="">Select a role</option>
                            {superAdmin && <option value="admin">Admin</option>}
                            <option value="lecturer">Lecturer</option>
                            <option value="director">Director</option>
                            <option value="president">President</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end mt-10">
                    <button
                        type="submit"
                        className="px-8 py-2 font-semibold rounded-md bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-teal-400"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Adding User..." : "Add User"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default UserForm
