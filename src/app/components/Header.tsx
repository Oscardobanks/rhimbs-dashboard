'use client';
import { auth, db } from '@/firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react'
import { BiUserCircle } from 'react-icons/bi';
import { CgLogOut } from 'react-icons/cg';
import { FaBell } from "react-icons/fa";
import { FaChevronDown, FaMoon, FaSun } from 'react-icons/fa6';
import { GiHelp } from 'react-icons/gi';
import { UserRole } from '../services/permissions';
import { usePermissions } from '../hooks/usePermissions';

const Header = () => {
    const [theme, setTheme] = useState(false)
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [user, setUser] = useState<Record<string, any>>({});
    const { userRole } = usePermissions();

    // Function to close the dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setOpen(false);
        }
    };

    // Add event listener when the component mounts
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        // Listen for authentication state changes
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                if (userRole === UserRole.ADMIN) {
                    setUser({
                        role: userRole,
                        email: user.email,
                        uid: user.uid,
                        displayName: user.displayName || "ADMIN",
                        photoURL: user.photoURL,
                    });
                } else {
                    // Fetch user details from Firestore
                    const userDoc = await getDoc(doc(db, "Users", user.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUser(userData);
                    }
                }
            }
        });
    }, [userRole]);

    const handleLogout = () => {
        auth.signOut();
    };

    const DropdownItems = [
        {
            icon: <BiUserCircle size={20} />,
            link: "/profile",
            text: "My Profile",
        },
        {
            icon: <GiHelp size={20} />,
            link: "/support",
            text: "Help",
        },
        {
            icon: <CgLogOut size={20} />,
            link: "/login",
            text: "Logout",
        },
    ]

    return (
        <div>
            <div className='lg:sticky fixed bg-primary-25 text-gray-900 border-b-2 border-teal-900 lg:pl-8 md:pl-20 pl-16 pr-5 py-3 flex gap-5 justify-between items-center w-full z-[8]'>
                <h1 className='lg:text-2xl md:text-xl text-lg font-bold'>Welcome,<span className="text-primary-500 capitalize"> {`${user.firstName ? (user.firstName) : user.displayName || "User"}`}!</span></h1>
                <div className="flex items-center gap-4">
                    {/* <button className={`text-2xl text-dark ease-in-out duration-500 ${theme && "rotate-180"}`} onClick={() => setTheme(!theme)}>
                        {theme === false ? <FaMoon /> : <FaSun />}
                    </button> */}
                    {/* Notification */}
                    {/* <button className="relative">
                        <div className="w-5 h-5 bg-zinc-50 flex items-center justify-center absolute -top-1.5 -right-2.5 rounded-full p-0.5">
                            <span className="bg-red-600 text-white rounded-full w-full h-full flex items-center justify-center text-xs">3</span>
                        </div>
                        <FaBell className="text-xl" />
                    </button> */}

                    {/* Profile Dropdown Menu */}
                    <div className='relative' ref={menuRef}>
                        <div className='flex items-center gap-2 cursor-pointer' onClick={() => { setOpen(!open) }}>
                            <div className="bg-white border border-teal-800 lg:size-10 size-8 rounded-lg">
                                <img
                                    src={user.photoURL || "/assets/images/default user.png"}
                                    alt="User"
                                    className="size-full rounded-lg"
                                />
                            </div>
                            <div className={`flex items-center gap-2 duration-300 ease-linear ${open && 'rotate-180'}`} >
                                <FaChevronDown />
                            </div>
                        </div>

                        <div className={`absolute top-12 right-0 transition duration-500 ease-in-out h-full w-[220px] ${open ? 'opacity-100 visible translate-y-0' : 'opacity-0 hidden -translate-y-5'}`} >
                            <div className="bg-primary-25 rounded-lg shadow py-3 px-4">
                                <div className="flex flex-col justify-center w-full text-center py-4 px-2">
                                    <h3 className='text-xl font-bold text-gray-600 capitalize'>{`${user.firstName ? (user.firstName + " " + user.lastName) : user.displayName || "User"}`}</h3>
                                    <p className="text-gray-400 text-sm">{user?.email}</p>
                                </div>
                                <div>
                                    {DropdownItems.map((item, index) => (
                                        <a href={item.link} key={index} onClick={item.text === "Logout" ? handleLogout : undefined} className={`flex gap-2 items-center py-3 px-2 rounded border-t border-[rgba(0,0,0,0.05)] hover:bg-primary-50 ${item.text === "Logout" && "text-red-500"}`}>
                                            {item.icon}
                                            <p className="font-semibold">{item.text}</p>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header
