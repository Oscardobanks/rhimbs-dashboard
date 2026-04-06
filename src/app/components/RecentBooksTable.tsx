"use client"
import { auth, db } from '@/firebase/firebase';
import { getDocs, collection, query, where, CollectionReference, Query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { FaArrowRight } from 'react-icons/fa';
import BeatLoader from 'react-spinners/BeatLoader';
import { UserRole } from '../services/permissions';

export interface Book {
    id: string;
    title: string;
    author: string;
    course: string;
    department: string;
    bookUrl: string;
    uploadDate: string;
}

interface RecentBooksTableProps {
    userRole: UserRole | null;
}

const RecentBooksTable = ({ userRole }: RecentBooksTableProps) => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            try {
                const currentUser = auth.currentUser;
                const isAdminOrPresident = userRole === UserRole.ADMIN || userRole === UserRole.PRESIDENT;

                let queryRef: Query | CollectionReference = collection(db, "Books");
                if (!isAdminOrPresident && currentUser) {
                    queryRef = query(collection(db, "Books"), where("userId", "==", currentUser.uid));
                }

                const querySnapshot = await getDocs(queryRef);
                const bookData = querySnapshot.docs.map(doc => {
                    const data = doc.data();

                    // Convert Firebase timestamp to formatted date string
                    const date = new Date(data.uploadDate);
                    const formattedDate = date.toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    });

                    return {
                        id: doc.id,
                        title: data.title,
                        author: data.author,
                        course: data.course,
                        department: data.department,
                        bookUrl: data.bookUrl,
                        uploadDate: formattedDate
                    };
                });
                setBooks(bookData.slice(0, 5));
            } catch (error: Error | any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, [userRole]);

    return (
        <div>
            <div className="border-2 border-teal-700 py-4 md:px-6 px-4 rounded-lg text-black">
                <div className="flex flex-wrap gap-5 justify-between items-center w-full md:p-4">
                    <h1 className="text-2xl font-bold text-teal-800">Recent Books</h1>
                    <a href="/books">
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
                                    <th scope="col" className="px-6 py-4">Title</th>
                                    <th scope="col" className="px-6 py-4">Author</th>
                                    <th scope="col" className="px-6 py-4">Course</th>
                                    <th scope="col" className="px-6 py-4">Upload Date</th>
                                </tr>
                            </thead>

                            <tbody>
                                {!loading && !error && books.map((book) => (
                                    <tr
                                        key={book.id}
                                        className="border-b transition duration-300 ease-in-out hover:bg-teal-100">
                                        <td className="whitespace-nowrap px-6 py-4">{book.title}</td>
                                        <td className="whitespace-nowrap px-6 py-4">{book.author}</td>
                                        <td className="whitespace-nowrap px-6 py-4">{book.course}</td>
                                        <td className="whitespace-nowrap px-6 py-4">{book.uploadDate}</td>
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

                                {books.length === 0 && !loading && !error && (
                                    <tr className="text-center p-5 font-bold h-20">
                                        <td colSpan={12} className="text-gray-800 text-lg">No Books Available</td>
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

export default RecentBooksTable
