# MealFlow - Monthly Meal Plan Booking System

MealFlow is a premium, full-stack web application designed for seamless food subscription management. Built with a focus on high-end aesthetics (Vanilla CSS) and robust data handling (Firebase Firestore), it provides an end-to-end solution for both customers and administrators.

## Live demo and repository (for submission)

- **GitHub repository**: paste your public repo link (for example `https://github.com/<you>/Food_Booking_App`).
- **Live deployed link**: [https://jeni-food-booking-app.surge.sh/](https://jeni-food-booking-app.surge.sh/)

## ✨ Key Features
- **Interactive Weekly Menu**: A beautifully designed grid showcasing breakfast, lunch, and dinner selections for 7 days.
- **Three-Tier Subscription System**:
  - **Basic Plan** (₹2000): Essential nutrition for weekdays.
  - **Healthy Plan** (₹3000): High-protein, 7-day accessibility (Most Popular).
  - **Choice Plan** (₹4000): Premium ingredients and complete customization.
- **Smart Booking Flow**:
  - **Real-time Validation**: Ensures all user details are accurate before submission.
  - **Duplicate Prevention**: Intelligently prevents multiple active subscriptions for the same phone number.
- **Admin Dashboard**: A secure management portal to track active subscriptions, plan distribution, and member details.
- **Premium UI/UX**: Custom CSS system with glassmorphic elements, modern typography (Outfit/Inter), and smooth transitions.

## 🛠 Tech Stack
- **Frontend**: HTML5, CSS3 (Advanced Vanilla System), JavaScript (ES6+)
- **Backend**: Firebase Firestore 

## 📦 Setup Instructions

### 1. Firebase (Data Storage)

Bookings are stored in **Cloud Firestore** in the `bookings` collection. Configuration lives in `js/firebase-config.js`. For your own project:

1. Create a project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Firestore** (start in test mode for development; tighten **rules** before production).
3. Register a web app and copy the config into `firebaseConfig` in `js/firebase-config.js`.

The **Admin** page (`admin.html`) reads the same collection and lists **user**, **plan**, and **status** (plus phone, start date, and total for operations).

### 2. Local Execution

Open `index.html` in a browser, or use a local static server (for example VS Code **Live Server**). Use **`index.html`** for the booking flow and **`admin.html`** for all subscriptions.

### 3. Docker (Local Containerized Setup)

You can run the application locally using Docker. A complete configuration is provided.

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/).
2. Open your terminal in this directory.
3. Run the following command:
   ```bash
   docker-compose up -d
   ```
4. Access the application in your browser at:
   - Client App: [http://localhost:8888/index.html](http://localhost:8888/index.html)
   - Admin Panel: [http://localhost:8888/admin.html](http://localhost:8888/admin.html)
5. To stop the container, run:
   ```bash
   docker-compose down
   ```

---

*Assignment: Monthly Meal Plan Booking Module*