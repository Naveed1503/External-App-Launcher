External App Launcher

A Vue 3 + Vite powered External App Launcher with a mock OAuth login (Node/Express backend). Add, edit, or remove app shortcuts, open them in iframes or new tabs, and manage settings—all with local storage persistence.
Features:
🔐 OAuth2 Authentication (local or external server)
🖼 App Tiles with custom icons and URLs
📑 iFrame Preview or New Tab launch modes
🛠 Add/Edit/Delete apps dynamically
💾 LocalStorage Persistence for apps and tokens

⚙️ Installation & Setup
1️⃣ Prerequisites
Node.js
 (v18+ recommended)
npm (bundled with Node)
A GitHub account for hosting the repository
2️⃣Clone the Repository
git clone https://github.com/<Naveed1503>/external-app-widget.git
cd external-app-widget
3️⃣Install Dependencies
npm install
4️⃣ Start Backend (OAuth Server)
node server.js
5️⃣ Start Frontend (Vite Dev Server)
npm run dev2️
Visit: http://localhost:5173

🚀 Usage
Login – Click “Login with OAuth” to authenticate.
Add a New App – Open Settings, enter App Name, URL, Icon URL, and select launch mode.
Edit or Delete Apps – Click Edit or Cancel on any tile.
Open Apps – Choose Open to launch in iFrame or a new browser tab.


Note:
Step1- run backend
step2- run frontend

  `npm run dev`       Run development server (Vite).
  `npm run build`     Build production-ready files.
  `npm run preview`   Preview production build.
  `node server.js`    Start mock OAuth provider backend.
If the preview server starts on port 4173, simply update the URL in your browser.
Example: If http://localhost:5173 fails, try http://localhost:4173.
