// import reactLogo from "./assets/react.svg";
import feature1 from "/f1.png";
import feature2 from "/f2.png";
import feature3 from "/f3.png";

import communication from "/communication.png";
import coloring from "/coloring.png";
import logic from "/logic.png";
import relaxing from "/relaxing.png";
import editing from "/editing.png";
import login from "/login.png";

import bee from "/bee.png";
import talking from "/talking.png";
import paint from "/paint.png";
import parents from "/parents.png";
import fish from "/fish.png";
import settings from "/settings.png";

import orange from "/orange.svg";
import pink from "/pink.svg";
import yellow from "/yellow.svg";
import green from "/green.svg";
import purple from "/purple.svg";
import blue from "/blue.svg";

export const FEATURES = [
  {
    image: feature1,
    title: "Лесен и интуитивен дизајн",
    description: "Дизајнирана за лесно користење од секое дете",
  },
  {
    image: feature2,
    title: "Достапна во секое време",
    description: "Користи ја на телефон, таблет или веб каде и да си",
  },
  {
    image: feature3,
    title: "Прилагодена за секое дете",
    description: "Персонализирај ја апликацијата според потребите на детето",
  },
];

export const MainFeatures = [
  {
    id: "feature1",
    screen: logic,
    name: "Логичко размислување",
    description:
      "Децата лесно  можат да ги пренесат своите потреби, желби и чувства преку едноставен клик на слика",
    icon: bee,
    borderColor: "#84C283",
    alignment: "left",
    size: 70,
    paddingLeft: 1,
    paddingTop: 0,
    background: green,
  },
  {
    id: "feature2",
    screen: communication,
    name: "Говор",
    description:
      "Децата лесно  можат да ги пренесат своите потреби, желби и чувства преку едноставен клик на слика",
    icon: talking,
    borderColor: "#F8B6C2",
    alignment: "left",
    size: 58,
    paddingLeft: 3,
    paddingTop: 0,
    background: pink,
  },
  {
    id: "feature3",
    screen: coloring,
    name: "Боење",
    description:
      "Децата лесно  можат да ги пренесат своите потреби, желби и чувства преку едноставен клик на слика",
    icon: paint,
    borderColor: "#FFCF72",
    alignment: "left",
    size: 59,
    paddingLeft: 5,
    paddingTop: 5,
    background: yellow,
  },
  {
    id: "feature4",
    screen: login,
    name: "Корисничка сметка",
    description:
      "Децата лесно  можат да ги пренесат своите потреби, желби и чувства преку едноставен клик на слика",
    icon: parents,
    borderColor: "#C6A7EF",
    alignment: "right",
    size: 61,
    paddingLeft: 5,
    paddingTop: 0,
    background: purple,
  },
  {
    id: "feature5",
    screen: relaxing,
    name: "Одмор",
    description:
      "Децата лесно  можат да ги пренесат своите потреби, желби и чувства преку едноставен клик на слика",
    icon: fish,
    borderColor: "#91D5D8",
    alignment: "right",
    size: 52,
    paddingLeft: 0,
    paddingTop: 0,
    background: blue,
  },
  {
    id: "feature6",
    screen: editing,
    name: "Прилагодување",
    description:
      "Децата лесно  можат да ги пренесат своите потреби, желби и чувства преку едноставен клик на слика",
    icon: settings,
    borderColor: "#FCB573",
    alignment: "right",
    size: 52,
    paddingLeft: 1,
    paddingTop: 0,
    background: orange,
  },
];
