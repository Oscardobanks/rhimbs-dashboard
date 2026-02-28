"use client"
import React, { useEffect, useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { FaHouse } from 'react-icons/fa6'
import Link from 'next/link'
import { Note } from '../components/RecentNotesTable'
import TableComponent from '../components/Table'
import { db, auth } from "@/firebase/firebase"
import { collection, getDocs, query, where } from "firebase/firestore"
import { usePermissions } from '../hooks/usePermissions'
import { UserRole } from '../services/permissions'

const Notes = () => {
  const { userRole, loading } = usePermissions();
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      if (!userRole) return;

      try {
        const isAdminOrPresident = userRole === UserRole.ADMIN || userRole === UserRole.PRESIDENT;
        let notesQuery;

        if (isAdminOrPresident) {
          notesQuery = collection(db, "Notes");
        } else {
          const currentUser = auth.currentUser;
          notesQuery = query(
            collection(db, "Notes"),
            where("userId", "==", currentUser?.uid)
          );
        }

        const querySnapshot = await getDocs(notesQuery);
        const noteData = querySnapshot.docs.map(doc => {
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
            lecturer: data.lecturer,
            course: data.course,
            department: data.department,
            notesUrl: data.notesUrl,
            uploadDate: formattedDate,
          };
        });
        setNotes(noteData);
      } catch (error: Error | any) {
        setError(error.message);
      }
    };

    fetchNotes();
  }, [userRole]);

  const tableHeader = [
    { column: "title", header: "Title" },
    { column: "lecturer", header: "Lecturer" },
    { column: "course", header: "Course" },
    { column: "department", header: "Department" },
    { column: "notesUrl", header: "Notes" },
    { column: "uploadDate", header: "Upload Date" }
  ];

  return (
    <div>
      <DashboardLayout active="notes">
        <div className="py-8 lg:px-8 px-5 lg:min-h-[91.8vh] min-h-[94vh] size-full bg-gray-50">
          <div className="flex gap-5 justify-between items-center">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold text-teal-900">Notes</h1>
              <div className="flex gap-2 items-center text-sm">
                <Link href="/dashboard" className='pb-1'><FaHouse color='#9ca3af' /></Link> /
                <span className="text-gray-600 font-semibold">notes</span>
              </div>
            </div>
            <a href="/notes/add">
              <button className="flex gap-2 items-center bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white px-8 py-2 rounded-md font-semibold hover:scale-105 transition duration-300">
                Add Note
              </button>
            </a>
          </div>

          <div className="w-full mt-10">
            <TableComponent
              tableHeader={tableHeader}
              tableData={notes}
              loading={loading}
              error={error}
              title='Note'
              fileName='notes'
            />
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
};

export default Notes;