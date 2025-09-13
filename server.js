// server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve the built Vue app
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Mock OAuth endpoint
app.get('/auth/login', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Mock OAuth</title>
    </head>
    <body style="font-family:sans-serif;text-align:center;padding:50px;">
      <h1>Mock OAuth Provider</h1>
      <p>Click below to simulate a successful login.</p>
      <button style="padding:10px 20px;background:#3498db;color:#fff;border:none;border-radius:8px;"
        onclick="window.location='http://localhost:5173/?token=demo-token-123'">
        Authorize App
      </button>
    </body>
    </html>
  `);
});

// ✅ Fixed fallback route for Vue Router (using regex)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);
