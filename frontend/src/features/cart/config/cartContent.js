import cartAd from "../../../assets/cart/ad.png";
import assuredBadge from "../../../assets/cart/assured.png";
import wowBadge from "../../../assets/cart/wow.png";
import cartProductImage from "../../../assets/cart/product.png";
import safeSecure from "../../../assets/cart/safeSecure.png";
import saveForLaterIcon from "../../../assets/cart/saveForLater.png";
import removeIcon from "../../../assets/cart/remove.png";
import buyThisNowIcon from "../../../assets/cart/buyThisNow.png";

import mouseImg from "../../../assets/products/mainProductImg/vader-2-0-wired-gaming-mouse-7-programmable-button-upto-dpi-7100-original-imahezdhmfgdnvgc.jpeg";
import mensShirt from "../../../assets/home/stillLookingForThese/m-kawler-light-2410-sk-creation-original-imahh6ctamwj4hpd.jpeg";
import trolley from "../../../assets/home/products/290-1-pp-fa06-grotheory-grey-450-original-imahmfz7nqpgyhzu.jpeg";
import bodyWash from "../../../assets/home/stillLookingForThese/400-just-relax-and-recharge-body-wash-2-denver-original-imah2dhyajr5bc9s.jpeg";
import gloves from "../../../assets/home/products/100-medical-556-e-solutions-original-imah5vm4cckncw8y.png";
import oxygenMeter from "../../../assets/home/stillLookingForThese/healthcare-oxygen-flow-meter-adjustment-valve-regulator-with-original-imahcrgmah4pgmzh.jpeg";

const suggestedForYou = [
  {
    title: "ETSHandPro Wet and ...",
    price: "143",
    strike: "399",
    off: "64% off",
    image: gloves,
    productId: 2,
  },
  {
    title: "ETSHandPro Nitrile Po...",
    price: "164",
    strike: "899",
    off: "81% off",
    image: cartProductImage,
    productId: 2,
  },
  {
    title: "BUWCH Wet and Dry G...",
    price: "121",
    strike: "399",
    off: "69% off",
    image: oxygenMeter,
    productId: 5,
  },
  {
    title: "Cowox Gloves Wet and...",
    price: "283",
    strike: "1699",
    off: "83% off",
    image: cartProductImage,
    productId: 6,
  },
  {
    title: "TRIBHU Latex Medical ...",
    price: "112",
    strike: "299",
    off: "62% off",
    image: gloves,
    assured: true,
    productId: 2,
  },
];

const itemsMissed = [
  {
    title: "Portronics Vader 2.0 Wi...",
    price: "499",
    strike: "1499",
    off: "66% off",
    image: mouseImg,
    assured: true,
    productId: 1,
  },
  {
    title: "KAEZRI Solid Men Rou...",
    price: "297",
    strike: "1999",
    off: "85% off",
    image: mensShirt,
    productId: 8,
  },
  {
    title: "PRAYOMA ENTERPRISE...",
    price: "1000",
    strike: "3999",
    off: "74% off",
    image: trolley,
    productId: 3,
  },
  {
    title: "Dicxy Scott Originals M...",
    price: "548",
    strike: "830",
    off: "33% off",
    image: bodyWash,
    assured: true,
    productId: 4,
  },
  {
    title: "DENVER Just Relax and...",
    price: "168",
    strike: "298",
    off: "43% off",
    image: bodyWash,
    assured: true,
    productId: 4,
  },
];

const recentlyViewed = [
  {
    title: "Portronics Vader 2.0 Wi...",
    price: "499",
    strike: "1499",
    off: "66% off",
    image: mouseImg,
    assured: true,
    productId: 1,
  },
  {
    title: "KAEZRI Solid Men Rou...",
    price: "297",
    strike: "1999",
    off: "85% off",
    image: mensShirt,
    productId: 8,
  },
  {
    title: "PRAYOMA ENTERPRISE...",
    price: "1000",
    strike: "3999",
    off: "74% off",
    image: trolley,
    productId: 3,
  },
  {
    title: "Dicxy Scott Originals M...",
    price: "548",
    strike: "830",
    off: "33% off",
    image: bodyWash,
    assured: true,
    productId: 4,
  },
  {
    title: "DENVER Just Relax and...",
    price: "168",
    strike: "298",
    off: "43% off",
    image: bodyWash,
    assured: true,
    productId: 4,
  },
];

export const cartAssets = {
  cartAd,
  assuredBadge,
  wowBadge,
  cartProductImage,
  safeSecure,
  saveForLaterIcon,
  removeIcon,
  buyThisNowIcon,
};

export const cartContent = {
  suggestedForYou,
  itemsMissed,
  recentlyViewed,
};
