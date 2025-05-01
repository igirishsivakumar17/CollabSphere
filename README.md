# CollabSphere
A Prototype for Bytebash 2025

CollabSphere is a collaborative platform designed to connect developers, designers, and creators. It allows users to create and manage projects, express interest in projects, participate in discussions, and receive personalized project recommendations based on their skills.

---

## Features

### 1. **User Management**
- **Authentication**: Users can register and log in securely.
- **Profile Management**: Users can update their profile details, including their skills, expertise, and other relevant information.

### 2. **Project Management**
- **Create and Manage Projects**: Users can create projects, define requirements, and manage collaborators.
- **Requirements Section**: Projects include a detailed requirements section where users can specify skills, total positions, and currently filled positions.

### 3. **Interest Management**
- **Express Interest**: Users can express interest in projects and track the status of their interest (e.g., accepted, rejected).
- **Interest Status Updates**: Project owners can update the status of interests expressed by users.

### 4. **Discussions**
- **Project Discussions**: Users can start and participate in discussions related to projects.
- **Comments and Upvotes**: Discussions support comments and upvotes for both discussions and individual comments.

### 5. **Skill-Based Recommendations**
- **Suggested Projects**: Users receive personalized project recommendations based on their skills. The system matches user skills with project requirements to suggest relevant projects.

### 6. **Search and Explore**
- **Search Projects**: Users can search for projects by name, skills, or expertise.
- **Pagination**: Search results are paginated for better usability.

### 7. **Responsive Design**
- The platform is optimized for various screen sizes, ensuring a seamless experience across devices.

---

## Architecture

### 1. **Frontend**
- Built with **React.js**.
- Features a modular component-based architecture.
- Includes reusable components like `Project`, `Navbar`, and `ProjectForm`.

### 2. **Backend**
- Built with **Node.js** and **Express.js**.
- Uses **Firebase** for database and authentication.
- Implements RESTful APIs for user, project, interest, and discussion management.

### 3. **Database**
- **Firebase Firestore** is used as the primary database.
- Data is structured into collections such as `users`, `projects`, `interests`, and `discussions`.

---

## API Overview

### 1. **User APIs**
- Fetch user profile details.
- Update user skills and other profile information.

### 2. **Project APIs**
- Create, update, and fetch projects.
- Search projects by name, skills, or expertise.

### 3. **Interest APIs**
- Express interest in a project.
- Update the status of an interest (e.g., accepted, rejected).

### 4. **Discussion APIs**
- Create discussions for a project.
- Add comments to discussions.
- Upvote discussions and comments.

### 5. **Recommendation APIs**
- Fetch personalized project recommendations based on user skills.

---

## Folder Structure

### 1. **Client**
- Contains the React.js frontend code.
- Key directories:
  - `src/components`: Reusable components like `ProjectForm`, `Navbar`, and `Project`.
  - `src/pages`: Pages like `Dashboard`, `Profile`, and `Project`.

### 2. **Server**
- Contains the Node.js backend code.
- Key directories:
  - `controllers`: Handles the business logic for various routes.
  - `routes`: Defines API endpoints for users, projects, interests, and discussions.
  - `config`: Contains Firebase configuration.

---

## Workflow

### 1. **User Registration and Profile Setup**
- Users register and log in to the platform.
- They update their profile with skills and expertise.

### 2. **Project Creation and Management**
- Users create projects and define requirements.
- Other users can express interest in these projects.

### 3. **Skill-Based Recommendations**
- The system fetches user skills and matches them with project requirements to suggest relevant projects.

### 4. **Discussions and Collaboration**
- Users can start discussions on projects and collaborate through comments and upvotes.

---

## Contribution Guidelines

We welcome contributions to CollabSphere! To contribute:
1. Fork the repository and create a new feature branch.
2. Make your changes and test them thoroughly.
3. Submit a pull request with a clear explanation of the changes.

---

## License

CollabSphere is licensed under the **MIT License**. You are free to use, modify, and distribute the code in accordance with the license terms.

---

## Contact

For any questions, feedback, or support, please contact **igirishsivakumar17**.
