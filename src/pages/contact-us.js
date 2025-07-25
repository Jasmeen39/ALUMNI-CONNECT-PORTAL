// pages/contact-us.js
import Layout from '../components/Layout';
import Image from 'next/image';

const ContactUs = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Contact Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-maroon border-b-2 border-maroon pb-2 inline-block">
              CONTACT US
            </h1>
            <h2 className="text-2xl text-gray-700 mt-4">
              Administration Office of IIITV-ICD
            </h2>
          </div>

          {/* Contact Content */}
          <div className="flex flex-col md:flex-row gap-8 py-8">
            {/* Campus Image */}
            <div className="flex-1 relative h-96 md:h-auto rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/media/c5.jpg"
                alt="IIITV-ICD Campus"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Contact Details */}
            <div className="flex-1 bg-gray-100 p-8 rounded-lg shadow-lg">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-maroon">General Information</h2>

                <div className="bg-white p-6 rounded shadow-sm">
                  <p className="font-semibold text-gray-800">
                    Administration Office of IIITV-ICD
                  </p>
                  <p className="text-gray-600 mt-2">
                    Education Hub, Kevdi, Diu<br />
                    Daman and Diu, 362520, India
                  </p>
                  <p className="text-maroon font-semibold mt-4">
                    Phone: +91 79905 73335
                  </p>
                </div>

                <div className="space-y-4 text-gray-600">
                  <p>
                    We look forward to hearing from you. Please feel free to contact us to learn more about 
                    getting involved with our Institute.
                  </p>
                  <p>
                    For inquiries related to supporting IIITV-ICD students, please contact our concerned 
                    faculties at{' '}
                    <span className="text-maroon font-semibold">+91 79905 73335</span> or via email at{' '}
                    <a 
                      href="mailto:alumni@iiitvadodara.ac.in" 
                      className="text-maroon hover:text-dark-maroon underline"
                    >
                      alumni@iiitvadodara.ac.in
                    </a>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default ContactUs;
