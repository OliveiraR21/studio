# Br Supply Academy Stream

This is a Next.js application for the Br Supply Academy Stream platform.

## Getting Started

To run the application locally, you'll need to connect it to a Firebase project.

### 1. Set Up Firebase

1.  **Create a Firebase Project**: If you haven't already, create a new project at the [Firebase Console](https://console.firebase.google.com/).
2.  **Add a Web App**: In your project dashboard, add a new Web App (`</>`). This will give you the credentials for the web client.
3.  **Enable Firestore**: In the left menu, go to **Build > Firestore Database** and create a new database. **Start in test mode** for now to avoid permission issues during setup.
4.  **Generate Service Account Key**: Go to **Project settings > Service Accounts**, and click **"Generate new private key"**. This will download a JSON file which is needed for the database seeding script.

### 2. Configure Environment Variables

1.  Create a file named `.env` in the root of the project. You can copy the structure from the `.env.example` file.
2.  Fill in the values using the credentials from your Firebase project.
    *   The `NEXT_PUBLIC_*` variables are found in the web app configuration snippet from Step 2.
    *   The `FIREBASE_SERVICE_ACCOUNT_KEY` is the entire content of the JSON file you downloaded in Step 4. You must wrap the JSON content in quotes.

### 3. Seed the Database

Once your `.env` file is configured, you need to populate your Firestore database with the initial sample data (users, courses, etc.).

Open your terminal in the project's root directory and run the following command:

```bash
npm run db:seed
```

This script will connect to your Firebase project, clear any existing data, and upload all the sample users, modules, tracks, and courses.

### 4. Run the Development Server

Finally, start the development server. If it's already running, **you must restart it** for the changes in the `.env` file to take effect.

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result. The application should now load correctly with all the test users and courses.
