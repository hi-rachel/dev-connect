<p align="middle">
<img src="https://github.com/hi-rachel/dev-connect/assets/103404125/53e3577f-1ea2-4cdc-82de-1a86c4a48d75" width="150">
</p>

<h1 align="middle">Dev Connect</h1>

![Dev Connect](https://github.com/hi-rachel/dev-connect/assets/103404125/72d972d0-529f-44d0-b0c7-2cb7467d50de)

<br>

> <p align="middle"><a href="https://realtime-x-1f51f.web.app/" target="_blank">🔗 https://realtime-x-1f51f.web.app</a></p>
>
> <p align="middle">💬 Dev Connect is primarily a community space where developers can communicate in real time.</p>

<br>

## ⚙️ Tech Stack

- React, TypeScript
- Firebase, Firestore
- Vite, Npm
- Styled-Components, Tailwind CSS

## 🌟 Key Features

- A community with real-time updates
  - CRUD for posts, tags, and photos
- Infinite scroll functionality
- Like and bookmark features
- Search functionality (including post content, author, and tags)
- Responsive design
- Login with email, Google, or GitHub

## 💻 Getting Started

1. Clone this repository.

```
git clone https://github.com/hi-rachel/dev-connect.git
```

2. Firebase Setup
   To connect to Firebase, follow these steps:

   1. Go to the Firebase Console and create a new project (or use an existing one).
   2. In your project overview, click the gear icon next to "Project Overview" and select "Project settings".
   3. Under the "General" tab, find "Your apps" and click on the </> icon to create a new web app.
   4. Follow the instructions to register the app and add Firebase SDK to your project.
   5. Copy the Firebase configuration object provided.
   6. Create a firebase.ts file in the src folder of your project and add the Firebase configuration:

```typescript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "your_api_key",
  authDomain: "your_auth_domain",
  projectId: "your_project_id",
  storageBucket: "your_storage_bucket",
  messagingSenderId: "your_messaging_sender_id",
  appId: "your_app_id",
  measurementId: "your_measurementId",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);
```

> Important: Be cautious not to expose your Firebase configuration keys publicly. Even though firebase.ts is already ignored by .gitignore, ensure it's not accidentally committed to version control.

After the Setup is complete, run the following command

```
cd dev-connect
npm install
npm run dev
```

## 🐞 Bug Reports

For [bug reports](https://github.com/hi-rachel/dev-connect/issues) or questions, please send an email to rachel.uiux@gmail.com.

## 📃 License

This project is MIT licensed.
