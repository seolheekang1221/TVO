Project Overview
This project consists of two main components: the client (frontend) and the server (backend). The client is built using React and the server is built with Node.js, with MongoDB as the database to store user data and search history.

Project Structure
Client (Frontend)
Navigate to the client directory and initialize the project:
bash
Copy code
cd client
npm init
npm start
Server (Backend)
Navigate to the server directory, initialize the project, and start the server:
bash
Copy code
cd server
npm init
node index.js
Features Implemented
User Authentication
Signup: Users can sign up by providing a username, email, and password.
Login: Users can log in with their username and password.
Search Functionality
Users can search for a city or click on an icon on the map to get weather information.
The search history is displayed to the user.
Persistent Data
User information and search history are saved in the database.
On refreshing the site, the user data and search history are retained, ensuring a seamless user experience.
Database Integration
All user data and search history are stored in a MongoDB database, ensuring scalability and reliability.
