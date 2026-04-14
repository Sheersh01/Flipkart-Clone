import grocery from '../assets/home/categories/f1778f3699fd6582.jpg';
import forGenZ from '../assets/home/categories/ee858d99a13873c5.jpg';
import flipkartPay from '../assets/home/categories/18b53b87c4f53646.png';
import originals from '../assets/home/categories/f17ba158f2573b9c.png';
import giftCards from '../assets/home/categories/5ec9725ee1bc6137.png';
import sellPhone from '../assets/home/categories/f09f93eeb711050d.png';
import black from '../assets/home/categories/be139300ea4da8c9.png';
import superCoin from '../assets/home/categories/2146fd64b40ea493.png';
import nextGen from '../assets/home/categories/7ee61384db3e3beb.png';
import './Categories.css';

const categories = [
  { img: grocery, label: 'Grocery' },
  { img: forGenZ, label: 'For GenZ' },
  { img: flipkartPay, label: 'Flipkart ...' },
  { img: originals, label: 'Originals' },
  { img: giftCards, label: 'Gift Cards' },
  { img: sellPhone, label: 'Sell Pho...' },
  { img: black, label: 'BLACK' },
  { img: superCoin, label: 'SuperC...' },
  { img: nextGen, label: 'Next-Gen' },
];

function Categories() {
  return (
    <section className="categories-strip" id="categories-strip">
      <div className="container categories-strip-inner">
        {categories.map((cat, i) => (
          <a href="#" className="categories-strip-item" key={i} id={`cat-strip-${i}`}>
            <img src={cat.img} alt={cat.label} className="categories-strip-img" />
            <span className="categories-strip-label">{cat.label}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

export default Categories;
