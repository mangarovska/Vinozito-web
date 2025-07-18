// import reactLogo from "./assets/react.svg";
// import feature1 from "/f1.png";
// import feature2 from "/f2.png";
// import feature3 from "/f3.png";

import feature1 from "/landing-assets/design2.png";
import feature2 from "/landing-assets/clock2.png";
import feature3 from "/landing-assets/kids2-alt.png";

import communication from "/landing-assets/communication.png";
import coloring from "/landing-assets/coloring.png";
import logic from "/landing-assets/logic.png";
import relaxing from "/landing-assets/relaxing.png";
import editing from "/landing-assets/editing.png";
import login from "/landing-assets/login.png";

import bee from "/landing-assets/bee.png";
import talking from "/landing-assets/talking.png";
import paint from "/landing-assets/paint.png";
import parents from "/landing-assets/parents.png";
import fish from "/landing-assets/fish.png";
import settings from "/landing-assets/settings.png";

import orange from "/landing-assets/orange.svg";
import pink from "/landing-assets/pink.svg";
import yellow from "/landing-assets/yellow.svg";
import green from "/landing-assets/green.svg";
import purple from "/landing-assets/purple.svg";
import blue from "/landing-assets/blue.svg";

export const FEATURES = [
  {
    image: feature1,
    color: "#E9F6F8", //DCF4DB E9F6F8
    title: "Лесен и интуитивен дизајн",
    description: "Дизајнирана за лесно користење од секое дете",
  },
  {
    image: feature2,
    color: "#FEF6E3", // FFEFF0 FEF6E3
    title: "Достапна во секое време",
    description: "Достапна на телефон, таблет или веб каде и да си",
  },
  {
    image: feature3,
    color: "#F5EDFF", //F5EDFF FFD4D5 FFDFE7
    title: "Прилагодена за секое дете",
    description: "Овозможена персонализација согласно со потребите на детето",
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

export const flowers = [
  {
    id: "flower1",
    image: "/connect-assets/flowers/flower1.png",
    shadow: "/connect-assets/flower_shadows/flower1_shadow.png",
    preview: "/connect-assets/flower-previews/flower_2_preview.png",
  },
  {
    id: "flower2",
    image: "/connect-assets/flowers/flower2.png",
    shadow: "/connect-assets/flower_shadows/flower2_shadow.png",
    preview: "/connect-assets/flower-previews/flower_3_preview.png",
  },
  {
    id: "flower3",
    image: "/connect-assets/flowers/flower3.png",
    shadow: "/connect-assets/flower_shadows/flower3_shadow.png",
    preview: "/connect-assets/flower-previews/flower_4_preview.png",
  },
  {
    id: "flower4",
    image: "/connect-assets/flowers/flower4.png",
    shadow: "/connect-assets/flower_shadows/flower4_shadow.png",
    preview: "/connect-assets/flower-previews/flower_5_preview.png",
  },
  {
    id: "flower5",
    image: "/connect-assets/flowers/flower5.png",
    shadow: "/connect-assets/flower_shadows/flower5_shadow.png",
    preview: "/connect-assets/flower-previews/flower_6_preview.png",
  },
  {
    id: "flower6",
    image: "/connect-assets/flowers/flower6.png",
    shadow: "/connect-assets/flower_shadows/flower6_shadow.png",
    preview: "/connect-assets/flower-previews/flower_7_preview.png",
  },
];

export const categories = [
  {
    label: "Комуникација",
    value: "Communication",
    img: "/comms-assets/categories/communication.png",
    bottom: "0px",
    left: "0px",
  },
  {
    label: "Чувства",
    value: "Feelings",
    img: "/comms-assets/categories/feelings.png",
    bottom: "8px",
    left: "3px",
    margin_bottom: "4px",
  },
  {
    label: "Луѓеeee",
    value: "People",
    img: "/comms-assets/categories/people.png",
    bottom: "2px",
    left: "2px",
    margin_bottom: "3px",
  },
  {
    label: "Пијалоци",
    value: "Drinks",
    img: "/comms-assets/categories/drinks.png",
    bottom: "2px",
    left: "2px",
    margin_bottom: "2px",
  },
  {
    label: "Храна",
    value: "Food",
    img: "/comms-assets/categories/food.png",
    bottom: "5px",
    left: "4px",
  },
  {
    label: "Зеленчук",
    value: "Vegetables",
    img: "/comms-assets/categories/vegetables.png",
    bottom: "0px",
    left: "2px",
    margin_bottom: "-2px",
  },
  {
    label: "Овошје",
    value: "Fruits",
    img: "/comms-assets/categories/fruits.png",
    bottom: "0px",
    left: "0px",
  },
  {
    label: "Активности",
    value: "Activities",
    img: "/comms-assets/categories/activities.png",
    bottom: "0px",
    left: "3px",
  },
  {
    label: "Животни",
    value: "Animals",
    img: "/comms-assets/categories/animals.png",
    bottom: "0px",
    left: "3px",
    margin_bottom: "7px",
  },
  {
    label: "Облека",
    value: "Clothes",
    img: "/comms-assets/categories/clothes.png",
    bottom: "0px",
    left: "0px",
  },
  {
    label: "Боииии",
    value: "Colors",
    img: "/comms-assets/categories/colors.png",
    bottom: "0px",
    left: "0px",
  },
];
