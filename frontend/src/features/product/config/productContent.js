import flipkartLogo from "../../../assets/home/topNav/flipkart.png";
import flipkartIcon from "../../../assets/home/topNav/flipkartIcon.png";
import profileIcon from "../../../assets/home/searchNavSide/profile-6bae67.svg";
import cartIcon from "../../../assets/home/searchNavSide/header_cart_v4-6ac9a8.svg";
import likeIcon from "../../../assets/products/imgIcon/like.png";
import shareIcon from "../../../assets/products/imgIcon/share.png";

import mainImage from "../../../assets/products/mainProductImg/vader-2-0-wired-gaming-mouse-7-programmable-button-upto-dpi-7100-original-imahezdhmfgdnvgc.jpeg";
import galleryOne from "../../../assets/products/topAdImg/toad-14-portronics-original-imag9xnpexundzez.jpeg";
import galleryTwo from "../../../assets/products/topAdImg/toad-23-adjustable-dpi-2-4ghz-portronics-original-imagenxwgzsqub38.jpeg";
import galleryThree from "../../../assets/products/topAdImg/xs-series-flow-multi-device-3200-dpi-rechargeable-amkette-original-imahgymsfhf8gzjn (2).jpeg";
import galleryFour from "../../../assets/products/topAdImg/zeb-transformer-m-plus-zebronics-original-imahh3h35e9fvnng.jpeg";

import colorOne from "../../../assets/products/selectColor/color1.jpeg";
import colorTwo from "../../../assets/products/selectColor/color2.jpeg";

import cardIcon from "../../../assets/products/paymentIcon/card.png";
import cashOnDeliveryIcon from "../../../assets/products/paymentIcon/cashOnDelivery.png";
import flipkartAssuredIcon from "../../../assets/products/paymentIcon/flipkartAssured.png";
import sevenDaysReturnIcon from "../../../assets/products/paymentIcon/7DaysReturn.png";
import wowDealIcon from "../../../assets/products/paymentIcon/wowDeal.png";
import upiIcon from "../../../assets/products/paymentIcon/UPI.png";
import giftVoucherIcon from "../../../assets/products/paymentIcon/giftVoucher.png";
import emiIcon from "../../../assets/products/paymentIcon/EMI.png";
import bajajIcon from "../../../assets/products/paymentIcon/bajaj.jpeg";
import deliveryIcon from "../../../assets/products/deliveryIcons/delivery.png";
import homeDeliveryIcon from "../../../assets/products/deliveryIcons/home.png";
import shopIcon from "../../../assets/products/deliveryIcons/shop.png";

export const productAssets = {
  flipkartLogo,
  flipkartIcon,
  profileIcon,
  cartIcon,
  likeIcon,
  shareIcon,
  mainImage,
  galleryImages: [mainImage, galleryOne, galleryTwo, galleryThree, galleryFour],
  colorOne,
  colorTwo,
  cardIcon,
  cashOnDeliveryIcon,
  flipkartAssuredIcon,
  sevenDaysReturnIcon,
  wowDealIcon,
  upiIcon,
  giftVoucherIcon,
  emiIcon,
  bajajIcon,
  deliveryIcon,
  homeDeliveryIcon,
  shopIcon,
};

export const productContent = {
  emiCards: [
    {
      icon: giftVoucherIcon,
      title: "₹1,250 Gift Vouchers | 5% Cashback",
      subtitle: "Flipkart Axis Bank Credit Card",
      cta: "Apply Now",
    },
    {
      icon: emiIcon,
      title: "Get No Cost EMI | Unlock ₹1 Lakh",
      subtitle: "Flipkart EMI Options",
      cta: "Apply",
    },
    {
      icon: bajajIcon,
      title: "₹250 Voucher | Upto ₹400* off",
      subtitle: "Flipkart Bajaj Insta EMI",
      cta: "Apply Now",
    },
  ],
  protectionPlanItems: [
    {
      icon: bajajIcon,
      title: "Cyber Fraud Protection upt...",
      price: "@ ₹15/month",
      subPrice: "(₹183 for 1 year)",
      details: [
        { icon: upiIcon, label: "Wallet frauds" },
        { icon: cardIcon, label: "Credit Card Scam" },
        { icon: cashOnDeliveryIcon, label: "Financial Loss Coverage" },
      ],
    },
  ],
  detailsTabs: [
    { id: "specifications", label: "Specifications" },
    { id: "description", label: "Description" },
    { id: "manufacturer", label: "Manufacturer info" },
  ],
  generalDetails: [
    ["Brand", "Portronics"],
    ["Model Name", "Vader 2.0"],
    ["System Requirements", "NA"],
    ["Form Factor", "Ergonomic"],
    ["Sales Package", "1 mouse"],
    ["Compatible Devices", "Laptop, PC"],
    ["Color", "Black"],
    ["Gaming", "Yes"],
    ["Wired/Wireless", "Wired"],
    ["Interface", "USB 2.0"],
  ],
};
