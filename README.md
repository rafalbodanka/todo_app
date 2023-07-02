# To do

This is a simple to do app. Set up the table with your colleagues, workmates or family and start planning your responsibilities together.

The app is deployed and can be accessed online at [your-deployment-link](https://www.example.com).

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Credits](#credits)

## Installation

### Backend

1. Make sure you have MongoDB installed and running on your system.
2. Open a terminal and navigate to the `backend` folder.
3. Install the required dependencies by running the following command:

   ```bash
   npm install
   ```

4. Create a .env file in the backend folder and specify the necessary environment variables. You can use the .env.example file as a template. Look at [Configuration](#configuration) for more details.

5. Start the backend server by running the following command:

   ```bash
   npm run start:dev
   ```

### Frontend

1. Open a new terminal and navigate to the frontend folder.
2. Install the required dependencies by running the following command:

   ```bash
   npm install
   ```

3. Start the development server by running the following command:

   ```bash
   npm start
   ```

Once both the backend and frontend servers are running, you should be able to access the app in your web browser at http://localhost:3000.

## Usage

Stay up to date with your crew's duties.

![Main view](./assets/main-view.png)

Create and manage the tables.

![Edit table admin view](./assets/edit-table-admin-view.png)

Users without permissions cannot modify the table.

![Edit table view](./assets/edit-table-view.png)

Create and manage the tasks.

![Edit task view](./assets/edit-task-view.png)

Update your personal data and change profile icon.

![User nav view](./assets/user-nav.jpg)

![User settings view](./assets/user-settings-view.jpg)

![User icon view](./assets/user-settings-icon-view.jpg)

Manage the table invitations.

![Invitations view](./assets/invitations-view.jpg)

![Invitations state view](./assets/invitations-state-view.jpg)

## Configuration

The following environment variables need to be set in order for the application to work properly:

SESSION_SECRET: This variable should be set to a secret key used for session encryption.
MONGODB_CONNECTION_STRING: This variable should contain the MongoDB connection string for your database.

Environment variables are set up with 'dotenv' package.

Open the .env file and add the environment variables in the following format:

SESSION_SECRET: This variable should be set to a secret key used for session encryption. Choose a strong, unique value for this variable. For example, SESSION_SECRET=your_session_secret_here.

MONGODB_CONNECTION_STRING: This variable should contain the MongoDB connection string for your database. Replace the placeholder values with your actual MongoDB connection details. For example, MONGODB_CONNECTION_STRING=mongodb+srv://your_username:your_password@your_cluster_url/your_database_name.

## Credits

This project utilizes most of all the following libraries, frameworks, and resources:

### Backend

- [Nest.js](https://nestjs.com/): A progressive Node.js framework for building efficient, scalable server-side applications.
- [MongoDB](https://www.mongodb.com/): A NoSQL database for storing and retrieving data.
- [bcrypt](https://www.npmjs.com/package/bcrypt): A library for hashing passwords and securing sensitive data.
- [Passport.js](http://www.passportjs.org/): An authentication middleware for Node.js that supports various authentication strategies.

### Frontend

- [React](https://reactjs.org/): A JavaScript library for building user interfaces.
- [Material-UI](https://material-ui.com/): A popular UI component library for React.
- [Tailwind CSS](https://tailwindcss.com/): A utility-first CSS framework for rapidly building custom user interfaces.
- [Axios](https://axios-http.com/): A promise-based HTTP client for making API requests.

Please refer to the documentation or official websites of these resources for more information on how they were used in this project.
