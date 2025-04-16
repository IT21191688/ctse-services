import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loadHomePageData } from '../redux/actions/productActions';
import NewArrivals, { FeaturedProducts, PopularProducts } from '../components/products/NewArrivals';
import CategoryList from '../components/products/CategoryList';
import Button from '../components/common/Button';

const HomePage = () => {
  const dispatch = useDispatch();
  
  // Load data for homepage
  useEffect(() => {
    dispatch(loadHomePageData());
  }, [dispatch]);
  
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative">
        {/* Hero Image */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-800 to-green-600 flex items-center">
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="mx-auto max-w-7xl w-full px-4 z-10 flex flex-col items-center md:items-start">
            <h1 className="text-white text-4xl md:text-5xl font-bold mb-4 text-center md:text-left max-w-2xl">
              Discover the Ancient Wisdom of Ayurveda
            </h1>
            <p className="text-white text-lg md:text-xl mb-8 text-center md:text-left max-w-xl">
              Premium natural products for holistic wellbeing and balanced living.
            </p>
            <div className="flex space-x-4">
              <Button
                as={Link}
                to="/products"
                size="lg"
              >
                Shop Now
              </Button>
              <Button
                as={Link}
                to="/about"
                variant="outline"
                size="lg"
                className="bg-transparent text-white border-white hover:bg-white hover:text-green-700"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
        <div className="h-96 md:h-[32rem]"></div>
      </section>
      
      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Browse Categories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our wide range of natural Ayurvedic products categorized for your convenience.
            </p>
          </div>
          
          <CategoryList maxCategories={3} showSubcategories={true} imageSize="md" />
          
          <div className="text-center mt-10">
            <Button
              as={Link}
              to="/products"
              variant="outline"
            >
              View All Categories
            </Button>
          </div>
        </div>
      </section>
      
      {/* Featured Products Section */}
      <FeaturedProducts />
      
      {/* New Arrivals Section */}
      <NewArrivals maxItems={8} />
      
      {/* Popular Products Section */}
      <PopularProducts maxItems={8} />
      
      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">The NaturaAyur Difference</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover why our customers choose us for their natural wellness needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 bg-green-100 rounded-full mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">100% Natural</h3>
              <p className="text-gray-600">
                All our products are made from natural ingredients, ethically sourced and carefully selected.
              </p>
            </div>
            
            {/* Benefit 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 bg-green-100 rounded-full mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600">
                Our products undergo rigorous quality testing to ensure the highest standards for our customers.
              </p>
            </div>
            
            {/* Benefit 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 bg-green-100 rounded-full mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Quick and reliable shipping to your doorstep with special care for product preservation.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">What Our Customers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it – hear what our satisfied customers have to say.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                  <span className="text-gray-600 font-bold">A</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Amanda P.</h4>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className="h-4 w-4 text-yellow-400" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "I've been using NaturaAyur products for over a year now, and the difference in my well-being is remarkable. Their herbal supplements have helped me feel more balanced and energetic."
              </p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                  <span className="text-gray-600 font-bold">R</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Ravi K.</h4>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className="h-4 w-4 text-yellow-400" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "The quality of NaturaAyur's products is unmatched. I appreciate their commitment to using traditional Ayurvedic formulations while maintaining modern quality standards."
              </p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                  <span className="text-gray-600 font-bold">S</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Sarah M.</h4>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className={`h-4 w-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "I was skeptical about Ayurvedic products at first, but after trying NaturaAyur's skincare line, I'm completely convinced. My skin feels healthier and more radiant."
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-16 bg-green-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-3">Join Our Community</h2>
            <p className="mb-6">
              Subscribe to our newsletter to receive updates on new products, special offers, and Ayurvedic wellness tips.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-2 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <Button size="lg">
                Subscribe
              </Button>
            </form>
            <p className="mt-4 text-sm text-green-200">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;