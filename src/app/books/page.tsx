"use client"
import React, { useEffect, useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { FaHouse } from 'react-icons/fa6'
import Link from 'next/link'
import { Book } from '../components/RecentBooksTable'
import TableComponent from '../components/Table'
import { auth, db } from "@/firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { usePermissions } from '../hooks/usePermissions'
import { UserRole } from '../services/permissions'

const Books = () => {
  const { userRole, loading } = usePermissions();
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      if (!userRole) return;

      try {
        const isAdminOrPresident = userRole === UserRole.ADMIN || userRole === UserRole.PRESIDENT;
        let booksQuery;

        if (isAdminOrPresident) {
          booksQuery = collection(db, "Books");
        } else {
          const currentUser = auth.currentUser;
          booksQuery = query(
            collection(db, "Books"),
            where("userId", "==", currentUser?.uid)
          );
        }

        const querySnapshot = await getDocs(booksQuery);
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
            uploadDate: formattedDate,
          };
        });
        setBooks(bookData);
      } catch (error: Error | any) {
        setError(error.message);
      }
    };

    fetchBooks();
  }, [userRole]);

  const tableHeader = [
    { column: "title", header: "Title" },
    { column: "author", header: "Author" },
    { column: "course", header: "Course" },
    { column: "department", header: "Department" },
    { column: "bookUrl", header: "Book" },
    { column: "uploadDate", header: "Upload Date" }
  ];

  return (
    <div>
      <DashboardLayout active="books">
        <div className="py-8 lg:px-8 px-5 lg:min-h-[91.8vh] min-h-[94vh] size-full bg-gray-50">
          <div className="flex gap-5 justify-between items-center">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold text-teal-900">Books</h1>
              <div className="flex gap-2 items-center text-sm">
                <Link href="/dashboard" className='pb-1'><FaHouse color='#9ca3af' /></Link> /
                <span className="text-gray-600 font-semibold">books</span>
              </div>
            </div>
            <a href="/books/add">
              <button className="flex gap-2 items-center bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white px-8 py-2 rounded-md font-semibold hover:scale-105 transition duration-300">
                Add Book
              </button>
            </a>
          </div>

          <div className="w-full mt-10">
            <TableComponent
              tableHeader={tableHeader}
              tableData={books}
              loading={loading}
              error={error}
              title='Book'
              fileName='books'
            />
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
};

export default Books;