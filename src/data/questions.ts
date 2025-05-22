import { Question } from '../types/exam.types';

export const questions: Question[] = [
    {
        id: "q1",
        text: "What is the primary purpose of React's Virtual DOM?",
        options: [
            { id: "q1_a", text: "To render 3D interfaces" },
            { id: "q1_b", text: "To improve performance by minimizing direct DOM manipulations" },
            { id: "q1_c", text: "To interact with mobile device hardware" },
            { id: "q1_d", text: "To connect with external APIs" }
        ],
        correctAnswer: "q1_b",
        explanation: "The Virtual DOM in React exists to improve performance. React creates a lightweight copy of the actual DOM in memory (Virtual DOM), compares it with the previous version when state changes, and updates only the necessary parts in the real DOM, reducing expensive DOM manipulations.",
        category: "React Basics",
        difficulty: "easy"
    },
    {
        id: "q2",
        text: "Which hook would you use to perform side effects in a functional component?",
        options: [
            { id: "q2_a", text: "useState" },
            { id: "q2_b", text: "useContext" },
            { id: "q2_c", text: "useEffect" },
            { id: "q2_d", text: "useReducer" }
        ],
        correctAnswer: "q2_c",
        explanation: "useEffect is the hook designed for handling side effects in functional components. Side effects include data fetching, subscriptions, manual DOM manipulations, and other operations that need to happen after rendering.",
        category: "React Hooks",
        difficulty: "easy"
    },
    {
        id: "q3",
        text: "In TypeScript, what does the 'as' keyword do?",
        options: [
            { id: "q3_a", text: "Creates a new type" },
            { id: "q3_b", text: "Performs type assertion" },
            { id: "q3_c", text: "Imports a module" },
            { id: "q3_d", text: "Creates a class inheritance" }
        ],
        correctAnswer: "q3_b",
        explanation: "In TypeScript, the 'as' keyword is used for type assertion. It tells the compiler to treat a value as a specific type, regardless of what the compiler might infer on its own.",
        category: "TypeScript",
        difficulty: "medium"
    },
    {
        id: "q4",
        text: "What is the purpose of React.memo()?",
        options: [
            { id: "q4_a", text: "To store variables for later use" },
            { id: "q4_b", text: "To memoize expensive calculations" },
            { id: "q4_c", text: "To prevent component re-renders if props haven't changed" },
            { id: "q4_d", text: "To create global state" }
        ],
        correctAnswer: "q4_c",
        explanation: "React.memo() is a higher-order component that memoizes the rendered output of the wrapped component. It prevents unnecessary re-renders by doing a shallow comparison of props, re-rendering only if the props have changed.",
        category: "React Performance",
        difficulty: "medium"
    },
    {
        id: "q5",
        text: "What does the useMemo hook do?",
        options: [
            { id: "q5_a", text: "Creates a memoized value that only recomputes when dependencies change" },
            { id: "q5_b", text: "Creates a memoized callback function" },
            { id: "q5_c", text: "Manages state like useState but with memoization" },
            { id: "q5_d", text: "Replaces the useEffect hook with memoization" }
        ],
        correctAnswer: "q5_a",
        explanation: "useMemo returns a memoized value that only recalculates when one of its dependencies changes. This optimization helps avoid expensive calculations on every render.",
        category: "React Hooks",
        difficulty: "medium"
    }
];