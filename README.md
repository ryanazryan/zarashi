# Zarashi

![Version](https://img.shields.io/badge/version-v0.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Framework](https://img.shields.io/badge/framework-Next.js-black)
![Language](https://img.shields.io/badge/language-TypeScript-blue)

Zarashi is an AI-powered storyteller web application designed to turn simple ideas into rich and engaging narratives. This project is built with Next.js and leverages the power of Large Language Models (LLMs) for limitless creativity.

## ✨ Key Features

-   **Intuitive Story Generator**: Simply enter an idea or a prompt, and let the AI weave a unique story for you.
-   **Modern UI**: A clean, responsive, and user-friendly interface built with Next.js and Tailwind CSS.
-   **Integrated Backend**: Utilizes Next.js API Routes for seamless communication between the frontend and the AI service.

### 🚀 Planned Features (Roadmap)
-   [ ] **Text-to-Speech Narrator**: An option to listen to the generated stories.
-   [ ] **AI Image Illustrations**: Generate a unique cover image for each story using models like Stable Diffusion.
-   [ ] **Local Model Support**: The ability to run LLMs and image models locally for users with powerful GPUs (NVIDIA RTX).
-   [ ] **Genre & Style Selection**: Greater control over the story's output (fantasy, sci-fi, comedy, etc.).

## 🛠️ Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **AI Model (Current)**: [Google Gemini API](https://ai.google.dev/)

## ⚙️ Getting Started

Follow these steps to get Zarashi AI running on your local machine.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or newer)
-   `npm`, `yarn`, or `pnpm`
-   An API Key from [Google AI Studio](https://ai.google.dev/)

### Installation Steps

1.  **Clone this repository:**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/zarashi-ai.git](https://github.com/YOUR_USERNAME/zarashi-ai.git)
    cd zarashi-ai
    ```

2.  **Install project dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a file named `.env.local` in the project's root directory and add your API Key.
    ```
    GOOGLE_GEMINI_API_KEY=YOUR_SECRET_API_KEY_HERE
    ```
    **Important:** Never share your `.env.local` file or commit it to version control.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  Open your browser and navigate to `http://localhost:3000`.

## 📂 Project Structure
