// Illustrative demo data only. Replace with verified API responses when available.
export const landData = {
  "Uttar Pradesh": {
    totalArea: 240928,
    government: 42.5,
    private: 57.5,
    classification: [
      { name: "Agricultural", percent: 58.4, area: 140702, color: "#456e50" },
      { name: "Forest", percent: 17.2, area: 41440, color: "#9fb496" },
      { name: "Residential", percent: 14.1, area: 33971, color: "#d9b66e" },
      { name: "Commercial", percent: 4.8, area: 11565, color: "#819fa2" },
      { name: "Industrial", percent: 2.2, area: 5300, color: "#bf896b" },
      { name: "Barren & wasteland", percent: 1.9, area: 4578, color: "#c2c5b9" },
      { name: "Other", percent: 1.4, area: 3372, color: "#dedfd8" },
    ],
    districts: {
      Kanpur: {
        totalArea: 3155,
        government: 39.8,
        private: 60.2,
        classification: {
          Agricultural: 52.2,
          Forest: 12.4,
          Residential: 22.8,
          Commercial: 5.1,
          Industrial: 3.1,
          "Barren & wasteland": 2.1,
          Other: 2.3,
        },
      },
      Lucknow: {
        totalArea: 2528,
        government: 43.1,
        private: 56.9,
        classification: {
          Agricultural: 54.2,
          Forest: 15.7,
          Residential: 18.4,
          Commercial: 5.1,
          Industrial: 3.1,
          "Barren & wasteland": 2.0,
          Other: 1.5,
        },
      },
      Varanasi: {
        totalArea: 1535,
        government: 37.2,
        private: 62.8,
        classification: {
          Agricultural: 61.1,
          Forest: 12.0,
          Residential: 16.4,
          Commercial: 4.0,
          Industrial: 2.1,
          "Barren & wasteland": 2.3,
          Other: 2.1,
        },
      },
    },
  },
  "Madhya Pradesh": {
    totalArea: 308252,
    government: 47.8,
    private: 52.2,
    classification: [
      { name: "Agricultural", percent: 49.6, area: 152895, color: "#456e50" },
      { name: "Forest", percent: 29.8, area: 91860, color: "#9fb496" },
      { name: "Residential", percent: 9.0, area: 27743, color: "#d9b66e" },
      { name: "Commercial", percent: 3.8, area: 11714, color: "#819fa2" },
      { name: "Industrial", percent: 2.4, area: 7398, color: "#bf896b" },
      { name: "Barren & wasteland", percent: 3.1, area: 9556, color: "#c2c5b9" },
      { name: "Other", percent: 2.3, area: 7086, color: "#dedfd8" },
    ],
  },
  Maharashtra: {
    totalArea: 307713,
    government: 41.2,
    private: 58.8,
    classification: [
      { name: "Agricultural", percent: 52.3, area: 160934, color: "#456e50" },
      { name: "Forest", percent: 20.1, area: 61851, color: "#9fb496" },
      { name: "Residential", percent: 14.5, area: 44619, color: "#d9b66e" },
      { name: "Commercial", percent: 5.3, area: 16309, color: "#819fa2" },
      { name: "Industrial", percent: 3.4, area: 10462, color: "#bf896b" },
      { name: "Barren & wasteland", percent: 2.2, area: 6760, color: "#c2c5b9" },
      { name: "Other", percent: 2.2, area: 6778, color: "#dedfd8" },
    ],
  },
  Rajasthan: {
    totalArea: 342239,
    government: 44.6,
    private: 55.4,
    classification: [
      { name: "Agricultural", percent: 46.1, area: 157773, color: "#456e50" },
      { name: "Forest", percent: 9.6, area: 32855, color: "#9fb496" },
      { name: "Residential", percent: 12.8, area: 43807, color: "#d9b66e" },
      { name: "Commercial", percent: 4.2, area: 14374, color: "#819fa2" },
      { name: "Industrial", percent: 3.7, area: 12663, color: "#bf896b" },
      { name: "Barren & wasteland", percent: 19.3, area: 66052, color: "#c2c5b9" },
      { name: "Other", percent: 4.3, area: 14715, color: "#dedfd8" },
    ],
  },
};

export const districtsByState = {
  "Uttar Pradesh": ["Kanpur", "Lucknow", "Varanasi"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur"],
  Maharashtra: ["Pune", "Nagpur", "Nashik"],
  Rajasthan: ["Jaipur", "Jodhpur", "Udaipur"],
};

export const researchItems = [
  {
    title: "Sustainable Land Use Strategies in India",
    description:
      "A review of planning approaches that balance agricultural productivity, ecological protection and settlement needs.",
    publisher: "Centre for Policy Research",
    year: 2024,
    category: "Land Use",
  },
  {
    title: "Agricultural Land Trends (2010–2024)",
    description:
      "An overview of land conversion pressures around selected urban and peri-urban regions.",
    publisher: "Institute for Human Settlements",
    year: 2024,
    category: "Agriculture",
  },
  {
    title: "Urban Expansion and Land Use Change",
    description:
      "Research on how growing cities influence surrounding land use and public infrastructure.",
    publisher: "National Institute of Urban Affairs",
    year: 2023,
    category: "Urban Development",
  },
  {
    title: "Forest Governance and Community Stewardship",
    description:
      "A study of community participation in forest management and conservation outcomes.",
    publisher: "Indian Council of Forestry Research",
    year: 2023,
    category: "Forestry",
  },
  {
    title: "Land, Water and Climate Resilience",
    description: "Evidence on land management practices that support climate adaptation.",
    publisher: "TERI School of Advanced Studies",
    year: 2022,
    category: "Environment",
  },
  {
    title: "Land Records and Tenure Security",
    description: "A review of accessible land records and their role in tenure security.",
    publisher: "Land Governance Network",
    year: 2022,
    category: "Other",
  },
];

export const policyItems = [
  {
    title: "National Land Use Policy (Draft)",
    authority: "Government of India",
    jurisdiction: "National",
    year: 2013,
    category: "Land Reforms",
    description: "Guiding principles for sustainable land use and management.",
  },
  {
    title: "Right to Fair Compensation and Transparency in Land Acquisition Act",
    authority: "Government of India",
    jurisdiction: "National",
    year: 2013,
    category: "Land Acquisition",
    description: "Framework for land acquisition, compensation and rehabilitation.",
  },
  {
    title: "Uttar Pradesh Revenue Code",
    authority: "Government of Uttar Pradesh",
    jurisdiction: "Uttar Pradesh",
    year: 2006,
    category: "Land Revenue",
    description: "State provisions for revenue administration and land records.",
  },
  {
    title: "Forest (Conservation) Act",
    authority: "Government of India",
    jurisdiction: "National",
    year: 1980,
    category: "Forest Conservation",
    description: "Provisions concerning diversion of forest land for non-forest use.",
  },
  {
    title: "Maharashtra Agricultural Lands (Ceiling on Holdings) Act",
    authority: "Government of Maharashtra",
    jurisdiction: "Maharashtra",
    year: 1961,
    category: "Agricultural Land",
    description: "State framework concerning agricultural land holding limits.",
  },
  {
    title: "Urban Land (Ceiling and Regulation) Act",
    authority: "Government of India",
    jurisdiction: "National",
    year: 1976,
    category: "Urban Land",
    description: "Historical national legislation concerning urban vacant land holdings.",
  },
];
