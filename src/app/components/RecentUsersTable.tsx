"use client"
import { db } from '@/firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import React, { useState, useEffect } from 'react'
import { FaArrowRight } from 'react-icons/fa'
import BeatLoader from 'react-spinners/BeatLoader';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    department: string;
    role: string;
}

const RecentUsersTable = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const querySnapshot = await getDocs(collection(db, "Users"));
                const userData = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        username: data.username,
                        email: data.email,
                        department: data.department,
                        role: data.role
                    };
                });
                const allUsers = userData.sort((a, b) => a.firstName.localeCompare(b.firstName));
                setUsers(allUsers.slice(0, 5));
            } catch (error: Error | any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div>
            <div className="border-2 border-teal-700 py-4 md:px-6 px-4 rounded-lg">
                <div className="flex flex-wrap gap-5 justify-between items-center w-full md:p-4">
                    <h1 className="text-2xl font-bold text-teal-800">Recent Users</h1>
                    <a href="/users">
                        <button className="flex gap-2 items-center bg-teal-400 hover:bg-teal-500 text-white px-5 py-2 rounded-md">View All <span>
                            <FaArrowRight />
                        </span></button>
                    </a>
                </div>
                <div className="overflow-x-auto flex flex-col scrollbar-thin scrollbar-thumb-teal-500 scrollbar-track-teal-100">
                    <div className="inline-block min-w-full py-2">
                        <table className="min-w-full text-left text-sm font-light shadow">
                            <thead className="border-b font-medium bg-teal-600 text-white rounded-md">
                                <tr>
                                    <th scope="col" className="px-6 py-4">Username</th>
                                    <th scope="col" className="px-6 py-4">Email</th>
                                    <th scope="col" className="px-6 py-4">Department</th>
                                    <th scope="col" className="px-6 py-4">Role</th>
                                </tr>
                            </thead>

                            <tbody>
                                {!loading && !error && users.map((user) => (
                                    <tr
                                        key={user?.id}
                                        className="border-b transition duration-300 ease-in-out hover:bg-teal-100">
                                        <td className="whitespace-nowrap px-6 py-4">{user.username}</td>
                                        <td className="whitespace-nowrap px-6 py-4">{user.email}</td>
                                        <td className="whitespace-nowrap px-6 py-4">{user.department}</td>
                                        <td className="whitespace-nowrap px-6 py-4">{user.role}</td>
                                    </tr>
                                ))}
                                {loading ?
                                    (
                                        <tr className="h-20">
                                            <td colSpan={12}>
                                                <div className="flex items-center justify-center">
                                                    <BeatLoader
                                                        color="teal"
                                                        loading={loading}
                                                        aria-label="Loading Spinner"
                                                        data-testid="loader"
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        error && (
                                            <tr className="text-center p-5 font-bold h-20">
                                                <td colSpan={12} className="text-gray-800 text-lg">We Faced Some Incoveniences. Please try again later.</td>
                                                <td colSpan={12} className="text-red-500">{error}</td>
                                            </tr>
                                        ))}

                                {!loading && !error && users.length === 0 && (
                                    <tr className="text-center p-5 font-bold h-20">
                                        <td colSpan={12} className="text-gray-800 text-lg">No Users Available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RecentUsersTable
