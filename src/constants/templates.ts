import type { MessageTemplate } from "@/types/template";

export const DEFAULT_TEMPLATES: Omit<MessageTemplate, "id" | "useCount" | "createdAt" | "updatedAt">[] = [
  {
    name: "Теплое знакомство",
    category: "introduction",
    content:
      "Привет, {name}! Я увидел ваш опыт в теме {topic} и особенно отметил {specific_detail}. Сейчас работаю в похожем направлении и буду рад обменяться идеями.",
    variables: ["name", "topic", "specific_detail"],
  },
  {
    name: "Follow-up после встречи",
    category: "followup",
    content:
      "Привет, {name}! Спасибо за разговор о {topic}. Я подумал над вашим тезисом про {specific_point} и с удовольствием продолжу обсуждение.",
    variables: ["name", "topic", "specific_point"],
  },
  {
    name: "Сообщение с пользой",
    category: "offer",
    content:
      "Привет, {name}! Знаю, что вы работаете над {their_project}. Недавно нашел {resource}, это может помочь с {their_pain_point}. Делюсь, вдруг будет полезно.",
    variables: ["name", "their_project", "resource", "their_pain_point"],
  },
];
