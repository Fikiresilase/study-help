📚 StudyHelp: AI-Powered Learning App 🚀
StudyHelp: AI-powered learning app with interactive chat, course quizzes, and progress tracking. Built with React Native and Express for a seamless, engaging educational experience on iOS/Android. 🚀📚
✨ Features

AI Chat 🤖

Engage with an AI tutor via the AskAi feature.
Get instant answers with a friendly "Hello" greeting.


Course Quizzes 📝

Interactive quizzes with AI evaluation (QuestionScreen).
Code-based answers using a custom code editor (AppCodeEditor).
Modal feedback with formatted text and code snippets.


Progress Evaluation 📈

Track enrolled courses and progress (AccountScreen).
View user profile (username, email) and course images.
Skeleton loaders for smooth loading states.


Responsive Design 📱

Built with React Native for iOS and Android.
Smooth navigation using @react-navigation.
Styled with no-shadow cards, #007AFF accents, and #f4f4f4 backgrounds.



🛠️ Tech Stack

Frontend: React Native
Backend: Express, MongoDB (assumed for User, Course models) 🗄
APIs: gemini dlash 2.0 
Styling: Tailwind-inspired CSS, no-shadow cards, rounded corners 🎨

🚀 Getting Started
Follow these steps to set up StudyHelp locally! 🛠️
Prerequisites

Node.js (>= 16.x) 🟢
npm or Yarn 📦
Expo CLI (npm install -g expo-cli) 📱
MongoDB (local or Atlas) 🗃️

Installation

Clone the Repository 📥
git clone https://github.com/Fikiresilase/study-help.git
cd studyhelp


Install Frontend Dependencies ⚙️
npm install


Install Backend Dependencies 🖥️
cd backend
npm install


Set Up Environment Variables 🔑

Create .env in backend/:PORT=5000
MONGO_URI=your-mongodb-connection-string




Run the Backend 🌐
cd backend
node app.js


Run the Frontend 📱

In the root directory:npx expo start


Scan the QR code with the Expo Go app (iOS/Android) or run on an emulator:npx expo run:ios
npx expo run:android





🎯 Usage

AI Chat 🤖

Navigate to the AskAi screen.
Type questions and get AI responses.


Take Quizzes 📝

Access quizzes via the Learn screen.
Submit code answers in QuestionScreen.
View AI feedback in a modal with formatted code snippets.


Track Progress 📈

Check enrolled courses and profile in AccountScreen.
Monitor progress via course data.



🛡️ Contributing
We welcome contributions! 🙌

Fork the repo 🍴
Create a branch (git checkout -b feature/awesome-feature) 🌿
Commit changes (git commit -m "Add awesome feature") ✍️
Push to the branch (git push origin feature/awesome-feature) 🚀
Open a Pull Request 📬

📜 License
This project is licensed under the MIT License. See LICENSE for details. 📄


