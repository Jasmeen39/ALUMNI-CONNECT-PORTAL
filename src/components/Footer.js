import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Logo/Basic Info Section */}
        <div>
          <h3 className="text-lg font-semibold">Alumni Connect</h3>
          <p className="text-sm text-gray-400 mt-2">
            Connecting Alumni, Faculty, and Students of IIIT Vadodara.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-lg font-semibold">Navigation</h3>
          <ul className="mt-2 space-y-1 text-sm">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li><Link href="/contact-us" className="hover:underline">Contact Us</Link></li>
            <li><Link href="/about" className="hover:underline">About Us</Link></li>
            <li>
              <Link href="https://iiitvadodara.ac.in/rr_policy.php" target="_blank" className="hover:underline">
                Policies
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-semibold">Contact Us</h3>
          <p className="text-sm text-gray-400 mt-2">
            Education Hub, Kevdi, Diu, Daman and Diu, 362520, India
          </p>
          <p className="text-sm text-gray-400 mt-1">
            <strong>Phone:</strong> +91 79905 73335
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-500 text-sm mt-6">
        &copy; {new Date().getFullYear()} IIIT Vadodara. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
