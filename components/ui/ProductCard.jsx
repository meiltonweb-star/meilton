import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ product }) {
  // Expected product structure: { id, slug, name, image, originalPrice, offerPrice }
  return (
    <div className="group bg-white text-gray-900 rounded-xl overflow-hidden premium-shadow hover-lift flex flex-col h-full">
      <Link href={`/product/${product.slug}`} className="block relative aspect-square w-full overflow-hidden bg-gray-100 flex-shrink-0">
        <Image 
          src={product.image || 'https://via.placeholder.com/400'} 
          alt={product.name} 
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-[#4A2C2A] text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full uppercase tracking-widest shadow-md">
          COD
        </div>
      </Link>
      
      <div className="p-3 sm:p-6 flex flex-col flex-grow">
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm sm:text-xl font-semibold mb-1 sm:mb-2 line-clamp-2 hover:text-[#C96B3C] transition">{product.name}</h3>
        </Link>
        <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-6 mt-auto pt-2 sm:pt-4">
          <span className="text-[#C96B3C] font-bold text-base sm:text-2xl">₹{product.offerPrice}</span>
          {product.originalPrice && (
            <span className="text-gray-400 line-through text-xs sm:text-sm">₹{product.originalPrice}</span>
          )}
        </div>
        
        <Link 
          href={`/checkout?product=${product.id}`}
          className="block w-full text-center bg-[#4A2C2A] hover:bg-[#C96B3C] text-white font-semibold py-2 sm:py-3 rounded-md transition-colors duration-300 uppercase tracking-widest text-[10px] sm:text-sm"
        >
          Order Now
        </Link>
      </div>
    </div>
  );
}
