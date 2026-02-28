'use client'
import React, { useEffect, useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { FaFileCircleQuestion, FaHouse } from 'react-icons/fa6'
import Link from 'next/link'
import { ImBooks, ImUsers } from 'react-icons/im'
import { IoDocumentText } from 'react-icons/io5'
import RecentUsersTable from '../components/RecentUsersTable'
import RecentNotesTable from '../components/RecentNotesTable'
import RecentBooksTable from '../components/RecentBooksTable'
import RecentQuestionsTable from '../components/RecentQuestionsTable'
import { collection, query, where, getDocs } from "firebase/firestore"
import { db, auth } from "@/firebase/firebase"
import { usePermissions } from '../hooks/usePermissions'
import { UserRole } from '../services/permissions'
import BeatLoader from 'react-spinners/BeatLoader';

const Dashboard = () => {
  const { userRole, loading } = usePermissions();
  const [stats, setStats] = useState({
    users: 0,
    books: 0,
    notes: 0,
    questions: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser || !userRole) return;

      const isAdminOrPresident = userRole === UserRole.ADMIN || userRole === UserRole.PRESIDENT;
      const isAdminOrPresidentOrDirector = userRole === UserRole.ADMIN || userRole === UserRole.PRESIDENT || userRole === UserRole.DIRECTOR;

      try {
        let booksSnapshot, notesSnapshot, questionsSnapshot;

        if (isAdminOrPresident) {
          [booksSnapshot, notesSnapshot, questionsSnapshot] = await Promise.all([
            getDocs(collection(db, "Books")),
            getDocs(collection(db, "Notes")),
            getDocs(collection(db, "Questions"))
          ]);
        } else {
          [booksSnapshot, notesSnapshot, questionsSnapshot] = await Promise.all([
            getDocs(query(collection(db, "Books"), where("userId", "==", currentUser.uid))),
            getDocs(query(collection(db, "Notes"), where("userId", "==", currentUser.uid))),
            getDocs(query(collection(db, "Questions"), where("userId", "==", currentUser.uid)))
          ]);
        }

        let usersCount = 0;
        if (isAdminOrPresidentOrDirector) {
          const usersSnap = await getDocs(collection(db, "Users"));
          usersCount = usersSnap.size;
        }

        setStats({
          users: usersCount,
          books: booksSnapshot.size,
          notes: notesSnapshot.size,
          questions: questionsSnapshot.size
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchData();
  }, [userRole]);


  const CardDetails = [
    {
      total: stats.users,
      title: "Total Users",
      shadow: "shadow-blue-300",
      bgcolor: "bg-gradient-to-tr from-blue-500 to-emerald-400",
      icon: <ImUsers size={30} color="#60a5fa" />,
      showFor: [UserRole.ADMIN, UserRole.PRESIDENT, UserRole.DIRECTOR]
    },
    {
      total: stats.books,
      title: userRole === UserRole.ADMIN || userRole === UserRole.PRESIDENT ? "Total Books" : "My Books",
      shadow: "shadow-emerald-200",
      bgcolor: "bg-gradient-to-tr from-emerald-600 to-lime-500",
      icon: <ImBooks size={30} color="#059669" />,
      showFor: Object.values(UserRole)
    },
    {
      total: stats.notes,
      title: userRole === UserRole.ADMIN || userRole === UserRole.PRESIDENT ? "Total Notes" : "My Notes",
      shadow: "shadow-pink-300",
      bgcolor: "bg-gradient-to-tr from-pink-600 to-orange-400",
      icon: <IoDocumentText size={30} color="#f97316" />,
      showFor: Object.values(UserRole)
    },
    {
      total: stats.questions,
      title: userRole === UserRole.ADMIN || userRole === UserRole.PRESIDENT ? "Total Questions" : "My Questions",
      shadow: "shadow-orange-200",
      bgcolor: "bg-gradient-to-tr from-red-600 to-yellow-400",
      icon: <FaFileCircleQuestion size={30} color="#ef4444" />,
      showFor: Object.values(UserRole)
    }
  ];

  // Update the grid container class based on userRole
  const gridClass = userRole === UserRole.ADMIN || userRole === UserRole.PRESIDENT || userRole === UserRole.DIRECTOR
    ? "grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 w-full mt-8"
    : "grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 w-full mt-8";

  return (
    <div>
      <DashboardLayout active="dashboard">
        <div className="py-8 px-5 size-full bg-gray-50">
          <div className="flex gap-5 justify-between">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold text-teal-900">Dashboard</h1>
              <div className="flex gap-2 items-center text-sm">
                <Link href="/dashboard" className='pb-1'><FaHouse color='#9ca3af' /></Link> /
                <span className="text-gray-600 font-semibold">dashboard</span>
              </div>
            </div>
          </div>

          {!loading ? (
            <div className={gridClass}>
            {CardDetails.map((card, index) => (
              (card.showFor.includes(userRole as UserRole)) && (
                <div key={index} className={`flex items-center justify-between gap-10 p-6 shadow-lg rounded-2xl w-full ${card.bgcolor} ${card.shadow}`}>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-base font-bold text-gray-100">{card.title}</h1>
                    <h1 className="text-3xl font-bold text-white">{card.total}</h1>
                  </div>
                  <div className="rounded-full p-3 bg-white">
                    {card.icon}
                  </div>
                </div>
              )
            ))}
          </div>
          ) :
            (
              <div className="pt-8 flex justify-center items-center">
                <BeatLoader
                  color="teal"
                  loading={loading}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </div>
            )
          }

          <div className="flex flex-col gap-10 w-full mt-16">
            {(userRole === UserRole.ADMIN || userRole === UserRole.PRESIDENT || userRole === UserRole.DIRECTOR) &&
              <RecentUsersTable />
            }
            <RecentBooksTable userRole={userRole} />
            <RecentNotesTable userRole={userRole} />
            <RecentQuestionsTable userRole={userRole} />
          </div>
        </div>
      </DashboardLayout>
    </div>
  )
}

export default Dashboard