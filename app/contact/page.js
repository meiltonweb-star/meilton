export const metadata = {
  title: "Contact Us | Meilton",
  description: "Contact Meilton for product inquiries, order updates, or general assistance.",
};

export default function ContactPage() {
  return (
    <div className="bg-[#f8f5f2] min-h-screen pt-20 pb-24 text-[#4a2c2a]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16 fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold tracking-wider mb-6 uppercase">Contact Us</h1>
          <div className="w-24 h-1 bg-[#c96b3c] mx-auto"></div>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg border border-gray-100 fade-in-up delay-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            <div>
              <h2 className="text-2xl font-bold mb-6 border-b pb-4">Get in Touch</h2>
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#4a2c2a]/5 text-[#c96b3c] rounded-full flex items-center justify-center text-xl mr-4 flex-shrink-0">
                    📞
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Phone</h3>
                    <p className="text-gray-600">+91 96775 08238</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#4a2c2a]/5 text-[#c96b3c] rounded-full flex items-center justify-center text-xl mr-4 flex-shrink-0">
                    ✉️
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Email</h3>
                    <a href="mailto:hello@meilton.com" className="text-[#c96b3c] hover:underline font-medium">hello@meilton.com</a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#4a2c2a]/5 text-[#25D366] rounded-full flex items-center justify-center text-xl mr-4 flex-shrink-0">
                    💬
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">WhatsApp</h3>
                    <a href="https://wa.me/919677508238" target="_blank" rel="noopener noreferrer" className="text-[#c96b3c] hover:underline font-medium flex items-center">
                      Chat with us <span className="ml-1 text-sm">↗</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6 border-b pb-4">Customer Support</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                For product inquiries, order updates, or general assistance, please contact us through phone, email, or WhatsApp. Our team will be happy to assist you.
              </p>
              <div className="bg-[#4a2c2a] text-white p-6 rounded-lg text-center shadow-md">
                <p className="font-medium mb-2 uppercase tracking-wider text-sm text-gray-300">Fastest Response</p>
                <p className="text-lg font-bold">WhatsApp us anytime</p>
              </div>
            </div>

          </div>
        </div>
        
      </div>
    </div>
  );
}
