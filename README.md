# RHIMBS Dashboard

A comprehensive university academic resource management dashboard built with Next.js, Firebase, and Tailwind CSS. This platform enables lecturers and academic authorities (deans, directors, HODs) to upload and manage educational resources that sync with the university's mobile application.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![Firebase](https://img.shields.io/badge/Firebase-11-orange?style=flat-square&logo=firebase)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-38b2ac?style=flat-square&logo=tailwind-css)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [User Roles](#user-roles)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Firebase Setup](#firebase-setup)
- [Building for Production](#building-for-production)
- [Available Scripts](#available-scripts)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

RHIMBS (Resource Management Information System) Dashboard is a web-based platform designed specifically for universities to manage and distribute academic resources. The system allows authorized personnel to upload books, notes, and questions that are then made available through the university's mobile application.

## ✨ Features

### Core Functionality

- **User Management** - Role-based access control system
- **Book Management** - Upload, edit, and manage academic books
- **Notes Management** - Upload and manage lecture notes
- **Question Bank** - Upload and manage exam questions
- **Dashboard Analytics** - View statistics and recent activities

### User Experience

- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Real-time Updates** - Data syncs instantly with Firebase
- **Role-based Views** - Different interfaces based on user permissions
- **Toast Notifications** - User feedback for all actions
- **Loading Animations** - Smooth loading states

### Security

- **Firebase Authentication** - Secure email/password login
- **Role-based Access Control** - Granular permissions
- **Firestore Security Rules** - Database-level protection

## 🛠 Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React 19** - UI library

### Backend & Services

- **Firebase Authentication** - User authentication
- **Firebase Firestore** - NoSQL database
- **Firebase Cloud Functions** - Server-side logic

### Key Dependencies

| Package                            | Purpose                            |
| ---------------------------------- | ---------------------------------- |
| `@tanstack/react-table`            | Data tables with advanced features |
| `react-icons`                      | Icon library                       |
| `lottie-react`                     | Animation support                  |
| `crypto-js`                        | Encryption utilities               |
| `react-responsive`                 | Responsive design hooks            |
| `tailwind-scrollbar`               | Custom scrollbar styling           |
| `uuid`                             | Unique identifier generation       |
| `react-export-table-to-excel-xlsx` | Excel export functionality         |

## 📁 Project Structure

```
rhimbs-dashboard/
├── public/                      # Static assets
│   ├── assets/
│   │   ├── icons/              # SVG icons
│   │   └── images/             # Images and logos
│   └── ...
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── books/              # Books management pages
│   │   │   ├── add/            # Add new book
│   │   │   └── page.tsx        # Books list
│   │   ├── components/         # Reusable UI components
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── BookForm.tsx
│   │   │   ├── NoteForm.tsx
│   │   │   ├── QuestionForm.tsx
│   │   │   └── ...             # Other components
│   │   ├── dashboard/          # Dashboard page
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── usePermissions.ts
│   │   │   └── useToast.tsx
│   │   ├── login/              # Authentication page
│   │   ├── notes/              # Notes management
│   │   ├── profile/            # User profile
│   │   ├── questions/          # Questions management
│   │   ├── services/           # Business logic
│   │   │   └── permissions.ts
│   │   ├── support/            # Support page
│   │   ├── users/              # User management
│   │   ├── utils/              # Utility functions
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home/landing page
│   └── firebase/               # Firebase configuration
│       ├── firebase.js         # Firebase initialization
│       └── functions/          # Firebase Cloud Functions
├── firebase.json               # Firebase configuration
├── firestore.rules             # Firestore security rules
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

## 👥 User Roles

The system implements a hierarchical role-based access control:

| Role           | Description                | Permissions                     |
| -------------- | -------------------------- | ------------------------------- |
| **SUPERADMIN** | System super administrator | Full access to all features     |
| **ADMIN**      | System administrator       | Full access to all features     |
| **PRESIDENT**  | University President       | View all data, manage resources |
| **DIRECTOR**   | Department Director        | View users, manage resources    |
| **LECTURER**   | Academic lecturer          | Manage own resources only       |

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js 18+
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository:**

```
bash
   git clone <repository-url>
   cd rhimbs-dashboard

```

2. **Install dependencies:**

```
bash
   npm install
   # or
   yarn install

```

3. **Set up environment variables:**

   Create a `.env.local` file in the root directory:

```
env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Admin Configuration
   NEXT_DEFAULT_ADMIN_EMAIL=admin@university.edu

```

4. **Run the development server:**

```
bash
   npm run dev

```

5. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## ⚙️ Environment Variables

| Variable                                   | Description                             | Required |
| ------------------------------------------ | --------------------------------------- | -------- |
| `NEXT_PUBLIC_FIREBASE_API_KEY`             | Firebase API Key                        | Yes      |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`         | Firebase Auth Domain                    | Yes      |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID`          | Firebase Project ID                     | Yes      |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`      | Firebase Storage Bucket                 | Yes      |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID            | Yes      |
| `NEXT_PUBLIC_FIREBASE_APP_ID`              | Firebase App ID                         | Yes      |
| `NEXT_DEFAULT_ADMIN_EMAIL`                 | Default admin email for auto-assignment | No       |

## 🔥 Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Enable Firestore Database
5. Enable Storage (for file uploads)

### 2. Configure Firestore Rules

The project includes `firestore.rules` with default security rules. Review and modify them according to your needs.

### 3. Set Up Cloud Functions (Optional)

The project includes Firebase Cloud Functions in `src/firebase/functions/`. Deploy them using:

```
bash
cd src/firebase/functions
npm install
firebase deploy --only functions
```

## 📦 Building for Production

```
bash
# Build the application
npm run build

# Start production server
npm start
```

## 📜 Available Scripts

| Script             | Description                             |
| ------------------ | --------------------------------------- |
| `npm run dev`      | Start development server with Turbopack |
| `npm run build`    | Build for production                    |
| `npm run start`    | Start production server                 |
| `npm run lint`     | Run Next.js linter                      |
| `npm run emulator` | Start Firebase emulators                |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Icons](https://react-icons.github.io/react-icons)

---

Built with ❤️ for University Academic Resource Management
