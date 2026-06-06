export const metadata = {
  title: "Shipping Policy | Meilton",
  description: "Learn about Meilton's shipping policy and delivery times.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="bg-[#f8f5f2] min-h-screen pt-20 pb-24 text-[#4a2c2a]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold tracking-wider mb-6 uppercase">Shipping Policy</h1>
          <div className="w-24 h-1 bg-[#c96b3c] mx-auto"></div>
        </div>
        <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg border border-gray-100 fade-in-up delay-100 prose prose-stone max-w-none">
          <h2>Order Processing</h2>
          <p>All orders are processed within 1 to 2 business days (excluding weekends and holidays) after receiving your order confirmation.</p>
          
          <h2>Domestic Shipping Rates and Estimates</h2>
          <p>We offer reliable shipping across the country. Shipping charges for your order will be calculated and displayed at checkout.</p>
          
          <h2>Cash on Delivery (COD)</h2>
          <p>We are proud to offer Cash on Delivery (COD) as a payment option. You simply pay the delivery agent when your package arrives at your doorstep.</p>
          
          <h2>How do I check the status of my order?</h2>
          <p>When your order has shipped, you will receive an email notification from us which will include a tracking number you can use to check its status. Please allow 48 hours for the tracking information to become available.</p>
        </div>
      </div>
    </div>
  );
}
