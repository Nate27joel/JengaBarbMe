import { Hero } from '../components/home/Hero';
import { Categories } from '../components/home/Categories';
import { Features } from '../components/home/Features';
import { Testimonials } from '../components/home/Testimonials';
import { Trending } from '../components/home/Trending';

export const Home = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Categories />
      <Trending />
      <Features />
      <Testimonials />
    </div>
  );
};
