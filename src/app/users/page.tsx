"use client"
import React, { useEffect, useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { FaHouse } from 'react-icons/fa6'
import Link from 'next/link'
import { User } from '../components/RecentUsersTable'
import TableComponent from '../components/Table'
import { db } from "@/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

const Users = () => {
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
        setUsers(allUsers);
      } catch (error: Error | any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const tableHeader = [
    {
      column: "firstName",
      header: "First Name",
    },
    {
      column: "lastName",
      header: "Last Name",
    },
    {
      column: "username",
      header: "Username",
    },
    {
      column: "email",
      header: "Email",
    },
    {
      column: "department",
      header: "Department",
    },
    {
      column: "role",
      header: "Role",
    }
  ];

  return (
    <div>
      <DashboardLayout active="users">
        <div className="py-8 lg:px-8 px-5 lg:min-h-[91.8vh] min-h-[94vh] size-full bg-gray-50 text-black">
          <div className="flex gap-5 justify-between items-center">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold text-teal-900">Users</h1>
              <div className="flex gap-2 items-center text-sm">
                <Link href="/dashboard" className='pb-1'><FaHouse color='#9ca3af' /></Link> /
                <span className="text-gray-600 font-semibold">users</span>
              </div>
            </div>
            <a href="/users/add">
              <button className="flex gap-2 items-center bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white px-8 py-2 rounded-md font-semibold hover:scale-105 transition duration-300">
                <span>
                  Add User
                </span>
              </button>
            </a>
          </div>

          <div className="w-full mt-10">
            <TableComponent tableHeader={tableHeader} tableData={users} loading={loading} error={error} title='User' fileName='users' />
          </div>
        </div>
      </DashboardLayout>
    </div>
  )
}

export default Users
