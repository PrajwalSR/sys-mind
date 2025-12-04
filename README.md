# SysMind: AI System Design Interview Partner

**SysMind** is an intelligent, interactive AI partner designed to help you master System Design interviews. Unlike standard chatbots, SysMind offers a specialized environment with a live whiteboard, multiple interaction modes, and deep architectural knowledge.

![SysMind Interface](https://via.placeholder.com/800x450?text=SysMind+Interface+Preview)

## 🚀 Key Features

### 1. Three Specialized Modes
SysMind adapts to your learning style with three distinct modes:

*   **🏗️ Solution Mode (Default)**
    *   **Goal**: Learn from an expert.
    *   **Behavior**: The AI acts as a Senior Principal Architect. It collaborates with you, asks comprehensive clarifying requirements using **dynamic forms**, and then proactively designs and explains the ideal system.
    *   **Enhanced**: The AI presents structured forms with 5-7 comprehensive questions covering cloud provider, scale, features, geography, performance, and special requirements.
    *   **Cloud Provider Selection**: Every form includes cloud provider selection (AWS/GCP/Azure) as the first field, ensuring diagrams use the correct cloud-specific icons.
    *   **Best for**: Learning new patterns and seeing "perfect" solutions.

*   **🎤 Interview Mode (Coming Soon)**
    *   **Goal**: Test your skills.
    *   **Behavior**: The AI acts as a Socratic interviewer. It asks probing questions, challenges your assumptions, and gives hints without revealing the answer.
    *   **Best for**: Mock interviews and active practice.

*   **🎨 Review Mode (Coming Soon)**
    *   **Goal**: Get feedback on your ideas.
    *   **Behavior**: You describe a system (e.g., "I have a React app talking to a Node backend..."), and the AI visualizes it and critiques it for bottlenecks, SPOFs (Single Points of Failure), and scalability issues.
    *   **Best for**: Validating your own designs.

### 2. Enhanced Dynamic Requirement Forms 🎯
*   **Comprehensive Questioning**: When you ask to design a system (e.g., "Design Instagram", "Design URL Shortener"), the AI presents a structured form with 5-7 comprehensive questions.
*   **Required Cloud Provider**: Every form includes cloud provider selection (AWS/GCP/Azure) as the first required field, with client-side validation.
*   **Complete Categories**: Forms cover all critical aspects:
    - Cloud Provider (always first)
    - Scale/Volume (users, traffic, data size)
    - Key Features/Functionality
    - Geographic Distribution (regions)
    - Performance Requirements (latency, quality)
    - Special Requirements (compliance, security, analytics)
*   **Smart Field Types**: Number inputs for quantities, dropdowns for predefined choices, text fields for custom requirements.
*   **Clean History**: Submitted values are formatted and displayed in the chat for easy reference.

### 3. Live Architecture Diagrams (draw.io) 🎨
*   **Cloud Provider Aware**: Diagrams automatically use the correct cloud-specific icons based on your selected provider (AWS, GCP, or Azure).
*   **On-Demand Visualization**: Click the **"Visualize"** button at any time to generate a professional system architecture diagram based on your current conversation.
*   **Interactive Editing**: Toggle between View and Edit modes to customize your diagrams.
*   **Self-Healing with Retry Logic**: Automatic diagram error recovery with up to 3 intelligent retry attempts.
*   **Validation**: Each retry is validated to ensure the fix actually resolves the issue.
*   **Progressive Fallback**: If diagram generation fails after 3 attempts, offers a detailed text-based architecture description.
*   **Visual Feedback**: Clear retry progress indication showing "Attempt X/3" during regeneration.

### 4. "Reveal Solution"
*   Stuck during an interview? Click **"Reveal Solution"** to instantly get a comprehensive, high-level design for the current problem, complete with a diagram and trade-off analysis.

---

## 🛠️ Getting Started

### Prerequisites
*   Node.js 18+
*   A Google Cloud Project with Vertex AI API enabled.

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/sys-mind.git
    cd sys-mind
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Credentials**
    SysMind uses Google Vertex AI. You need to provide credentials.
    
    **Option A: Environment Variables (Recommended for local)**
    Create a `.env.local` file:
    ```env
    GOOGLE_CLOUD_PROJECT_ID=your-project-id
    GOOGLE_CLIENT_EMAIL=your-service-account-email
    GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
    ```

    **Option B: Base64 Encoded (Recommended for Vercel)**
    Encode your service account JSON file to Base64 and use a single variable:
    ```env
    GOOGLE_CREDENTIALS=ey... (base64 string)
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📖 Usage Guide

### How to use Dynamic Forms (Solution Mode)
1.  Switch to **Solution Mode** using the mode toggle.
2.  Type a system design request (e.g., "Design URL Shortener", "Design Instagram").
3.  The AI will present a structured form with relevant fields.
4.  Fill in the form fields with your requirements (scale, features, etc.).
5.  Click **Submit** to send your requirements.
6.  The AI will proceed with the design based on your inputs.

### How to use "Visualize"
The diagram does **not** update automatically after every message to keep the chat fast.
1.  Discuss your design with the AI.
2.  The whiteboard will initially show a prompt: "Click 'Visualize' to generate the architecture diagram".
3.  When you want to see the architecture, click the blue **"Visualize"** button in the header.
4.  A loading animation will appear while the AI analyzes the conversation and draws the system.
5.  The diagram will then appear on the whiteboard.

### How to use "Explain Component"
1.  Generate a diagram using "Visualize".
2.  Click on any node in the diagram (e.g., a database cylinder).
3.  The AI will send a message explaining exactly why that component is there and what alternatives exist.

---

## 📚 Example Scenarios

Check out [SCENARIOS.md](./SCENARIOS.md) for detailed example workflows for each mode.

---

## ✨ Recent Improvements

### December 2024 - Enhanced Solutions Feature
**Issue 1: Cloud Provider Integration**
- ✅ All forms now include cloud provider selection as the first required field
- ✅ Client-side validation prevents form submission without cloud provider
- ✅ Cloud provider extracted from form and tracked throughout session
- ✅ Diagrams automatically use correct cloud-specific icons (AWS/GCP/Azure)

**Issue 2: Comprehensive Requirement Gathering**
- ✅ Forms expanded to 5-7 comprehensive fields
- ✅ All critical categories covered: cloud, scale, features, geography, performance, special requirements
- ✅ AI instructed to ask all questions upfront (no follow-ups)
- ✅ Examples updated: URL Shortener (6 fields), Instagram (6 fields), Netflix (7 fields)

**Issue 3: Robust Diagram Generation**
- ✅ Retry limit increased from 1 to 3 attempts
- ✅ Intelligent validation ensures fixes actually work
- ✅ Progressive fallback offers text-based architecture after failed retries
- ✅ Clear UI feedback showing retry progress (Attempt 1/3, 2/3, 3/3)
- ✅ Automatic retry on validation failures

---

## 🏗️ Tech Stack
*   **Framework**: Next.js 16 (App Router) with React 19
*   **AI**: Google Vertex AI (Gemini 2.0 Flash Exp)
*   **Styling**: Tailwind CSS v4
*   **Diagrams**: draw.io (diagrams.net) with cloud provider icon libraries
*   **Icons**: Lucide React
*   **Markdown**: react-markdown with GitHub Flavored Markdown support

## 📄 License
MIT
