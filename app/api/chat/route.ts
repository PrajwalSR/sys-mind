import { NextResponse } from "next/server";
import { VertexAI } from "@google-cloud/vertexai";
import { SYSTEM_PROMPT } from "@/lib/systemPrompt";

// Initialize Vertex AI
// Note: In a real app, these should be environment variables
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || "sys-mind-mock";
const LOCATION = "us-central1";
const MODEL_ID = "gemini-2.5-pro"; // Latest model from docs

// Prepare auth options for Vercel/Serverless environments
let authOptions: { credentials: any } | undefined;

// Debug: Log what env vars we have
console.log("ENV DEBUG:", {
    hasGoogleCredentials: !!process.env.GOOGLE_CREDENTIALS,
    hasClientEmail: !!process.env.GOOGLE_CLIENT_EMAIL,
    hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
    projectId: PROJECT_ID
});

// Option 1: Use GOOGLE_CREDENTIALS (entire JSON file)
if (process.env.GOOGLE_CREDENTIALS) {
    try {
        const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
        authOptions = { credentials };
        console.log("Using GOOGLE_CREDENTIALS");
    } catch (e) {
        console.error("Failed to parse GOOGLE_CREDENTIALS:", e);
    }
}
// Option 2: Use individual environment variables (legacy support)
else if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
    authOptions = {
        credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }
    };
    console.log("Using individual env vars");
}

const vertexAI = new VertexAI({
    project: PROJECT_ID,
    location: LOCATION,
    googleAuthOptions: authOptions
});
const model = vertexAI.getGenerativeModel({ model: MODEL_ID });

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const lastMessage = messages[messages.length - 1];

        // Check if we have credentials. If not, return mock response.
        if (!authOptions) {
            console.warn("No Google Cloud Project ID found. Returning mock response.");
            return NextResponse.json({
                message: "I'm running in mock mode because no Google Cloud credentials were provided. But I can still draw!",
                diagram: `graph TD
    User[User] -->|Mock Request| LB{Load Balancer}
    LB -->|Round Robin| App[App Server]
    App -->|Query| DB[(Database)]
    style LB fill:#f9f,stroke:#333,stroke-width:2px`
            });
        }

        // Construct the chat history for Gemini
        const chatHistory = messages.slice(0, -1).map((msg: any) => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
        }));

        const chat = model.startChat({
            history: [
                { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
                { role: "model", parts: [{ text: "Understood. I am ready to conduct the interview." }] },
                ...chatHistory
            ],
        });

        const result = await chat.sendMessage(lastMessage.content);
        const response = result.response;
        const text = response.candidates?.[0].content.parts[0].text;

        if (!text) {
            throw new Error("No response from Vertex AI");
        }

        // Parse JSON response
        // Gemini might wrap JSON in markdown code blocks, so we clean it
        const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();

        try {
            const jsonResponse = JSON.parse(cleanText);
            return NextResponse.json(jsonResponse);
        } catch (e) {
            console.error("Failed to parse JSON from AI:", text);
            // Fallback if AI doesn't return valid JSON
            return NextResponse.json({
                message: text,
                diagram: "" // Keep previous diagram or empty
            });
        }

    } catch (error) {
        console.error("Error in chat route:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
