// Source of truth: ../../portfolio-content.md (fact-checked 2026-10-16).
// Do not add metrics, skills, or claims that are not in that file.

export const profile = {
  name: "Dharm Patel",
  role: "Software engineer and ML engineer",
  headline: "I build backend systems and machine learning models that keep working when things go wrong.",
  sub: "M.S. Computer Science at Rutgers, graduating December 2026. Looking for full-time SDE and ML Engineer roles from January 2027.",
  availability: "Open to full-time roles from January 2027",
  email: "dharmpatel0002@gmail.com",
  linkedin: "https://www.linkedin.com/in/dharmpatel02",
  github: "https://github.com/DharmPatel02",
  /** Set to "/resume.pdf" once public/resume.pdf exists. */
  resume: null as string | null,
};

export const focus = {
  eng: {
    title: "Software engineering",
    items: [
      "Backends with Spring Boot and FastAPI",
      "AWS serverless and IoT systems",
      "Real-time apps over WebSockets",
      "Docker deploys on Render and Netlify",
    ],
  },
  ml: {
    title: "Machine learning",
    items: [
      "Models that know when not to answer",
      "Search and retrieval for question answering",
      "Computer vision with MediaPipe and CNNs",
      "Recommender systems",
    ],
  },
};

export const facts = [
  { value: "4.0 GPA", label: "M.S. Computer Science, Rutgers", icon: "grad" },
  { value: "1 year", label: "full-time software developer", icon: "work" },
  { value: "Winner", label: "HackHERS 2026", icon: "trophy" },
  { value: "IEEE", label: "ICICT 2024 paper", icon: "paper" },
] as const;

export const about = [
  "I'm a Computer Science grad student at Rutgers working where solid software engineering meets machine learning. Before grad school I spent a year as a full-time Software Developer at Wave Visions, building serverless IoT backends on AWS that connected real devices to real users. At Rutgers I teach as a Part-Time Lecturer for 50+ students every semester, which has made me much better at explaining complex ideas simply.",
  "My work tends to follow one theme: systems that behave well under real-world conditions. That means backends with clean failure handling, APIs with proper timeouts and fallbacks, and models that are calibrated and can abstain when they are unsure instead of guessing confidently.",
  "Outside of code, I play chess, make music, and cook.",
];

export interface Role {
  title: string;
  /** Employment type, shown as a badge so recruiters can tell full-time from internships at a glance. */
  type: "Full-time" | "Part-time" | "Internship";
  org: string;
  place?: string;
  dates: string;
  points: string[];
  tech?: string[];
}

export const experience: Role[] = [
  {
    title: "Part-Time Lecturer",
    type: "Part-time",
    org: "Rutgers University",
    place: "New Brunswick, NJ",
    dates: "2025 – present",
    points: [
      "Lead recitations for 50+ students per semester, breaking programming and CS fundamentals into clear, hands-on sessions.",
      "Design slide decks and practice material, and hold office hours to debug student code one-on-one.",
    ],
  },
  {
    title: "Software Developer",
    type: "Full-time",
    org: "Wave Visions",
    place: "India",
    dates: "Jan 2024 – Dec 2024",
    points: [
      "Built a serverless IoT backend on AWS with 8 Lambda functions and 41 API Gateway routes, backed by DynamoDB.",
      "Connected physical devices to the cloud using MQTT over AWS IoT Core with SigV4-signed requests.",
      "Diagnosed and fixed an optimistic-update race condition that let device state drift out of sync with the UI.",
    ],
    tech: ["AWS Lambda", "API Gateway", "DynamoDB", "IoT Core", "MQTT", "Python", "JavaScript"],
  },
  {
    title: "Web Developer Intern",
    type: "Internship",
    org: "Prolog Infotech",
    dates: "May 2023 – Jun 2023",
    points: [
      "Built modular React.js components for an inventory management system and integrated REST APIs to keep frontend views in sync with backend data.",
      "Implemented JWT-based authentication with role-based access control, securing multi-user workflows across frontend and backend services.",
      "Developed REST endpoints with Express.js and MongoDB for core CRUD operations, and built role-gated UI views for different permission levels.",
    ],
    tech: ["React", "Express.js", "MongoDB", "REST APIs", "JWT"],
  },
  {
    title: "Web Developer Intern",
    type: "Internship",
    org: "Webbrains Technologies",
    dates: "May 2022 – Jun 2022",
    points: [
      "Built a responsive React frontend backed by Express.js and MongoDB, implementing full CRUD functionality for core application features.",
      "Designed reusable UI components to reduce duplicated code and keep the interface consistent across pages.",
    ],
    tech: ["React", "Express.js", "MongoDB"],
  },
];

// Title, authors, and DOI verified via Crossref on 2026-10-20.
export const publication = {
  title: "Deep Transfer Learning based Light-weight Agricultural Pest Classification Model using Convolutional Neural Networks",
  venue: "IEEE ICICT 2024",
  authors: "Dharm Patel, Aarya Bhatt, Vatsal Ajmeri, Parth Goel",
  summary:
    "Transfer learning with an EfficientNetB5 CNN to classify agricultural pests from images, for faster and more accurate pest identification.",
  url: "https://doi.org/10.1109/ICICT60155.2024.10544420" as string | null,
  related: "pest-classification",
};

export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["Python", "Java", "TypeScript", "JavaScript", "C++", "Go", "SQL"] },
  {
    group: "Backend and systems",
    items: ["Spring Boot", "FastAPI", "Express.js", "REST APIs", "WebSockets", "asyncio", "Quartz", "JPA", "HikariCP", "Event-driven architecture"],
  },
  {
    group: "Machine learning",
    items: [
      "PyTorch",
      "TensorFlow / Keras",
      "Hugging Face Transformers",
      "scikit-learn",
      "Calibration and conformal prediction",
      "Retrieval (BM25, dense, hybrid)",
      "NLI",
      "MediaPipe",
      "LangChain",
      "Gemini API",
    ],
  },
  {
    group: "Cloud and DevOps",
    items: ["AWS (Lambda, API Gateway, DynamoDB, IoT Core, S3, EC2)", "Docker", "Nginx", "Render", "Netlify", "Supabase"],
  },
  { group: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "Three.js", "Chrome extensions"] },
  { group: "Data and tools", items: ["PostgreSQL", "MongoDB", "DynamoDB", "SQLite", "MQTT", "Git", "Linux"] },
];

export const education = [
  {
    degree: "M.S. Computer Science",
    school: "Rutgers University, New Brunswick",
    detail: "GPA 4.0. Expected December 2026.",
  },
  {
    degree: "B.Tech Computer Science",
    school: "Charotar University of Science & Technology, India",
    detail: "CGPA 9.23. 2024.",
  },
];

export const recognition = [
  "Winner, HackHERS 2026 (DeathBox)",
  "IEEE ICICT 2024 publication",
  "Microsoft Certified: Azure AI Fundamentals (AI-900)",
  "Microsoft Certified: Azure Fundamentals (AZ-900)",
];
