import './ProductGrid.css';

// Products folder
import trolley from '../assets/home/products/290-1-pp-fa06-grotheory-grey-450-original-imahmfz7nqpgyhzu.jpeg';
import gloves from '../assets/home/products/100-medical-556-e-solutions-original-imah5vm4cckncw8y.png';
import hooks from '../assets/home/products/50-50-50-pack-wall-hook-wait2shop-original-imahfzffdzdmfczy.jpeg';
import drawerDividers from '../assets/home/products/bs1-houseofcommon-original-imahfphwcrzqngyr.jpeg';
import spiceRack from '../assets/home/products/axune-tier-spice-rack-organiser-jun-axune-original-imag3tw8gtgnpkhk.jpeg';
import kitchenRack from '../assets/home/products/containers-kitchen-rack-steel-multipurpose-heavy-stainless-steel-original-imahhyn5hghbpypy.jpeg';
import fruitTrolley from '../assets/home/products/square-pipe-fruit-and-vegetable-trolly-4-layer-kitchen-bazzar-original-imag2fhzrztzekny.jpeg';
import spiceHolder from '../assets/home/products/kombuis-container-spice-holder-kombuis-kitchenware-original-imahjcgqqyfffnus.jpeg';
import cabinet from '../assets/home/products/39-5-layers-pink-plastic-cabinet-for-compact-homes-maxtid-45-original-imahmhggsh94j4hh.jpeg';
import organizer from '../assets/home/products/value-model-2-0-kombuis-kitchenware-original-imaheufmgj6wkk2a.jpeg';
import kitchenStand from '../assets/home/products/vgx-ssdr2t-vigneshgenix-original-imahj3ffckzvtwqf.jpeg';

// StillLookingForThese folder
import bodyWash from '../assets/home/stillLookingForThese/400-just-relax-and-recharge-body-wash-2-denver-original-imah2dhyajr5bc9s.jpeg';
import oxygenMeter from '../assets/home/stillLookingForThese/healthcare-oxygen-flow-meter-adjustment-valve-regulator-with-original-imahcrgmah4pgmzh.jpeg';
import mensShirt from '../assets/home/stillLookingForThese/m-kawler-light-2410-sk-creation-original-imahh6ctamwj4hpd.jpeg';
import surgicalGloves from '../assets/home/stillLookingForThese/20-premium-quality-gloves-dm-india-original-imagevz4bzgtvrpx.jpeg';

const products = [
  {
    img: trolley,
    badge: 'New Arrival',
    badgeType: 'new',
    brand: 'PRAYOMA ENTERPRISE',
    name: 'Plastic Kit...',
    originalPrice: '3,999',
    salePrice: '1,000',
  },
  {
    img: gloves,
    rating: '4.1',
    ratingCount: '413',
    brand: 'E Solutions',
    name: 'medical-556 Rubber, Nitr...',
    originalPrice: '999',
    salePrice: '183',
  },
  {
    img: cabinet,
    brand: 'Gildan',
    name: 'Men Solid Round Neck Pure C...',
    originalPrice: '1,999',
    salePrice: '151',
  },
  {
    img: bodyWash,
    rating: '4.4',
    ratingCount: '120',
    badge: 'AD',
    badgeType: 'ad',
    brand: 'DENVER',
    name: 'Recharge Ginseng Body Wa...',
    originalPrice: '298',
    salePrice: '178',
  },
  {
    img: oxygenMeter,
    brand: 'URMIT SURGICAL',
    name: 'Oxygen Flow Me...',
    originalPrice: '999',
    salePrice: '826',
  },
  {
    img: surgicalGloves,
    brand: 'E Solutions',
    name: 'E medical gloves blue-26...',
    originalPrice: '1,124',
    salePrice: '206',
  },
  {
    img: hooks,
    rating: '4.7',
    ratingCount: '50',
    brand: 'KHODALEWAY',
    name: 'PACK OF 45 Hook 45',
    originalPrice: '599',
    salePrice: '118',
  },
  {
    img: mensShirt,
    brand: 'NVGARMENT',
    name: 'Men Graphic Print Rou...',
    originalPrice: '799',
    salePrice: '115',
  },
  {
    img: spiceHolder,
    brand: 'Kombuis',
    name: 'Container Spice Holder...',
    originalPrice: '899',
    salePrice: '249',
  },
  {
    img: organizer,
    brand: 'Kombuis',
    name: 'Kitchenware Original...',
    originalPrice: '1,299',
    salePrice: '399',
  },
  {
    img: kitchenRack,
    brand: 'Kitchen Rack',
    name: 'Steel Multipurpose Heavy...',
    originalPrice: '1,499',
    salePrice: '549',
  },
  {
    img: fruitTrolley,
    brand: 'COMBO',
    name: 'Vegetable Trolley + Cylinder Trolley',
    originalPrice: '1,899',
    salePrice: '899',
  },
];

function ProductGrid() {
  return (
    <section className="product-grid-section" id="product-grid">
      <div className="container">
        <div className="product-grid">
          {products.map((p, i) => (
            <a href="#" className="product-grid-card" key={i} id={`product-${i}`}>
              <div className="product-grid-img-wrap">
                <img src={p.img} alt={p.name} className="product-grid-img" />
                {p.badge && (
                  <span className={`product-grid-badge product-grid-badge--${p.badgeType}`}>
                    {p.badge}
                  </span>
                )}
                {p.rating && (
                  <span className="product-grid-rating">
                    {p.rating} ★ <span className="product-grid-rating-count">({p.ratingCount})</span>
                  </span>
                )}
              </div>
              <div className="product-grid-info">
                <p className="product-grid-title">
                  <span className="product-grid-brand">{p.brand}</span>{' '}
                  {p.name}
                </p>
                <div className="product-grid-prices">
                  <span className="product-grid-original">₹{p.originalPrice}</span>
                  <span className="product-grid-sale">₹{p.salePrice}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductGrid;
