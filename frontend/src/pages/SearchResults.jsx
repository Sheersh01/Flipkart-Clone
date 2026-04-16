import { useSearchParams } from "react-router-dom";
import BottomFooter from "../components/BottomFooter";
import Footer from "../components/Footer";
import IconNav from "../components/IconNav";
import ProductGrid from "../components/ProductGrid";
import SearchNav from "../components/SearchNav";
import TopNav from "../components/TopNav";

function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = (
    searchParams.get("q") ||
    searchParams.get("search") ||
    ""
  ).trim();

  return (
    <div className="flipkart-app" id="search-results-root">
      <header id="main-header">
        <TopNav />
        <SearchNav showActions />
        <IconNav />
      </header>
      <main id="main-content">
        <section
          className="product-grid-section"
          aria-label="Search results section"
        >
          <div className="container" style={{ paddingTop: 12 }}>
            <h2 style={{ margin: "0 0 12px", fontSize: 20, fontWeight: 600 }}>
              {query ? `Search results for "${query}"` : "Search results"}
            </h2>
          </div>
        </section>
        <ProductGrid initialSearch={query} />
      </main>
      <Footer />
      <BottomFooter />
    </div>
  );
}

export default SearchResultsPage;
