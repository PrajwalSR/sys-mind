import { NextResponse } from "next/server";
import { VertexAI } from "@google-cloud/vertexai";
import { SYSTEM_PROMPT, SOLUTION_PROMPT, EXPLANATION_PROMPT, ARCHITECT_PROMPT, REVIEW_PROMPT, DIAGRAM_PROMPT, DRAWIO_FIX_PROMPT } from "@/lib/systemPrompt";

// Initialize Vertex AI
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || "sys-mind-mock";
const LOCATION = "us-central1";
const MODEL_ID = "gemini-2.0-flash-exp";

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
        const { messages, action, component, mode, brokenXml, errorMessage } = await req.json();
        const lastMessage = messages[messages.length - 1];

        // Check if we have credentials. If not, return mock draw.io response.
        if (!authOptions) {
            console.warn("No Google Cloud credentials found. Returning mock response.");
            return NextResponse.json({
                message: "I'm running in mock mode because no Google Cloud credentials were provided.",
                diagram: `<mxGraphModel>
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>
    <mxCell id="2" value="User" style="shape=mxgraph.aws4.user;fillColor=#4285F4;gradientColor=none;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;" vertex="1" parent="1">
      <mxGeometry x="100" y="100" width="78" height="78" as="geometry"/>
    </mxCell>
    <mxCell id="3" value="Load Balancer" style="shape=mxgraph.aws4.elastic_load_balancing;fillColor=#8C4FFF;gradientColor=none;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;" vertex="1" parent="1">
      <mxGeometry x="300" y="100" width="78" height="78" as="geometry"/>
    </mxCell>
    <mxCell id="4" value="App Server" style="shape=mxgraph.aws4.ec2;fillColor=#ED7100;gradientColor=none;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;" vertex="1" parent="1">
      <mxGeometry x="500" y="100" width="78" height="78" as="geometry"/>
    </mxCell>
    <mxCell id="5" value="Request" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" edge="1" parent="1" source="2" target="3">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="6" value="Forward" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" edge="1" parent="1" source="3" target="4">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
  </root>
</mxGraphModel>`,
                diagramType: "drawio",
                cloudProvider: "aws"
            });
        }

        // Construct the chat history for Gemini
        const historyMessages = action ? messages : messages.slice(0, -1);

        const chatHistory = historyMessages.map((msg: any) => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
        }));

        // Select the appropriate system prompt based on mode
        let currentSystemPrompt = SYSTEM_PROMPT;
        if (mode === "solution") {
            currentSystemPrompt = ARCHITECT_PROMPT;
        } else if (mode === "review") {
            currentSystemPrompt = REVIEW_PROMPT;
        }

        const chat = model.startChat({
            history: [
                { role: "user", parts: [{ text: currentSystemPrompt }] },
                { role: "model", parts: [{ text: "Understood. I am ready." }] },
                ...chatHistory
            ],
        });

        let result;
        if (action === "solution") {
            // User requested the full solution
            result = await chat.sendMessage(SOLUTION_PROMPT);
        } else if (action === "explain" && component) {
            // User clicked a component
            result = await chat.sendMessage(EXPLANATION_PROMPT(component));
        } else if (action === "generate_diagram") {
            // User manually requested a diagram
            result = await chat.sendMessage(DIAGRAM_PROMPT);
        } else if (action === "fix_diagram") {
            // Self-healing: Fix broken diagram
            result = await chat.sendMessage(DRAWIO_FIX_PROMPT(brokenXml, errorMessage));
        } else {
            // Normal chat
            result = await chat.sendMessage(lastMessage.content);
        }

        const response = result.response;
        const text = response.candidates?.[0].content.parts[0].text;

        if (!text) {
            throw new Error("No response from Vertex AI");
        }

        // Parse JSON response
        // Gemini might wrap JSON in markdown code blocks or add conversational text
        let cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();

        // Try to extract just the JSON object if there's extra text
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            cleanText = jsonMatch[0];
        }

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
