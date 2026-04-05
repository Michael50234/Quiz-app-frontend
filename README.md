<h1>Overview</h1>

**Quiz App** is a full-stack web application that enables users to create, share, and play interactive quizzes. It also includes features which allow users to create their own profile and view their past quiz attempts. The frontend is built using Next.js and React, and Material UI

<h1>Features</h1>

**Image Handling:**
Uses Firebase Storage to support user image uploading (e.g., quiz cover images and question images). The frontend handles image selection, previewing, and uploading, then sends the resulting image URLs to the backend for persistence.

**API Integration & State Management:**
Communicates with a Django backend through structured API calls to handle quiz data, user authentication, and other application features. A global state is used to store user data, enabling consistent access to authentication and user-specific information across the application.

**Authentication & Route Protection:**
Implements authentication by checking for a populated global user state. Protected routes and conditional rendering are used to restrict access to certain pages (e.g., quiz creation and editing) to authenticated users only.

**UI/UX Design:**
Utilizes reusable components, responsive layouts, and a cohesive color scheme to create a visually appealing and consistent design.
