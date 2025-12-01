# SysMind Scenarios

This document provides example workflows for the three different modes in SysMind. Use these to understand how to interact with the AI in each context.

---

## 1. 🎤 Interview Mode (Default)
**Goal**: You want to practice designing a system while the AI challenges you.

**User**: "Design a URL Shortener like Bit.ly."
**SysMind**: "Great topic. Before we dive into the design, what are the functional requirements? For example, do we need to support custom aliases?"
**User**: "Yes, custom aliases and standard shortening. High read traffic."
**SysMind**: "Understood. Since it's read-heavy, what kind of database would you choose to store the mappings, and why?"
**User**: "I'll use a relational database like PostgreSQL."
**SysMind**: "PostgreSQL is solid, but for a simple key-value lookup with massive read scale, is a relational join necessary? Would a NoSQL store offer better latency?"

*(User clicks "Visualize")* -> **Diagram appears showing User -> App Server -> DB**

---

## 2. 🏗️ Solution Mode
**Goal**: You want the AI to teach you how to design a system.

*(Switch Toggle to "Solution")*

**User**: "Design a Notification System."
**SysMind (Architect)**: "I can certainly design that. To ensure it scales correctly, I need to know:
1.  What is the expected throughput (notifications per second)?
2.  Do we need to support email, SMS, and push notifications?"
**User**: "Assume 1 million users, support all channels."
**SysMind (Architect)**: "Understood. Here is the high-level design:
We will use a **Message Queue** (like Kafka) to decouple the ingestion service from the senders. This ensures we don't lose notifications during spikes.
We will have separate workers for Email (SendGrid), SMS (Twilio), and Push (FCM)."

*(User clicks "Visualize")* -> **Diagram appears showing Service -> Kafka -> Workers -> 3rd Party APIs**

---

## 3. 🎨 Review Mode
**Goal**: You have an idea and want feedback.

*(Switch Toggle to "Review")*

**User**: "I have a React frontend hosted on S3. It talks to a Python Flask backend running on a single EC2 instance. The backend connects to a MySQL database on the same instance."
**SysMind (Reviewer)**: "I have visualized your description.
**Critique**:
1.  **Single Point of Failure (SPOF)**: Your backend and database are on the same single instance. If that instance goes down, your entire app is offline.
2.  **Scalability**: You cannot scale the backend independently of the database.
**Recommendation**: Move the database to a managed service (RDS) and put the backend behind a Load Balancer with Auto Scaling."

*(User clicks "Visualize")* -> **Diagram appears showing React -> EC2 (w/ DB inside)**
