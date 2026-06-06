export const metadata = {
  title: "About Us | Meilton",
  description: "Learn more about Meilton, your trusted destination for quality premium products.",
};

export default function AboutPage() {
  return (
    <div className="bg-[#f8f5f2] min-h-screen pt-20 pb-24 text-[#4a2c2a]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16 fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold tracking-wider mb-6 uppercase">About Us</h1>
          <div className="w-24 h-1 bg-[#c96b3c] mx-auto"></div>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg border border-gray-100 fade-in-up delay-100">
          <div className="prose prose-lg prose-stone max-w-none text-gray-700 space-y-6 leading-relaxed">
            <p className="font-medium text-xl text-[#4a2c2a] leading-relaxed">
              Welcome to Meilton, your trusted destination for quality products and exceptional customer service. We are committed to providing carefully selected products that combine value, reliability, and customer satisfaction.
            </p>
            
            <p>
              At Meilton, we believe shopping should be simple, secure, and convenient. Our goal is to deliver the best products directly to our customers while ensuring a smooth and enjoyable shopping experience.
            </p>
            
            <p>
              We continuously work to improve our collection, service quality, and customer support so that every purchase meets your expectations.
            </p>
            
            <p className="font-bold text-lg text-[#c96b3c] pt-6 border-t border-gray-100 mt-8">
              Thank you for choosing Meilton.
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
}
