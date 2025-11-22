
# 📘 Habit Tracker — MERN Stack  
A fully featured habit-tracking web app built using **MongoDB, Express, React, Node.js**.  
Users can create habits, mark daily progress, view streaks, and visualize consistency using 7-day & 30-day heatmaps.

---

## 🚀 Features  
- ✔ User authentication (Register/Login)  
- ✔ JWT-based protected routes  
- ✔ Add habits  
- ✔ Mark habits as done for today  
- ✔ Delete habits  
- ✔ Automatic streak calculation  
- ✔ 7-day & 30-day Heatmaps  
- ✔ Global aggregate heatmap  
- ✔ Sorting (Name, Longest Streak, Current Streak)  
- ✔ Fully responsive UI  
- ✔ Secure backend + clean API  
- ✔ MongoDB database storage  


---

## 🛠️ Tech Stack

### **Frontend**
- React (Vite)
- React Router DOM
- Context API (Auth)
- Custom responsive CSS

### **Backend**
- Node.js
- Express.js
- Mongoose (MongoDB)
- bcryptjs (password hashing)
- JSON Web Tokens (JWT)

---

## 🔧 Installation & Setup

### **Clone the repository**
```bash
git clone https://github.com/UtkarshTailor/Daily-Habit-Tracker.git
cd habitTracker
````

---

# 🗄️ Backend Setup

```bash
cd backend
npm install
```

### Create a `.env` file inside backend:

```
PORT=5000
MONGO_URI=YOUR_MONGO_DB_URI
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
```

### Start backend:

```bash
npm run dev
```

---

# 🎨 Frontend Setup

```bash
cd habitTracker
npm install
```

### Create `.env` inside frontend:

```
VITE_API_URL=http://localhost:5000
```

### Start frontend:

```bash
npm run dev
```

---

## 🔐 Authentication Flow

* User registers → Password hashed with bcrypt
* Server returns JWT token
* Token stored in `localStorage`
* Protected API calls include:

  ```
  Authorization: Bearer <token>
  ```
* Dashboard is secured using `<PrivateRoute />`

---


## 🌐 Deployment Guide

### **Frontend (React)**

Deploy using:

* Vercel



### **Backend (Node/Express)**

Deploy using:

* Render

`

Make sure CORS allows your frontend domain.

---
