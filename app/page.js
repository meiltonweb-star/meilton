import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ui/ProductCard';
import NewsletterForm from '@/components/ui/NewsletterForm';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';

export default async function Home() {
  let featuredProducts = [];
  try {
    // Fetch up to 8 active products on the server
    const q = query(
      collection(db, 'products'),
      where('isClosed', '==', false),
      limit(8)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      featuredProducts.push({ id: doc.id, ...doc.data() });
    });
  } catch (error) {
    console.error("Error fetching products on server:", error);
  }

  const categories = [
    { name: 'Accessories', slug: 'accessories', image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=600' },
    { name: 'Leather Goods', slug: 'leather-goods', image: 'https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?q=80&w=600' },
    { name: 'Watches', slug: 'watches', image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=600' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1920" 
            alt="Hero Background" 
            fill 
            className="object-cover opacity-40 scale-105 animate-float-delayed"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#4a2c2a] to-transparent"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-4xl px-4 fade-in-up">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-wide drop-shadow-xl text-white">
            Redefine Your <span className="text-[#c96b3c]">Style</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Discover our curated collection of premium accessories designed for the modern individual. Quality meets elegance.
          </p>
          <Link 
            href="/category/all" 
            className="inline-block bg-[#c96b3c] hover:bg-[#b45d33] text-white px-8 py-4 uppercase tracking-widest text-sm font-semibold rounded-sm transition-all duration-300 shadow-xl hover:shadow-2xl animate-float"
          >
            Shop Collection
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-[#4a2c2a] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold tracking-wider mb-4">Shop By Category</h2>
            <div className="w-24 h-1 bg-[#c96b3c] mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
            {categories.map((cat, index) => (
              <Link 
                href={`/category/${cat.slug}`} 
                key={cat.slug} 
                className={`group relative aspect-square overflow-hidden rounded-lg premium-shadow ${index % 2 === 0 ? 'animate-float' : 'animate-float-delayed'}`}
              >
                <Image 
                  src={cat.image} 
                  alt={cat.name} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-lg sm:text-3xl font-bold text-white tracking-widest uppercase drop-shadow-md text-center px-2">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-[#f8f5f2] text-[#4a2c2a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12 fade-in-up">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-wider mb-4">Featured Products</h2>
              <div className="w-24 h-1 bg-[#c96b3c]"></div>
            </div>
            <Link href="/category/all" className="hidden md:inline-block border-b-2 border-[#c96b3c] text-[#c96b3c] pb-1 uppercase tracking-widest font-semibold hover:text-[#4a2c2a] hover:border-[#4a2c2a] transition-colors">
              View All
            </Link>
          </div>
          
          {featuredProducts.length === 0 ? (
            <div className="text-center py-20 fade-in-up bg-white rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-400 mb-2">New Collections Coming Soon</h3>
              <p className="text-gray-500">We are currently updating our catalog with premium items. Check back shortly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 fade-in-up">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-[#2a1817] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="animate-float">
              <div className="w-16 h-16 mx-auto bg-[#4a2c2a] rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-bold mb-4 uppercase tracking-wider">Cash on Delivery</h3>
              <p className="text-gray-400">Pay conveniently when your premium product arrives at your doorstep.</p>
            </div>
            <div className="animate-float-delayed">
              <div className="w-16 h-16 mx-auto bg-[#4a2c2a] rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-bold mb-4 uppercase tracking-wider">Premium Quality</h3>
              <p className="text-gray-400">Curated materials and exceptional craftsmanship in every single product.</p>
            </div>
            <div className="animate-float">
              <div className="w-16 h-16 mx-auto bg-[#4a2c2a] rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-bold mb-4 uppercase tracking-wider">Trust & Security</h3>
              <p className="text-gray-400">Shop with confidence. We guarantee the quality and authenticity of our goods.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-[#4a2c2a] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c96b3c] rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#c96b3c] rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2 animate-float-delayed"></div>
        
        <div className="max-w-3xl mx-auto px-4 relative z-10 text-center fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold tracking-wider mb-6">Join The Club</h2>
          <p className="text-gray-300 mb-10">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}
