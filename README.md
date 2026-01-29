🏋️ Workout Plan App

A mobile workout planning application that allows users to create, organize, and track workout routines in a clean, structured, and secure way.

Built with a **real-world architecture**, focusing on scalability, UX, and maintainability.

---

## ✨ Features

### 🔐 Authentication
- Email & password registration
- Secure login with JWT
- Persistent login (user stays signed in)
- Secure token storage on device
- Manual logout

> Forgot password is intentionally deferred and planned for a future phase.

---

### 📋 Workout Planning
- Create multiple workout **plans**
- Each plan contains multiple **days**
- Each day automatically includes:
  - Warmup
  - Workout
  - Stretch
- Add, edit, and delete **exercises** per section

---

### 🧠 Exercise Types
- **Reps-based exercises**
  - Sets + reps (e.g. `3 x 12`)
- **Time-based exercises**
  - Seconds / minutes / hours
- Validation handled on both client and server

---

### 🖐️ UX Enhancements
- Welcome screen with background image
- Card-based layouts
- Loading and empty states
- Pull-to-refresh
- Swipe-to-delete plans (with confirmation)
- Persistent session (no auto-logout)
- Inline validation messages (no disabled buttons)

---

## 🧩 App Structure

User
└── Plan
└── Day
└── Section (warmup / workout / stretch)
└── Exercise


All data is **user-scoped** and protected by backend ownership checks.

---

## 🛠 Tech Stack

### Mobile App
- React Native
- Expo
- TypeScript
- React Navigation (Native Stack)
- Axios
- Expo Secure Store
- React Native Gesture Handler

### Backend
- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- bcrypt (password hashing)

---

## 🧭 Navigation Flow

### Signed Out
- Welcome Screen
- Login
- Register

### Signed In
- Plans
- Plan → Days
- Day → Sections
- Exercises (Add / Edit)

Navigation is conditionally rendered based on authentication state.

---

## 🔐 Security Decisions

- Passwords are never stored in plain text
- JWT tokens are stored securely on device
- Backend validates ownership at every level
- Destructive actions require confirmation
- Forgot password will follow non-enumeration best practices

---

## 🚀 Getting Started

### Backend
1. Install dependencies
2. Set up PostgreSQL
3. Configure environment variables
4. Run Prisma migrations
5. Start the server

### Mobile App
1. Install dependencies
2. Start Expo (`npm start` or `expo start`)
3. Run on emulator or Expo Go
4. Make sure backend is reachable from device

---

## 🧪 Development Notes

- Designed and built in **phases**
- Core functionality prioritized before advanced features
- UI and UX refined incrementally
- Architecture allows easy future expansion

---

## 🔮 Planned Features (Future)
- Forgot password flow
- Phone number / OTP authentication
- Exercise timers
- Templates
- Drag & drop reordering
- Exercise history & analytics
- Image uploads

---

## 📌 Status

✅ Authentication  
✅ Plans, Days, Sections, Exercises  
✅ Persistent login  
✅ Modern UX patterns  
✅ Production-style architecture  

This project is **feature-complete for a workout planner MVP** and ready for future enhancements or portfolio presentation.

---

## 👩‍💻 Author

Built by **Vasilika**  