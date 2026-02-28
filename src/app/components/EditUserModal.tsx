import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { useToast } from '../hooks/useToast';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    department: string;
    role: string;
    password: string;
}

interface EditModalProps {
    user: User;
    onSave: (updatedUser: User) => void;
    onCancel: () => void;
}

const EditUserModal: React.FC<EditModalProps> = ({ user, onSave, onCancel }) => {
    const [formData, setFormData] = useState<User>({ ...user, password: user.password || '' });
    const { showToast } = useToast();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userDoc = doc(db, 'Users', formData.id);
            await updateDoc(userDoc, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                username: formData.username,
                department: formData.department,
                role: formData.role,
            });
            showToast({
                type: "success",
                message: "User details has been updated successfully.",
            });
            onSave(formData);
        } catch (error) {
            console.error('Error updating user:', error);
            showToast({
                type: "error",
                message: "Failed to update user.",
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg lg:max-w-3xl md:max-w-2xl max-w-sm w-full">
                <h1 className="text-2xl font-bold mb-1">Edit User</h1>
                <hr />
                <form onSubmit={handleSubmit}>
                    <div className="md:space-y-8 space-y-6 mt-8">
                        <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                            <div>
                                <label className="mb-1 font-semibold">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-1 focus:outline-none focus:border-teal-600 border border-gray-400 rounded hover:border-2 hover:border-teal-500 capitalize"
                                />
                            </div>
                            <div>
                                <label className="mb-1 font-semibold">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-1 focus:outline-none focus:border-teal-600 border border-gray-400 rounded hover:border-2 hover:border-teal-500 capitalize"
                                />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                            <div>
                                <label className="mb-1 font-semibold">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full px-4 py-1 focus:outline-none focus:border-teal-600 border border-gray-400 rounded hover:border-2 hover:border-teal-500 capitalize"
                                />
                            </div>
                            <div>
                                <label className="mb-1 font-semibold">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full px-4 py-1 focus:outline-none focus:border-teal-600 border border-gray-400 rounded hover:border-2 hover:border-teal-500"
                                />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                            <div>
                                <label className="mb-1 font-semibold">Department</label>
                                <input
                                    type="text"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    className="w-full px-4 py-1 focus:outline-none focus:border-teal-600 border border-gray-400 rounded hover:border-2 hover:border-teal-500 capitalize"
                                />
                            </div>
                            <div>
                                <label className="mb-1 font-semibold">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-1 focus:outline-none focus:border-teal-600 border border-gray-400 rounded hover:border-2 hover:border-teal-500"
                                />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 grid-cols-1 md:gap-20 gap-8">
                            <div className="flex flex-col gap-1">
                                <label htmlFor="role"
                                    className="font-semibold text-gray-600">Role</label>
                                <select
                                    id="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className={`px-4 py-1 focus:outline-none focus:border-teal-600 border border-gray-400 rounded hover:border-2 hover:border-teal-500 ${!formData.role && "border-red-500"}`}
                                >
                                    <option value="">Select a role</option>
                                    <option value="lecturer">Lecturer</option>
                                    <option value="director">Director</option>
                                    <option value="president">President</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-2 text-gray-500 border border-gray-500 rounded hover:text-gray-700 hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;