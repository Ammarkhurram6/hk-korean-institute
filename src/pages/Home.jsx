import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import Courses from "../components/sections/Courses";
import WhyLearn from "../components/sections/WhyLearn";
import Admission from "../components/sections/Admission";
// import Teachers from "../components/sections/Teachers";
import Stats from "../components/sections/Stats";
import Testimonials from "../components/sections/Testimonials";
import Gallery from "../components/sections/Gallery";
import FAQ from "../components/sections/FAQ";
import Contact from "../components/sections/Contact";

const Home = () => {
  return (
    <>
      <Hero />
      <About />
      <Courses />
      <WhyLearn />
      <Admission />
      <Stats />
      {/* <Teachers /> */}
      <Testimonials />
      <Gallery />
      <FAQ />
      <Contact />
    </>
  );
};

export default Home;
