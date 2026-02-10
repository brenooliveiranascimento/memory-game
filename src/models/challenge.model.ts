import { gradients } from "@/constants/colors";
import { ImageSourcePropType } from "react-native";

export type Difficulty = "Fácil" | "Médio" | "Difícil";

export interface CardItem {
  name: string;
  image?: ImageSourcePropType;
}

export interface DifficultyConfig {
  difficulty: Difficulty;
  timeLimit: number;
  pairs: number;
  estimatedTime: string;
}

export const difficultyConfigs: Record<Difficulty, DifficultyConfig> = {
  Fácil: {
    difficulty: "Fácil",
    timeLimit: 300,
    pairs: 6,
    estimatedTime: "5 min",
  },
  Médio: {
    difficulty: "Médio",
    timeLimit: 240,
    pairs: 6,
    estimatedTime: "4 min",
  },
  Difícil: {
    difficulty: "Difícil",
    timeLimit: 10,
    pairs: 6,
    estimatedTime: "3 min",
  },
};

export interface ChallengeTheme {
  id: string;
  title: string;
  icon: string;
  cards: CardItem[];
  gradient?: [string, string];
  arrowColor?: string;
}

export interface Challenge {
  id: string;
  title: string;
  difficulty: Difficulty;
  estimatedTime: string;
  timeLimit: number;
  cards: CardItem[];
  gradient?: [string, string];
}

export const challengeThemes: ChallengeTheme[] = [
  {
    id: "languages",
    title: "Linguagens de Programação",
    icon: "💻",
    cards: [
      {
        name: "JavaScript",
        image: require("@/assets/images/JavaScript-logo.png"),
      },
      { name: "TypeScript", image: require("@/assets/images/ts.png") },
      { name: "Python", image: require("@/assets/images/python--v2.png") },
      { name: "Java", image: require("@/assets/images/java.png") },
      { name: "C#", image: require("@/assets/images/csharp.png") },
      {
        name: "Ruby",
        image: require("@/assets/images/ruby-programming-language.jpg"),
      },
    ],
    gradient: gradients.purpleDark as [string, string],
    arrowColor: "#9D7FF5",
  },
  {
    id: "frameworks",
    title: "Frameworks e Bibliotecas",
    icon: "⚡",
    cards: [
      { name: "React", image: require("@/assets/images/react.png") },
      { name: "Vue", image: require("@/assets/images/vue_icon_130791.png") },
      { name: "Angular", image: require("@/assets/images/angularjs.jpg") },
      { name: "Next.js", image: require("@/assets/images/nextjs.jpg") },
      {
        name: "React Native",
        image: require("@/assets/images/react-native.png"),
      },
      {
        name: "Svelte",
        image: require("@/assets/images/svelte-logo-by-gengns.png"),
      },
    ],
    gradient: gradients.blueDark as [string, string],
    arrowColor: "#7DAFFF",
  },
  {
    id: "tools",
    title: "Ferramentas de Desenvolvimento",
    icon: "🛠️",
    cards: [
      { name: "Git", image: require("@/assets/images/git.jpg") },
      { name: "Docker", image: require("@/assets/images/docker-icon.png") },
      {
        name: "Kubernetes",
        image: require("@/assets/images/kubernet.svg.png"),
      },
      { name: "Jenkins", image: require("@/assets/images/jeikins.svg.png") },
      { name: "VSCode" },
      { name: "GitHub" },
    ],
    gradient: gradients.cyanDark as [string, string],
    arrowColor: "#55EAE1",
  },
];

export function createChallenge(
  theme: ChallengeTheme,
  difficulty: Difficulty,
): Challenge {
  const config = difficultyConfigs[difficulty];
  const selectedCards = theme.cards.slice(0, 6);

  return {
    id: `${theme.id}-${difficulty.toLowerCase()}`,
    title: theme.title,
    difficulty,
    estimatedTime: config.estimatedTime,
    timeLimit: config.timeLimit,
    cards: selectedCards,
    gradient: theme.gradient,
  };
}
