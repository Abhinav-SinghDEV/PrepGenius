export type AssessmentMeta = {
  slug: string;
  title: string;
  section: "Aptitude" | "Core Subject" | "Technical";
  focusTopics: string[];
};

export const assessmentMeta: AssessmentMeta[] = [
  {
    slug: "logical-reasoning",
    title: "Logical Reasoning",
    section: "Aptitude",
    focusTopics: [
      "sequences",
      "analogies",
      "odd one out",
      "coding-decoding",
      "direction sense",
    ],
  },
  {
    slug: "quantitative-aptitude",
    title: "Quantitative Aptitude",
    section: "Aptitude",
    focusTopics: [
      "percentages",
      "ratio and proportion",
      "averages",
      "profit and loss",
      "time and work",
    ],
  },
  {
    slug: "verbal-ability",
    title: "Verbal Ability",
    section: "Aptitude",
    focusTopics: [
      "synonyms",
      "antonyms",
      "grammar",
      "sentence correction",
      "fill in the blanks",
    ],
  },
  {
    slug: "dbms",
    title: "DBMS",
    section: "Core Subject",
    focusTopics: [
      "SQL",
      "normalization",
      "keys",
      "joins",
      "transactions",
      "ACID properties",
    ],
  },
  {
    slug: "computer-networks",
    title: "Computer Networks",
    section: "Core Subject",
    focusTopics: [
      "OSI model",
      "TCP/IP",
      "routing",
      "DNS",
      "UDP",
      "IP addressing",
    ],
  },
  {
    slug: "operating-system",
    title: "Operating System",
    section: "Core Subject",
    focusTopics: [
      "processes",
      "threads",
      "scheduling",
      "deadlock",
      "memory management",
      "paging",
    ],
  },
  {
    slug: "technical-assessment",
    title: "Technical Assessment",
    section: "Technical",
    focusTopics: [
      "JavaScript",
      "React",
      "Node.js",
      "APIs",
      "MongoDB",
      "Git",
      "CSS",
    ],
  },
];

export function getAssessmentMeta(slug: string) {
  return assessmentMeta.find((item) => item.slug === slug);
}