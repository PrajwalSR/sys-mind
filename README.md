# SysMind: AI System Design Interview Partner

**SysMind** is an intelligent, interactive AI partner designed to help you master System Design interviews. Unlike standard chatbots, SysMind offers a specialized environment with a live whiteboard, multiple interaction modes, and deep architectural knowledge.

![SysMind Interface](https://via.placeholder.com/800x450?text=SysMind+Interface+Preview)

## 🚀 Key Features

### 1. Three Specialized Modes
SysMind adapts to your learning style with three distinct modes:

*   **🎤 Interview Mode (Default)**
    *   **Goal**: Test your skills.
    *   **Behavior**: The AI acts as a Socratic interviewer. It asks probing questions, challenges your assumptions, and gives hints without revealing the answer.
    *   **Best for**: Mock interviews and active practice.

*   **🏗️ Solution Mode**
    *   **Goal**: Learn from an expert.
    *   **Behavior**: The AI acts as a Senior Principal Architect. It collaborates with you, asks clarifying requirements, and then proactively designs and explains the ideal system.
    *   **Best for**: Learning new patterns and seeing "perfect" solutions.

*   **🎨 Review Mode**
    *   **Goal**: Get feedback on your ideas.
    *   **Behavior**: You describe a system (e.g., "I have a React app talking to a Node backend..."), and the AI visualizes it and critiques it for bottlenecks, SPOFs (Single Points of Failure), and scalability issues.
    *   **Best for**: Validating your own designs.

### 2. Live Architecture Diagrams (Mermaid.js)
*   **On-Demand Visualization**: Click the **"Visualize"** button at any time to generate a professional system architecture diagram based on your current conversation.
*   **Interactive Nodes**: Click on any component in the diagram (e.g., "Load Balancer", "Redis") to get a specific, technical explanation of its role in your design.

### 3. "Reveal Solution"
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

### How to use "Visualize"
The diagram does **not** update automatically after every message to keep the chat fast.
1.  Discuss your design with the AI.
2.  When you want to see the architecture, click the blue **"Visualize"** button in the header.
3.  The AI will analyze the entire conversation history and draw the current state of the system.

### How to use "Explain Component"
1.  Generate a diagram using "Visualize".
2.  Click on any node in the diagram (e.g., a database cylinder).
3.  The AI will send a message explaining exactly why that component is there and what alternatives exist.

---

## 📚 Example Scenarios

Check out [SCENARIOS.md](./SCENARIOS.md) for detailed example workflows for each mode.

---

## 🏗️ Tech Stack
*   **Framework**: Next.js 14 (App Router)
*   **AI**: Google Vertex AI (Gemini Pro)
*   **Styling**: Tailwind CSS
*   **Diagrams**: Mermaid.js
*   **Icons**: Lucide React

## 📄 License
MIT
