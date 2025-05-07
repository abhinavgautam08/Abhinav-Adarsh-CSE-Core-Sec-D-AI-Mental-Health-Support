# Abhinav Adarsh CSE(Core) Sec - D

**Project Title:** Ai Powered Mental Health Support

**Project ID:** Y1-2024-25-G65  

**Team Members:** [Abhinav Adarsh](https://github.com/abhinavgautam08), [Kailash Chand Yadav](https://github.com/KailashCK716), [Prince Kumar](https://github.com/princekr013), [Rahul Yadav](https://github.com/rahulydv027)


**Project Description:** This project is a Ai powered mental health support designed to provide supportive, therapeutic, and coaching conversations using AI. It adapts its responses based on the user's detected emotion and selected personality (supportive friend, therapist, or coach).

**Video Explanation:** [Watch here](https://krmangalameduin-my.sharepoint.com/personal/harsh_vardhan_krmangalam_edu_in/_layouts/15/stream.aspx?id=%2Fpersonal%2Fharsh%5Fvardhan%5Fkrmangalam%5Fedu%5Fin%2FDocuments%2FFirst%20year%20Projects%2FAi%20Powered%20Mental%20Health%20Support%2Fexplanation%2Emp4&referrer=StreamWebApp%2EWeb&referrerScenario=AddressBarCopied%2Eview%2E6e2ffc54%2Dd214%2D4c62%2Db15b%2Df446de1e51d9)  


## Features
- Emotion-aware responses
- Multiple personality modes: Supportive, Therapist, Coach
- Fallback responses for offline mode
- Uses Gemini AI for advanced conversational abilities 

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/abhinavgautam08/Abhinav-Adarsh-CSE-Core-Sec-D-AI-Powered-Mental-Health-Support.git
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Run This :
```bash
   npm install --legacy-peer-deps
   ```

### Running the App
- Development mode:
  ```bash
  npm run dev
  ```
- Production build:
  ```bash
  npm run build
  npm start
  ```

### Linting
```bash
npm run lint
```

## Usage
- Start the development server and open your browser to the provided localhost URL.
- Interact with the chatbot by selecting a personality and sending messages.
- The chatbot will respond empathetically and adapt to your emotional state.

## Project Structure
- `lib/ai-helpers.ts`: Core AI logic for generating responses
- `package.json`: Project metadata and scripts

## Customization
- Update personalities or fallback responses in `lib/ai-helpers.ts` as needed.
- Integrate additional AI models or APIs by extending the helper functions.

## License
This project is licensed under the MIT License.
