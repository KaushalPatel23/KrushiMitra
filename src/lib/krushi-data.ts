import tomato from "@/assets/crops/tomato.jpg";
import cotton from "@/assets/crops/cotton.jpg";
import wheat from "@/assets/crops/wheat.jpg";
import rice from "@/assets/crops/rice.jpg";
import soybean from "@/assets/crops/soybean.jpg";
import sugarcane from "@/assets/crops/sugarcane.jpg";
import maize from "@/assets/crops/maize.jpg";
import onion from "@/assets/crops/onion.jpg";
import potato from "@/assets/crops/potato.jpg";
import chilli from "@/assets/crops/chilli.jpg";
import banana from "@/assets/crops/banana.jpg";
import mango from "@/assets/crops/mango.jpg";

export const crops = [
  { name: "Tomato", image: tomato, season: "Kharif / Rabi" },
  { name: "Cotton", image: cotton, season: "Kharif" },
  { name: "Wheat", image: wheat, season: "Rabi" },
  { name: "Rice", image: rice, season: "Kharif" },
  { name: "Soybean", image: soybean, season: "Kharif" },
  { name: "Sugarcane", image: sugarcane, season: "Annual" },
  { name: "Maize", image: maize, season: "Kharif" },
  { name: "Onion", image: onion, season: "Rabi" },
  { name: "Potato", image: potato, season: "Rabi" },
  { name: "Chilli", image: chilli, season: "Kharif" },
  { name: "Banana", image: banana, season: "Annual" },
  { name: "Mango", image: mango, season: "Perennial" },
];

export const stats = [
  { value: "50,000+", label: "Farmers Helped" },
  { value: "98%", label: "Detection Accuracy" },
  { value: "20+", label: "Supported Crops" },
  { value: "95%", label: "Recommendation Accuracy" },
];

export const analysisStages = [
  "Uploading...",
  "Scanning Plant...",
  "Detecting Disease...",
  "Checking Nutrients...",
  "Preparing Recommendation...",
];

export type AnalysisResult = {
  crop: string;
  healthStatus: "Healthy" | "At Risk" | "Diseased";
  disease: string;
  confidence: number;
  severity: "Low" | "Moderate" | "High";
  healthScore: number;
  nutrientDeficiency: string;
  fertilizer: string;
  organicSolution: string;
  pesticide: string;
  water: string;
  recovery: string;
  preventionTips: string[];
  nutrients: { name: string; level: number }[];
};

export const sampleResult: AnalysisResult = {
  crop: "Tomato",
  healthStatus: "Diseased",
  disease: "Early Blight (Alternaria solani)",
  confidence: 96,
  severity: "Moderate",
  healthScore: 62,
  nutrientDeficiency: "Nitrogen (N) and Magnesium (Mg)",
  fertilizer: "Urea 46-0-0 @ 40 kg/acre + Magnesium Sulphate foliar spray",
  organicSolution: "Neem oil 3% spray every 7 days + compost tea drench",
  pesticide: "Mancozeb 75% WP @ 2 g/litre, 2 sprays 10 days apart",
  water: "Moderate — 22 mm/week, avoid overhead irrigation",
  recovery: "10–14 days with consistent treatment",
  preventionTips: [
    "Rotate tomato with non-solanaceous crops every season",
    "Remove and burn infected lower leaves immediately",
    "Mulch soil to prevent spore splash onto foliage",
    "Keep 60 cm spacing for airflow between plants",
    "Water at the base early in the morning",
  ],
  nutrients: [
    { name: "Nitrogen", level: 42 },
    { name: "Phosphorus", level: 78 },
    { name: "Potassium", level: 71 },
    { name: "Magnesium", level: 48 },
    { name: "Calcium", level: 84 },
  ],
};

export const healthTrend = [
  { month: "Feb", score: 68 },
  { month: "Mar", score: 72 },
  { month: "Apr", score: 70 },
  { month: "May", score: 79 },
  { month: "Jun", score: 84 },
  { month: "Jul", score: 88 },
];

export const diseaseTrend = [
  { name: "Blight", cases: 24 },
  { name: "Rust", cases: 15 },
  { name: "Mildew", cases: 11 },
  { name: "Leaf Spot", cases: 19 },
  { name: "Wilt", cases: 7 },
];

export type HistoryItem = {
  id: string;
  crop: string;
  date: string;
  disease: string;
  status: "Healthy" | "At Risk" | "Diseased";
  score: number;
};

export const historyItems: HistoryItem[] = [
  {
    id: "KM-2041",
    crop: "Tomato",
    date: "2026-08-02",
    disease: "Early Blight",
    status: "Diseased",
    score: 62,
  },
  {
    id: "KM-2038",
    crop: "Wheat",
    date: "2026-07-28",
    disease: "Leaf Rust",
    status: "At Risk",
    score: 74,
  },
  {
    id: "KM-2035",
    crop: "Cotton",
    date: "2026-07-21",
    disease: "None detected",
    status: "Healthy",
    score: 93,
  },
  {
    id: "KM-2030",
    crop: "Rice",
    date: "2026-07-14",
    disease: "Bacterial Blight",
    status: "Diseased",
    score: 58,
  },
  {
    id: "KM-2026",
    crop: "Onion",
    date: "2026-07-06",
    disease: "Purple Blotch",
    status: "At Risk",
    score: 71,
  },
  {
    id: "KM-2019",
    crop: "Banana",
    date: "2026-06-29",
    disease: "None detected",
    status: "Healthy",
    score: 96,
  },
];