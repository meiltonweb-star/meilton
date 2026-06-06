import Link from 'next/link';

export default async function OrderSuccessPage({ params }) {
  const { orderId } = await params;

  return (
    <div className="bg-white min-h-screen flex items-center justify-center py-20 px-4 text-[#4a2c2a]">
      <div className="max-w-md w-full bg-[#f8f5f2] rounded-2xl p-8 text-center shadow-xl border border-gray-100 relative overflow-hidden">
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#c96b3c] rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#4a2c2a] rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

        <div className="relative z-10">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-8">Thank you for your purchase. We have received your order and will begin processing it right away.</p>
          
          <div className="bg-white rounded-lg p-4 mb-8 border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 mb-1 uppercase tracking-wider">Order Reference</p>
            <p className="text-2xl font-mono font-bold text-[#c96b3c]">{orderId}</p>
          </div>
          
          <p className="text-sm text-gray-500 mb-8">
            You will receive a confirmation call on your mobile number shortly.
          </p>

          <Link 
            href="/category/all"
            className="block w-full bg-[#4a2c2a] hover:bg-[#c96b3c] text-white font-bold py-4 rounded-md transition-colors duration-300 uppercase tracking-widest shadow-md hover:shadow-lg"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
