# Bytes and Nibbles CMS

The Content Management System (CMS) for my tech and food blog: [Bytes and Nibbles](https://bytes-and-nibbles.web.app). Built with [FireCMS](https://firecms.co/), this CMS allows easy management of blog content including tech articles ("Bytes"), article series ("ByteSeries"), and food recipes ("Nibbles").

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (version 16 or higher)
- [Firebase](https://firebase.google.com/) account and project
- [Firebase CLI](https://firebase.google.com/docs/cli) (for deployment)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Samuel-Harris/Bytes-and-Nibbles-CMS.git
   cd bytes-and-nibbles-cms
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Firebase configuration:**
   - Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Enable Firestore Database, Firebase Storage, and Firebase Authentication
   - Generate your Firebase configuration and create the missing config files (see [Config Files](#config-files) section below)

### Development

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:5173](http://localhost:5173) to access the CMS.

Changes made in the CMS will automatically sync with your Firebase project.

## 📜 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality
- `npm run deploy` - Build and deploy to Firebase (requires Firebase CLI setup)

## 🏗️ Project Structure

```
src/
├── collections/          # Content collection definitions
│   ├── bytes.tsx        # Tech articles collection
│   ├── byteSeries.tsx   # Article series collection
│   └── nibbles.tsx      # Food recipes collection
├── App.tsx              # Main application component
├── firebase-config.ts   # Firebase configuration (you need to create this)
├── index.css            # Global styles
└── main.tsx             # Application entry point
```

## 🛠️ Technologies Used

- **[FireCMS](https://firecms.co/)** - Headless CMS framework
- **[React](https://reactjs.org/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Firebase](https://firebase.google.com/)** - Backend services (Firestore, Storage, Auth)
- **[Material-UI](https://mui.com/)** - React components library
- **[Vite](https://vitejs.dev/)** - Build tool and development server
- **[React Router](https://reactrouter.com/)** - Client-side routing

## Config Files

For the public version of this repo, I have removed the following files, which you need to implement yourself:

- `firestore.rules` - Firestore security rules
- `storage.rules` - Firebase Storage security rules
- `src/firebase-config.ts` - Firebase project configuration

### Setting up Firebase Config Files

1. **Firebase Configuration (`src/firebase-config.ts`):**
   ```typescript
   export const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "your-app-id"
   };
   ```

2. **Firestore Rules (`firestore.rules`):**
   Basic rules for content management:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

3. **Storage Rules (`storage.rules`):**
   Basic rules for file uploads:
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

Learn how to write your own authorisation-defining .rules files [here](https://firebase.google.com/docs/rules/basics).

Learn how to generate your own firebase-config.ts file [here](https://support.google.com/firebase/answer/7015592).

## 🚀 Deployment

To deploy the CMS to Firebase Hosting:

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase:**
   ```bash
   firebase login
   ```

3. **Initialize Firebase in your project:**
   ```bash
   firebase init
   ```
   Select Hosting, Firestore, and Storage when prompted.

4. **Deploy:**
   ```bash
   npm run deploy
   ```

## 📝 Content Management

The CMS manages three main content types:

- **Bytes** - Individual tech articles
- **ByteSeries** - Collections of related tech articles
- **Nibbles** - Food recipes and culinary content

Each collection has its own configuration defining fields, validation rules, and display options in the `src/collections/` directory.

## 📄 License

This project is licensed under the terms specified in the [LICENSE](LICENSE) file.
