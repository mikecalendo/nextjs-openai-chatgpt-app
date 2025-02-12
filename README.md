# Next.js Chat App with OpenAI Integration

This is a full-stack chat application built with Next.js that lets you create and manage multiple conversations. It stores conversations in MongoDB and integrates with OpenAI’s ChatGPT o1-mini API to provide AI-generated responses in a chat interface.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Environment Variables](#environment-variables)
- [Setup](#setup)
- [Todo](#todo)

## Features

- **Multi-Conversation Support:** Create, view, and manage multiple chat conversations.
- **Real-Time Streaming AI Responses:** Messages from OpenAI stream token by token, creating a ChatGPT-like experience.
- **Conversation Persistence:** All conversations (including their messages and titles) are stored in MongoDB.
- **Inline Editing:** Edit conversation titles and individual messages with a clean, inline interface.
- **Simple Code Editor:** Uses a basic textarea-based editor for message input.

## Tech Stack

- **Frontend:** Next.js (React)
- **Backend / API Routes:** Next.js API routes
- **Database:** MongoDB
- **AI Integration:** OpenAI o1-mini and other models
- **Styling:** Tailwind CSS

## Environment Variables

- **OPENAI_API_KEY:** Your API key from OpenAI (used in /api/chat.js).
- **MONGODB_URI:** The connection string for your MongoDB database (used in /lib/mongodb.js).

## Setup

1. **Clone the Repository:**

```bash
   git clone https://github.com/mikecalendo/nextjs-openai-chatgpt-app.git
   cd nextjs-openai-chatgpt-app
```

2. **Install Dependencies:**
Make sure you have Node.js installed, then run:

```bash
npm install
# or
yarn install
```

3. **Set Environment Variables:**

Create a .env file in the root directory and add the following (adjust values as needed):

```env
OPENAI_API_KEY=your-openai-api-key
MONGODB_URI=your-mongodb-connection-string
```

```bash
mv -f .env.test .env
```

4. **Run the Application:**

```bash
npm run dev
# or
yarn dev
```

Open http://localhost:3000 in your browser to view the app.

## Todo
Add response formatting.
Real-Time Voice-to-Text: Add a feature to provide voice answers to questions, enabling a more interactive experience.