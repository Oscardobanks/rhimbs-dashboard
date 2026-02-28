'use client'
import { auth, db } from "@/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CgLogOut } from "react-icons/cg";
import { FaBell, FaBook, FaChevronDown, FaChevronRight, FaCircleQuestion, FaGear, FaGears, FaShieldHalved, FaUsers } from "react-icons/fa6";
import { IoDocumentText } from "react-icons/io5";
import { MdOutlineHeadsetMic, MdSpaceDashboard } from "react-icons/md";
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand } from "react-icons/tb";
import { useMediaQuery } from "react-responsive";
import { UserRole } from "../services/permissions";
import { usePermissions } from "../hooks/usePermissions";

interface SidebarProps {
	active: String;
}

interface SubMenuItems {
	[key: string]: boolean;
}

const Sidebar = ({ active }: SidebarProps) => {
	const router = useRouter();
	let isTabletMid = useMediaQuery({ query: "(max-width: 1023px)" });
	const { userRole } = usePermissions();

	const [open, setOpen] = useState(isTabletMid ? false : true);
	const [dropdown, setDropdown] = useState(false);
	const [subMenuItems, setSubMenuItems] = useState<SubMenuItems>({});
	const [user, setUser] = useState<Record<string, any>>({});

	useEffect(() => {
		if (isTabletMid) {
			setOpen(false);
		} else {
			setOpen(true);
		}
	}, [isTabletMid]);

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


	const toggleSubMenu = (menu: string) => {
		setDropdown(!dropdown);
		setSubMenuItems((prev: SubMenuItems) => ({
			...prev, [menu]: !prev[menu],
		}));
	};

	const SettingRoute = (link: string) => {
		router.push(link);
	};

	const handleLogout = () => {
		auth.signOut();
	};

	const isAuthuorised = userRole === UserRole.SUPERADMIN || userRole === UserRole.ADMIN || userRole === UserRole.PRESIDENT || userRole === UserRole.DIRECTOR;

	const MenuItems = [
		{ title: "Dashboard", icon: <MdSpaceDashboard />, link: "/dashboard", key: "dashboard" },
		{
			title: "Users",
			icon: <FaUsers />,
			gap: true,
			link: "/users",
			key: "users",
			showFor: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.PRESIDENT, UserRole.DIRECTOR]
		},
		{ title: "Books", icon: <FaBook />, gap: isAuthuorised ? false : true, link: "/books", key: "books" },
		{ title: "Notes", icon: <IoDocumentText />, link: "/notes", key: "notes" },
		{ title: "Questions", icon: <FaCircleQuestion />, link: "/questions", key: "questions" },
		{ title: "Support", icon: <MdOutlineHeadsetMic />, gap: true, link: "/support", key: "support" },
		{
			title: "Settings",
			icon: <FaGears />,
			key: "settings",
			subMenu: [
				{ title: "General", icon: <FaGear />, link: "/settings/general" },
				{ title: "Security", icon: <FaShieldHalved />, link: "settings/security" },
				// { title: "Notifications", icon: <FaBell />, link: "/settings/notifications" }
			]
		},
	];

	return (
		<div>
			<div
				onClick={() => setOpen(false)}
				className={`lg:hidden fixed inset-0 max-h-screen z-[998] bg-black/20 ${open ? "block" : "hidden"} `}
			></div>
			<div className={`${(isTabletMid && open) ? "fixed w-64 h-screen z-[999] bg-teal-900 duration-500 ease-in-out" : "lg:block hidden duration-300 ease-out h-full"}`}>
				<div className={`${open ? "xl:w-72 w-64 p-5" : "w-20 p-4"} bg-teal-900 h-screen pt-8 relative duration-300 ease-in-out`}>
					{/* Toggle button sections */}
					<div className={`absolute cursor-pointer -right-4 top-12 size-8 p-0.5 z-40 bg-zinc-50 border-teal-900 border-2 rounded-full text-xl flex items-center justify-center ${!open && "rotate-180"} transition-all ease-in-out duration-300`}
						onClick={() => setOpen(!open)}
					>
						{!open && isTabletMid ?
							<TbLayoutSidebarLeftExpand /> :
							<TbLayoutSidebarLeftCollapse />}
					</div>

					<div className="flex flex-col justify-between gap-5 h-full">
						<div className="flex flex-col gap-6">
							{/* Logo and title section */}
							<div className="flex gap-x-4 items-center">
								<Image src="/assets/images/logo.png" alt="Rhibms logo" width={70} height={70} className={`cursor-pointer ease-in-out duration-500 ${!open ? "rotate-[360deg] size-10" : "size-16"}`} />

								<h1 className={`text-teal-50 origin-left font-semibold text-xl duration-200 ease-in-out ${!open && "scale-0"}`}>
									RHIBMS
								</h1>
							</div>

							{/* Sidebar Navbar Items section */}
							<div>
								{MenuItems.map((item, index) => (
									(!item.showFor || item.showFor?.includes(userRole!)) && (<a key={index} href={item.link} onClick={() => item.key && toggleSubMenu(item.key)} className={`relative group flex flex-col rounded-md py-2 px-3 cursor-pointer hover:text-white text-zinc-50 hover:bg-teal-700/40 transition-all ease-in-out duration-300 ${item.gap ? "mt-4" : "mt-1"} ${active === item.title.toLowerCase() && "bg-teal-500/40"} ${dropdown === true && item.title.toLowerCase() === "settings" && "bg-teal-700/40"}`}>
										<div className="flex items-center justify-between gap-x-4">
											<div className="flex items-center relative gap-2">
												<span className="text-lg">
													{item.icon}
												</span>
												<span className={`${!open && "hidden"} origin-left ease-in-out duration-300`}>
													{item.title}
												</span>
												{!open && (
													<div
														className={`absolute left-8 z-50 rounded-md px-3 py-1 ml-6 font-semibold bg-teal-200 text-teal-800 text-sm invisible opacity-30 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 ease-in-out duration-300`}
													>
														{item.title}
													</div>
												)}
											</div>

											{item.subMenu && (
												<span
													className={`ml-auto cursor-pointer text-sm transition-transform ease-in-out duration-300 ${!open ? "hidden" : ""} ${subMenuItems[item.key] ? "rotate-360" : ""}`}>
													{subMenuItems[item.key] ?
														<FaChevronDown /> : <FaChevronRight />}
												</span>
											)}
										</div>

										{/* Sidebar subMenuItems Navbar Items */}
										{item.subMenu && subMenuItems[item.key] && (
											<ul className={`text-zinc-200 z-50 ${open ? "px-1 mt-6 absolute w-60 right-0 top-5 bg-teal-700 rounded-md" : "bg-teal-700 mt-2 py-2 px-3 rounded-md w-40 absolute left-12 top-0"}`}>
												{item.subMenu.map((subMenu, subIndex) => (
													<li key={subIndex} onClick={() => SettingRoute(subMenu.link)} className={`mt-1 text-sm flex items-center gap-x-2 py-2 px-2 pl-4 rounded-lg ${open ? "hover:bg-teal-600/60" : "hover:bg-teal-600"}`}>
														<span className="text-zinc-4">
															{subMenu.icon}
														</span>
														{subMenu.title}
													</li>
												))}
											</ul>
										)}
									</a>)
								))}
							</div>
						</div>

						<div className="flex flex-col gap-2">
							<a href="/login" onClick={handleLogout} className="group py-2 px-3 cursor-pointer rounded-md bg-white text-red-500 hover:bg-gray-100 transition-all ease-in-out duration-300">
								<div className="flex items-center justify-between gap-x-4 font-bold">
									<div className="flex items-center relative gap-2">
										<span className="text-lg">
											<CgLogOut />
										</span>
										<span className={`${!open && "hidden"} origin-left ease-in-out duration-300`}>
											Logout
										</span>
										{!open && (
											<div
												className={`absolute left-8 rounded-md px-3 py-1 ml-6 font-semibold bg-teal-200 text-red-500 text-sm invisible opacity-30 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 ease-in-out duration-300`}
											>
												Logout
											</div>
										)}
									</div>
								</div>
							</a>
							<div className={`border-t flex pb-0 ${open ? "py-3" : "py-2"}`}>
								<div className="bg-teal-50 size-10 rounded-xl">
									<img
										src={user.photoURL || "/assets/images/default user.png"}
										alt="User"
										className="size-full rounded-xl"
									/>
								</div>
								<div
									className={`flex justify-between items-center overflow-hidden transition-all ${open ? "w-52 ml-2" : "w-0"}`}
								>
									<div className="leading-4">
										<h4 className="font-semibold text-white capitalize">{`${user.firstName ? (user.firstName + " " + user.lastName) : user.displayName || "User"}`}</h4>
										<span className="text-xs text-gray-300">{user?.email}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="absolute z-10 lg:hidden left-5 top-4" onClick={() => setOpen(true)}>
				<TbLayoutSidebarLeftExpand size={25} />
			</div>
		</div>
	);
};

export default Sidebar;