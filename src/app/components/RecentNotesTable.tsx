"use client"
import { auth, db } from '@/firebase/firebase';
import { getDocs, collection, query, where, CollectionReference, Query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { FaArrowRight } from 'react-icons/fa';
import BeatLoader from 'react-spinners/BeatLoader';
import { UserRole } from '../services/permissions';

export interface Note {
  id: string;
  title: string;
  lecturer: string;
  course: string;
  department: string;
  notesUrl: string;
  uploadDate: string;
}

interface RecentNotesTableProps {
  userRole: UserRole | null;
}

const RecentNotesTable = ({ userRole }: RecentNotesTableProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const currentUser = auth.currentUser;
        const isAdminOrPresident = userRole === UserRole.ADMIN || userRole === UserRole.PRESIDENT;

        let queryRef: Query | CollectionReference = collection(db, "Notes");
        if (!isAdminOrPresident && currentUser) {
          queryRef = query(collection(db, "Notes"), where("userId", "==", currentUser.uid));
        }


        const querySnapshot = await getDocs(queryRef);
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
            uploadDate: formattedDate
          };
        });
        setNotes(noteData.slice(0, 5));
      } catch (error: Error | any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [userRole]);

  return (
    <div>
      <div className="border-2 border-teal-700 py-4 md:px-6 px-4 rounded-lg">
        <div className="flex flex-wrap gap-5 justify-between items-center w-full md:p-4">
          <h1 className="text-2xl font-bold text-teal-800">Recent Notes</h1>
          <a href="/notes">
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
                  <th scope="col" className="px-6 py-4">Lecturer</th>
                  <th scope="col" className="px-6 py-4">Details</th>
                  <th scope="col" className="px-6 py-4">Upload Date</th>
                </tr>
              </thead>

              <tbody>
                {!loading && !error && notes.map((note) => (
                  <tr
                    key={note.id}
                    className="border-b transition duration-300 ease-in-out hover:bg-teal-100">
                    <td className="whitespace-nowrap px-6 py-4 font-medium">{note.title}</td>
                    <td className="whitespace-nowrap px-6 py-4">{note.lecturer}</td>
                    <td className="whitespace-nowrap px-6 py-4">{note.course}</td>
                    <td className="whitespace-nowrap px-6 py-4">{note.uploadDate}</td>
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

                {notes.length === 0 && !loading && !error && (
                  <tr className="text-center p-5 font-bold h-20">
                    <td colSpan={12} className="text-gray-800 text-lg">No Notes Available</td>
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

export default RecentNotesTable
