🌍 BhumiSetu – Land Information & Governance Platform
Bridging the gap between citizens and transparent land governance.

BhumiSetu is a web-based Land Information and Governance Platform designed to make land-related information more accessible, transparent, and manageable. It aims to simplify the interaction between citizens and government authorities by providing a centralized digital platform for accessing land information and governance services.

The platform provides role-based access for public users and government officials, secure authentication, and an organized interface for accessing land-related information.

🚀 Key Features
🔐 Authentication & User Management
Secure user registration and login.

Role-based authentication for:

Public Users – Access land-related information and platform services.

Government Officials – Access authorized government functionalities.

Password hashing using bcrypt.

JWT-based authentication using HTTP-only cookies.

Government ID-based authentication for government officials.

Protected routes and authorization middleware.

🏡 Land Information Management
Centralized access to land-related information.

Structured presentation of geographical and land records.

Database-backed land information management.

👥 Role-Based Access Control
Separate access privileges for public users and government officials.

Authentication and authorization middleware to protect restricted resources.

Role-specific user experiences.

🌐 User Interface
React-based frontend.

Component-based architecture.

API integration with backend services.

Responsive and user-friendly interface.

🛠️ Tech Stack
Category	Technologies
Frontend	React.js, JavaScript, HTML, CSS
Backend	Node.js, Express.js
Authentication Database	MongoDB Atlas
ODM	Mongoose
Land Information Database	PostgreSQL
Database ORM	Prisma
Authentication	JWT, bcrypt
API Communication	REST APIs, Fetch/Axios
Development Tools	VS Code, Git, GitHub
🏗️ System Architecture
BhumiSetu follows a modular architecture in which the frontend communicates with backend services through REST APIs.

                 BHUMISETU
                     |
              React Frontend
                     |
              API Integration
                     |
          +----------+----------+
          |                     |
   Authentication         Land Information
      Backend                Backend
          |                     |
    Node.js + Express     Node.js + Express
          |                     |
       Mongoose                Prisma
          |                     |
      MongoDB Atlas          PostgreSQL
Why two databases?

MongoDB: Handles user accounts, authentication, credentials, roles, and government IDs.

PostgreSQL: Handles structured land and geographical information.

This separation allows authentication and land information management to operate as independent backend modules.

📂 Project Structure
The project is organized into frontend and backend modules.

BhumiSetu/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
└── README.md
Note: The structure above represents the main logical modules. Actual folders may differ depending on the final integration of both backend services.

⚙️ Installation & Setup
Follow these steps to run BhumiSetu locally.

1. Clone the Repository
git clone <YOUR_REPOSITORY_URL>
cd land-information-governance-platform
2. Setup the Frontend
cd frontend
npm install
npm run dev
The frontend will run at the local URL provided by Vite, usually:

http://localhost:5173

3. Setup the Authentication Backend
Open another terminal:

cd backend
npm install
Create a .env file in the backend directory:

PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
Start the backend:

npm run dev
If your project does not have a dev script, use:

node server.js
4. Setup the Land Information Backend
Navigate to the land information backend directory and install its dependencies.

Configure the PostgreSQL database connection and Prisma environment variables according to that backend's configuration.

Run the required Prisma migrations and start the service using its configured npm script.

🔑 Authentication Workflow
A user selects their account type: Public or Government.

The user registers or logs in through the authentication interface.

The backend validates the submitted credentials.

Passwords are securely hashed using bcrypt.

Government users are additionally validated using their Government ID.

After successful authentication, a JWT is generated.

The JWT is stored in an HTTP-only cookie.

Protected routes validate the user's authentication and role before granting access.

🔒 Security Considerations
Passwords are never stored as plain text.

bcrypt is used for password hashing.

JWT-based authentication is used for session management.

HTTP-only cookies help protect authentication tokens from JavaScript access.

CORS is configured to allow requests from the authorized frontend origin.

Role-based authorization restricts access to protected resources.

Environment variables are used for sensitive configuration.

🎯 Project Objectives
Improve accessibility of land-related information.

Promote transparency in land governance.

Simplify interactions between citizens and government authorities.

Provide a structured digital platform for land information.

Implement secure authentication and role-based access.

Build a scalable and modular architecture for future development.

🔮 Future Scope
Integration of GIS-based maps and geographical visualization.

Advanced land record search and filtering.

Digital land document management.

Additional government services and workflows.

Improved data verification and validation mechanisms.

Enhanced analytics and reporting for governance authorities.

👨‍💻 Contributors
Developed as a collaborative academic project focused on digital land governance and public information accessibility.

Project: BhumiSetu – Land Information & Governance Platform

Domain: Web Development | Database Management | Digital Governance

📜 License
This project is developed for academic and educational purposes. Licensing and reuse permissions can be defined as the project evolves.

