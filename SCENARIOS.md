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

**User**: "Design URL Shortener"

**SysMind (Architect)**: "I'll help you design a URL shortener. To create the best architecture, I need some key information:"

*A dynamic form appears with the following fields:*
- **Expected number of redirects per month**: [Number input]
- **Number of new URLs generated per month**: [Number input]
- **Support custom URL aliases?**: [Dropdown: Yes/No]

**User**: *Fills in the form:*
- Redirects: 10,000,000
- New URLs: 1,000,000
- Custom aliases: Yes

*Clicks "Submit"*

**SysMind (Architect)**: "Perfect! Based on your requirements (10M redirects/month, 1M new URLs/month, custom aliases supported), here's the architecture:

We'll use a **NoSQL database** (like DynamoDB or Cassandra) for the URL mappings because:
1. Simple key-value lookups (short_url → long_url)
2. Massive read scale (10M redirects/month)
3. Easy horizontal scaling

For custom aliases, we'll implement a uniqueness check before insertion. We'll also add a **Redis cache** in front of the database to handle the read-heavy traffic efficiently."

*(User clicks "Visualize")* → **Diagram appears showing User → CDN → App Server → Redis → NoSQL DB**

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
