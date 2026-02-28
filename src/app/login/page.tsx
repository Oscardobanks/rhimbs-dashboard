'use client'
import React, { FormEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import studyingAnimation from "@/../studying.json";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useToast } from "../hooks/useToast";
import { auth } from "../../firebase/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showToast } = useToast();
    const router = useRouter();

    const emailReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const adminEmail = process.env.NEXT_DEFAULT_ADMIN_EMAIL
    const adminPassword = process.env.NEXT_DEFAULT_ADMIN_PASSWORD
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Basic validation
        if (!email || !password) {
            showToast({
                type: "error",
                message: "Please enter your email and password",
            });
            setIsSubmitting(false);
            return;
        }

        // Email Validation
        if (!email || !emailReg.test(email)) {
            showToast({
                type: "error",
                message: "Please enter a valid email address",
            });
            setIsSubmitting(false);
            return;
        }

        if (!password || password.length < 8) {
            showToast({
                type: "error",
                message: "Password must be 8+ characters",
            });
            setIsSubmitting(false);
            return;
        }

        try {
            if (email === adminEmail && password === adminPassword) {
                await createUserWithEmailAndPassword(auth, email, password);
                showToast({
                    type: "success",
                    message: `Welcome Back!!`,
                });
                router.push("/dashboard");
            } else {
                await signInWithEmailAndPassword(auth, email, password);
                showToast({
                    type: "success",
                    message: `Welcome Back!!`,
                });
                router.push("/dashboard");
            }
        } catch (error) {
            showToast({
                type: "error",
                message: "Failed to login. Please check your credentials.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <main className="flex justify-center items-center w-full min-h-screen bg-gray-50">
                <div className="relative w-full max-w-[90vw] md:h-[95vh] h-full md:my-0 my-8 bg-white rounded-xl shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-8 gap-5 size-full 2xl:p-8 p-4">
                        <div className="md:block hidden relative rounded-3xl bg-red-50 w-full h-full">
                            <div className="absolute flex flex-col justify-center h-full xl:p-8 p-5 text-center">
                                <div className="flex justify-center mb-5">
                                    <Image src="/assets/images/logo.png" alt="Rhibms Logo" width={120} height={120} className="xl:size-[120px] lg:size-[100px]" />
                                </div>
                                <h1 className="2xl:text-4xl xl:text-3xl md:text-2xl font-bold mb-3 text-primary-600"> Inspiring the Next Generation</h1>
                                <p className="xl:text-base text-sm font-semibold text-red-500">Dedicated to your success, dedicated to theirs.  Access the tools you need to make a difference.</p>
                                <div className="xl:w-[45%] w-[50%] mx-auto mt-8">
                                    <Lottie animationData={studyingAnimation} loop={false} />
                                </div>
                            </div>
                        </div>
                        <div className="w-full h-full flex flex-col justify-center xl:px-14 lg:px-10 px-5 md:py-0 py-10">
                            <div className="md:hidden flex justify-center pb-16">
                                <Image src="/assets/images/logo.png" alt="Rhibms Logo" width={150} height={150} className="size-[150px]" />
                            </div>
                            <div className="flex flex-col gap-2 w-full">
                                <h1 className="text-4xl font-bold text-red-500">Login</h1>
                                <p className="font-semibold text-lg">Welcome Back! Please enter your details.</p>
                            </div>
                            <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-8">
                                <div>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        placeholder="Email"
                                        onChange={(e) => setEmail(e.target.value)}
                                        // required
                                        className="w-full px-3 py-2 border-b-2 border-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                                    />
                                </div>
                                <div>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            value={password}
                                            placeholder="Password"
                                            onChange={(e) => setPassword(e.target.value)}
                                            // required
                                            className="w-full px-3 py-2 border-b-2 border-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                                        >
                                            {password && (showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />)}
                                        </button>
                                    </div>
                                </div>
                                <div className="w-full flex lg:flex-row flex-col gap-5 items-center justify-between mb-5">
                                    <div className="w-full flex items-center gap-2">
                                        <input type="checkbox" name="remember" id="remember" className="size-4" />
                                        <p>Remember Me</p>
                                    </div>
                                    <a href="/login" className="font-semibold whitespace-nowrap hover:text-red-500 underline underline-offset-2 hover:no-underline">Forgot Password?</a>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting ||
                                        !email ||
                                        !password}
                                    className="w-full py-3 px-4 border-none rounded-md shadow-sm md:font-semibold text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? "Logging In..." : "Login"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Login;