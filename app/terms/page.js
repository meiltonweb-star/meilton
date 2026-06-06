export const metadata = {
  title: "Terms of Service | Meilton",
  description: "Terms of Service for Meilton.",
};

export default function TermsPage() {
  return (
    <div className="bg-[#f8f5f2] min-h-screen pt-20 pb-24 text-[#4a2c2a]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold tracking-wider mb-6 uppercase">Terms of Service</h1>
          <div className="w-24 h-1 bg-[#c96b3c] mx-auto"></div>
        </div>
        <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg border border-gray-100 fade-in-up delay-100 prose prose-stone max-w-none">
          <h2>Overview</h2>
          <p>This website is operated by Meilton. Throughout the site, the terms "we", "us" and "our" refer to Meilton. Meilton offers this website, including all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.</p>
          
          <h2>General Conditions</h2>
          <p>We reserve the right to refuse service to anyone for any reason at any time. You understand that your content may be transferred unencrypted and involve transmissions over various networks.</p>
          
          <h2>Accuracy of Information</h2>
          <p>We are not responsible if information made available on this site is not accurate, complete or current. The material on this site is provided for general information only.</p>
          
          <h2>Modifications to the Service and Prices</h2>
          <p>Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service without notice at any time.</p>
        </div>
      </div>
    </div>
  );
}
