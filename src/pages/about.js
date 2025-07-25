// pages/about.js
import Layout from '../components/Layout';
import Image from 'next/image';

const About = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-maroon border-b-2 border-maroon pb-2 inline-block">
              ABOUT US
            </h1>
            <h2 className="text-2xl text-gray-700 mt-4">
              Indian Institute of Information Technology Vadodara - International Campus Diu
            </h2>
          </div>

          {/* Main Content */}
          <div className="flex flex-col gap-12">
            {/* Institute Overview */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="relative h-80 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/media/campus1.jpg"
                  alt="IIITV-ICD Campus"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold text-maroon mb-4">About the Institute</h3>
                <p className="text-gray-600 leading-relaxed">
                  Established in 2022, IIITV-ICD is a premier institute of national importance 
                  under the IIIT Vadodara ecosystem. We are committed to excellence in information 
                  technology education, research, and innovation. Our campus in Diu provides 
                  state-of-the-art facilities and a conducive environment for academic growth.
                </p>
              </div>
            </div>

            {/* Vision & Mission Section */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-maroon text-white p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="leading-relaxed">
                  To emerge as a world-class center of excellence in information technology 
                  education and research, nurturing innovative professionals who contribute 
                  to societal development.
                </p>
              </div>

              <div className="bg-gray-100 p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold text-maroon mb-4">Our Mission</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Provide quality education in IT and related disciplines</li>
                  <li>Foster innovation through cutting-edge research</li>
                  <li>Develop industry-ready professionals with ethical values</li>
                  <li>Promote collaborative learning environment</li>
                </ul>
              </div>
            </div>

            {/* Core Values */}
            <div className="bg-gray-100 p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-maroon mb-6">Our Core Values</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg">
                  <h4 className="font-semibold text-maroon mb-2">Excellence</h4>
                  <p className="text-gray-600">Commitment to highest academic standards</p>
                </div>
                <div className="bg-white p-6 rounded-lg">
                  <h4 className="font-semibold text-maroon mb-2">Innovation</h4>
                  <p className="text-gray-600">Fostering creativity and new ideas</p>
                </div>
                <div className="bg-white p-6 rounded-lg">
                  <h4 className="font-semibold text-maroon mb-2">Integrity</h4>
                  <p className="text-gray-600">Ethical practices and transparency</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default About;
