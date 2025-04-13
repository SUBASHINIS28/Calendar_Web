# Smart Calendar - Event & Task Management System

## 📝 Overview

Smart Calendar is a comprehensive event and task management application with goal tracking capabilities. This full-stack application provides an intuitive interface for managing your schedule, organizing tasks based on goals, and visualizing your time allocation.

## ✨ Key Features

1. Multi-view Calendar: Day, Week, Month, and Year views for flexible planning

2. Event Management: Create, edit, delete, and drag-and-drop events across the calendar

3. Goal Tracking System: Create goals with color coding for visual organization

4. Task Management: Create tasks associated with specific goals

5. Task-to-Event Conversion: Drag tasks directly onto the calendar to convert them to events

6. Responsive Design: Works seamlessly across desktop and mobile devices

## 🚀 Tech Stack

### Frontend

> React 19 - UI library

> Redux Toolkit - State management

> React DnD - Drag and drop functionality

> Axios - API requests

> Tailwind CSS - Styling

### Backend

> Node.js - Runtime environment

> Express - Web framework

> MongoDB - Database

> Mongoose - ODM for MongoDB

#### Deployment

> Vercel - Frontend and Backend hosting

> MongoDB Atlas - Cloud database

## 🛠️ Installation and Setup

### Prerequisites

--> Node.js (v18+)

--> npm or yarn

--> MongoDB account (for production)

--> Local Development Setup

1. Clone the repo
   
   git clone https://github.com/yourusername/calendar.git
   
   cd calendar

3. Backend Setup
   
   cd backend
   
   npm install
   
   Create .env file with the following content:
   
   MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster.mongodb.net/calendar
   
   PORT=5000

   NODE_ENV=development
   
   npm run dev
   
4. Frontend Setup
   
   cd ../frontend
   
   npm install
   
   npm start
