"use client"
import { useRouter } from "next/navigation";
import { useState, FormEvent, useEffect } from "react";
import UploadImage from "./UploadImage";
import { useToast } from "../hooks/useToast";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase/firebase";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";

const NoteForm = () => {
    const [title, setTitle] = useState("");
    const [lecturer, setLecturer] = useState("");
    const [course, setCourse] = useState("");
    const [department, setDepartment] = useState("");
    const [uploadedNotes, setUploadedNotes] = useState<string | undefined>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(false);
    const { showToast } = useToast();
    const [userId, setUserId] = useState<string | null>(null);

    const router = useRouter();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Basic validation
        if (!title || !course || !department || !uploadedNotes) {
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

        if (!title) {
            setError(true);
            showToast({
                type: "error",
                message: "Title is required.",
            });
            setTimeout(() => {
                setError(false);
            }, 3000);
            setIsSubmitting(false);
            return;
        }

        if (!lecturer) {
            setError(true);
            showToast({
                type: "error",
                message: "Lecturer is required.",
            });
            setTimeout(() => {
                setError(false);
            }, 3000);
            setIsSubmitting(false);
            return;
        }

        if (!course) {
            setError(true);
            showToast({
                type: "error",
                message: "Course is required.",
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
                message: "Department is required.",
            });
            setTimeout(() => {
                setError(false);
            }, 3000);
            setIsSubmitting(false);
            return;
        }

        if (!uploadedNotes) {
            setError(true);
            showToast({
                type: "error",
                message: "Please Upload the notes",
            });
            setTimeout(() => {
                setError(false);
            }, 3000);
            setIsSubmitting(false);
            return;
        }

        try {
            // Add book details to Firestore with a generated ID
            const noteRef = doc(collection(db, "Notes"));
            await setDoc(noteRef, {
                lecturer,
                course,
                department,
                title,
                notesUrl: uploadedNotes,
                uploadDate: new Date().toISOString(),
                userId,
            });

            showToast({
                type: "success",
                message: "Notes uploaded successfully.",
            });
            router.push('/notes');

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
                Fill the form to add notes
            </h2>
            <hr className='mt-1 mb-5 border' />
            <form className="w-full space-y-8 mt-6" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 grid-cols-1 md:gap-x-20 gap-8">
                    <div className="flex flex-col">
                        <label htmlFor="title"
                            className="font-semibold text-gray-600">Title <span className="text-red-500 text-2xl font-bold">*</span></label>
                        <input
                            id="title"
                            placeholder="Enter note title"
                            className={`px-4 py-1 focus:outline-none focus:border-teal-600 border border-gray-400 rounded hover:border-2 hover:border-teal-500 ${error && !title && "border-red-500"}`}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="course"
                            className="font-semibold text-gray-600">Course <span className="text-red-500 text-2xl font-bold">*</span></label>
                        <input
                            id="course"
                            placeholder="Enter course name"
                            className={`px-4 py-1 focus:outline-none focus:border-teal-600 border border-gray-400 rounded hover:border-2 hover:border-teal-500 capitalize ${error && !course && "border-red-500"}`}
                            value={course}
                            onChange={(e) => setCourse(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="department"
                            className="font-semibold text-gray-600">Department <span className="text-red-500 text-2xl font-bold">*</span></label>
                        <input
                            id="department"
                            placeholder="Enter department name"
                            className={`px-4 py-1 focus:outline-none focus:border-teal-600 border border-gray-400 rounded hover:border-2 hover:border-teal-500 capitalize ${error && !department && "border-red-500"}`}
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="lecturer"
                            className="font-semibold text-gray-600">Lecturer <span className="text-red-500 text-2xl font-bold">*</span></label>
                        <input
                            id="lecturer"
                            placeholder="Enter lecturer name"
                            className={`px-4 py-1 focus:outline-none focus:border-teal-600 border border-gray-400 rounded hover:border-2 hover:border-teal-500 capitalize ${error && !department && "border-red-500"}`}
                            value={lecturer}
                            onChange={(e) => setLecturer(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="file"
                            className="font-semibold text-gray-600">Notes <span className="text-red-500 text-2xl font-bold">*</span></label>
                        <UploadImage label="Upload Notes" uploadedFile={uploadedNotes} setUploadedFile={setUploadedNotes} />
                        <span className="text-sm pt-1">(<span className="font-semibold">upload format:</span> pdf, jpg, png, jpeg, zip)</span>
                    </div>
                </div>
                <div className="flex justify-end mt-10">
                    <button
                        type="submit"
                        className="px-8 py-2 font-semibold rounded-md bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-teal-400"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Adding Note..." : "Add Note"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default NoteForm
