# 🛡️ PhishGuard AI
### AI-Powered Phishing URL Detection System

PhishGuard AI is a web-based security application designed to analyse suspicious URLs and help users identify potential phishing and malicious website threats.

The system combines **rule-based URL analysis, Groq AI assessment, and URLhaus threat intelligence** to provide users with an overall risk assessment. It also includes a scan history feature and an interactive dashboard to help users review previous analyses.

---

## 📌 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [How It Works](#-how-it-works)
- [Risk Classification](#-risk-classification)
- [Technology Stack](#-technology-stack)
- [Project Architecture](#-project-architecture)
- [Project Structure](#-project-structure)
- [Installation and Setup](#-installation-and-setup)
- [Environment Configuration](#-environment-configuration)
- [API Endpoint](#-api-endpoint)
- [Security Considerations](#-security-considerations)
- [Future Enhancements](#-future-enhancements)
- [Developer](#-developer)

---

## 🎯 Project Overview

Phishing is a common online security threat in which attackers use deceptive websites and links to trick users into sharing sensitive information.

PhishGuard AI aims to make URL analysis easier by examining different characteristics of a submitted URL and combining multiple sources of assessment.

Instead of depending on a single detection method, the application uses three main analysis components:

1. **Rule-Based Detection:** Examines URL patterns and suspicious characteristics.
2. **Groq AI Assessment:** Provides an additional AI-based analysis.
3. **URLhaus Integration:** Checks submitted URLs against known malware URL intelligence.

The results are combined to display an overall risk assessment through a user-friendly interface.

---

## ✨ Key Features

### 1. URL Scanner
- Accepts website URLs for analysis.
- Sends submitted URLs to the backend for processing.
- Displays the analysis results through the frontend.

### 2. Rule-Based URL Detection
Examines suspicious URL characteristics, including:
- Use of HTTP instead of HTTPS.
- IP addresses used as hostnames.
- Suspicious words in domain names.
- Unusually long URLs.
- Multiple hyphens.
- Excessive hostname labels.
- Use of the `@` symbol.
- Known URL shortener domains.

### 3. Groq AI Assessment
- Uses the Groq API for AI-based URL assessment.
- Provides an additional assessment alongside rule-based detection.
- Helps identify suspicious URL patterns.

### 4. URLhaus Threat Intelligence
- Integrates with the URLhaus API.
- Checks whether a submitted URL is listed in its malware URL database.
- Displays the URLhaus lookup result.

### 5. Overall Risk Classification
Displays the combined assessment using four categories:
- High
- Medium
- Low
- Incomplete

### 6. Scan History
- Stores previous scan results in browser local storage.
- Displays previously analysed URLs.
- Provides an option to view scan details.
- Allows users to clear their scan history.

### 7. Interactive Dashboard
- Displays total scans.
- Shows High, Medium, and Low risk counts.
- Presents risk distribution.
- Displays recent scan activity.

---

## 🔄 How It Works

The application follows a frontend-backend architecture.

```text
             USER
               |
               v
       FRONTEND INTERFACE
          (HTML/CSS/JS)
               |
               v
        URL SUBMISSION
               |
               v
        EXPRESS BACKEND
               |
       +-------+-------+
       |       |       |
       v       v       v
    RULES    GROQ    URLHAUS
  ANALYSIS    AI      API
       |       |       |
       +-------+-------+
               |
               v
       RESULT PROCESSING
               |
               v
       OVERALL RISK RESULT
               |
               v
       FRONTEND DISPLAY
               |
          +----+----+
          |         |
          v         v
       HISTORY  DASHBOARD
```

### Workflow Explanation

1. The user enters a URL into the scanner.
2. The frontend JavaScript sends the URL to the backend using an HTTP POST request.
3. The Express backend receives the request.
4. The rule-based service analyses the URL characteristics.
5. The Groq API provides an additional AI assessment.
6. The URLhaus service checks its malware URL intelligence database.
7. The backend processes the available results and determines an overall risk level.
8. The frontend displays the result.
9. Successful scan results are stored in browser local storage and displayed in scan history and the dashboard.

---

## 🚦 Risk Classification

PhishGuard AI uses the following risk categories:

| Risk Level | Description |
|---|---|
| High | Significant warning signs or a known malware listing were detected. |
| Medium | One or more suspicious URL characteristics were detected. |
| Low | No warning signs were identified by the available checks. |
| Incomplete | One or more analysis services were unavailable, preventing a complete assessment. |

**Note:** A Low risk result does not guarantee that a website is safe.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Frontend page structure |
| CSS3 | User interface and styling |
| JavaScript | Frontend functionality |
| Node.js | Backend runtime |
| Express.js | Backend server and API routes |
| Groq API | AI-based URL assessment |
| URLhaus API | Malware URL intelligence |

---

## 🏗️ Project Architecture

The project is divided into two main parts:

### Frontend
Responsible for:
- User interface.
- URL input and submission.
- Displaying scan results.
- Maintaining scan history.
- Displaying dashboard statistics.

### Backend
Responsible for:
- Receiving frontend requests.
- Performing rule-based URL analysis.
- Communicating with external APIs.
- Processing analysis results.
- Returning results to the frontend.

---

## 📁 Project Structure

```text
PhishGuard-AI/
│
├── backend/
│   │
│   ├── controllers/
│   │   └── analyzeController.js
│   │
│   ├── routes/
│   │   └── analyzeRoutes.js
│   │
│   ├── services/
│   │   ├── analyzeService.js
│   │   └── urlhausService.js
│   │
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   └── .env (local configuration only)
│
├── frontend/
│   │
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── dashboard.html
│   └── dashboard.js
│
├── .gitignore
└── README.md
```

---

## ⚙️ Installation and Setup

Follow these steps to run PhishGuard AI locally.

### Prerequisites

Install the following software:
- Node.js
- npm
- Visual Studio Code
- Live Server extension for VS Code

### Step 1: Clone the Repository

```bash
git clone https://github.com/virvardhanp/PhishGuard-AI.git
```

### Step 2: Open the Project

```bash
cd PhishGuard-AI
```

### Step 3: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 4: Configure Environment Variables

Create a `.env` file inside the `backend` directory.

Add your own API credentials:

```env
GROQ_API_KEY=your_groq_api_key
URLHAUS_AUTH_KEY=your_urlhaus_auth_key
```

Replace the placeholder values with your own credentials.

**Important:** Never upload your actual `.env` file or API keys to GitHub.

### Step 5: Start the Backend Server

From the `backend` directory, run:

```bash
node server.js
```

The backend starts on port `5000`, unless configured otherwise.

### Step 6: Run the Frontend

1. Open the `frontend` folder in Visual Studio Code.
2. Right-click `index.html`.
3. Select **Open with Live Server**.
4. The application opens in your browser.

---

## 🔌 API Endpoint

The backend provides the following main analysis endpoint:

### Analyze URL

| Property | Value |
|---|---|
| Method | POST |
| Endpoint | `/api/analyze` |
| Local URL | `http://localhost:5000/api/analyze` |
| Content-Type | `application/json` |

Example request:

```json
{
  "url": "https://example.com"
}
```

The endpoint processes the submitted URL and returns the available analysis results.

---

## 🔐 Security Considerations

- API credentials are stored in backend environment variables.
- The `.env` file is excluded from Git using `.gitignore`.
- The backend performs URL analysis without requiring users to open the submitted website.
- URLhaus not listing a URL does not prove that the URL is safe.
- AI-generated assessments should be treated as additional information, not definitive security decisions.

---

## 🚀 Future Enhancements

Potential improvements for future versions include:

- Browser extension integration.
- Real-time URL monitoring.
- Enhanced phishing detection techniques.
- Domain age and reputation analysis.
- Detailed downloadable scan reports.
- User authentication and personalised scan history.
- Additional threat intelligence integrations.

---

## 👨‍💻 Developer

**Virvardhan Patil**

GitHub: [@virvardhanp](https://github.com/virvardhanp)

Project Repository: [PhishGuard AI](https://github.com/virvardhanp/PhishGuard-AI)

---

## 📄 License

No license has been added to this repository yet.

---

**PhishGuard AI — Analyse suspicious URLs and make more informed browsing decisions.** 🛡️
