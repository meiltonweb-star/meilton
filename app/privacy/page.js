export const metadata = {
  title: "Privacy Policy | Meilton",
  description: "Privacy Policy for Meilton.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#f8f5f2] min-h-screen pt-20 pb-24 text-[#4a2c2a]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold tracking-wider mb-6 uppercase">Privacy Policy</h1>
          <div className="w-24 h-1 bg-[#c96b3c] mx-auto"></div>
        </div>
        <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg border border-gray-100 fade-in-up delay-100 prose prose-stone max-w-none">
          <h2>Introduction</h2>
          <p>At Meilton, we value your privacy and are committed to protecting your personal data. This privacy policy informs you about how we look after your personal data when you visit our website.</p>
          
          <h2>Data We Collect</h2>
          <p>We may collect, use, store and transfer different kinds of personal data about you, including Identity Data, Contact Data, and Transaction Data (such as your address for shipping).</p>
          
          <h2>How We Use Your Data</h2>
          <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data to process your orders, manage payments, and provide customer support.</p>
          
          <h2>Data Security</h2>
          <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered, or disclosed.</p>
        </div>
      </div>
    </div>
  );
}
