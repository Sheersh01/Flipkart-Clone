import allIcon from '../assets/home/iconNav/all.svg';
import fashionIcon from '../assets/home/iconNav/fashion.svg';
import mobilesIcon from '../assets/home/iconNav/mobiles.svg';
import beautyIcon from '../assets/home/iconNav/beauty.svg';
import electronicsIcon from '../assets/home/iconNav/desktop-headphone.svg';
import homeIcon from '../assets/home/iconNav/home-final.svg';
import appliancesIcon from '../assets/home/iconNav/tv.svg';
import toysIcon from '../assets/home/iconNav/toy.svg';
import foodIcon from '../assets/home/iconNav/food.svg';
import autoAccIcon from '../assets/home/iconNav/auto-acc.svg';
import twoWheelerIcon from '../assets/home/iconNav/auto-new.svg';
import sportsIcon from '../assets/home/iconNav/sport.svg';
import booksIcon from '../assets/home/iconNav/books.svg';
import furnitureIcon from '../assets/home/iconNav/furniture.svg';
import './IconNav.css';

const categories = [
  { icon: allIcon, label: 'For You', active: true },
  { icon: fashionIcon, label: 'Fashion' },
  { icon: mobilesIcon, label: 'Mobiles' },
  { icon: beautyIcon, label: 'Beauty' },
  { icon: electronicsIcon, label: 'Electronics' },
  { icon: homeIcon, label: 'Home' },
  { icon: appliancesIcon, label: 'Appliances' },
  { icon: toysIcon, label: 'Toys, ba...' },
  { icon: foodIcon, label: 'Food & H...' },
  { icon: autoAccIcon, label: 'Auto Acc...' },
  { icon: twoWheelerIcon, label: '2 Wheele...' },
  { icon: sportsIcon, label: 'Sports &...' },
  { icon: booksIcon, label: 'Books &...' },
  { icon: furnitureIcon, label: 'Furniture' },
];

function IconNav() {
  return (
    <nav className="icon-nav" id="icon-nav">
      <div className="container icon-nav-inner">
        {categories.map((cat, i) => (
          <a
            key={i}
            href="#"
            className={`icon-nav-item${cat.active ? ' icon-nav-item--active' : ''}`}
            id={`category-${cat.label.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`}
          >
            <img src={cat.icon} alt={cat.label} className="icon-nav-icon" />
            <span className="icon-nav-label">{cat.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

export default IconNav;
