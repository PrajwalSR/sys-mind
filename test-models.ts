// Test script to list available models
import { VertexAI } from "@google-cloud/vertexai";

const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID || "sysmind-479722";
const LOCATION = "us-central1";

const authOptions = {
    credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }
};

const vertexAI = new VertexAI({
    project: PROJECT_ID,
    location: LOCATION,
    googleAuthOptions: authOptions
});

// Try different model names
const modelsToTest = [
    "gemini-1.5-pro",
    "gemini-1.5-flash",
    "gemini-1.5-flash-001",
    "gemini-1.5-flash-002",
    "gemini-pro",
    "gemini-2.0-flash-exp",
    "text-bison",
];

console.log("Testing models in project:", PROJECT_ID);
console.log("Location:", LOCATION);
console.log("\n");

for (const modelId of modelsToTest) {
    try {
        const model = vertexAI.getGenerativeModel({ model: modelId });
        const result = await model.generateContent("Hello");
        console.log(`✅ ${modelId} - WORKS!`);
    } catch (error: any) {
        console.log(`❌ ${modelId} - ${error.message?.substring(0, 80)}`);
    }
}
