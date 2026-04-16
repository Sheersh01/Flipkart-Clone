import TopNav from "../components/TopNav";
import SearchNav from "../components/SearchNav";
import IconNav from "../components/IconNav";
import Home from "../pages/Home";
import Footer from "../components/Footer";
import BottomFooter from "../components/BottomFooter";

function HomeLayout() {
  return (
    <div className="flipkart-app" id="app-root">
      <header id="main-header">
        <TopNav />
        <SearchNav showActions />
        <IconNav />
      </header>
      <Home />
      <Footer />
      <BottomFooter />
    </div>
  );
}

export default HomeLayout;
