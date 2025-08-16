import { Camera, Twitter, Instagram, Youtube, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700  sm:px-12 py-12 ">
      <div className="max-w-8xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand / About */}
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-black rounded-lg flex items-center justify-center">
              <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">SnapNest</h2>
          </div>
          <p className="mt-3 text-sm text-gray-600">
            A creative hub where you can explore, save, and share visual
            stories. Built for inspiration and discovery.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/home" className="hover:text-gray-900">
                Home
              </Link>
            </li>
            <li>
              <Link to="explore" className="hover:text-gray-900">
                Explore
              </Link>
            </li>
            <li>
              <Link to="create" className="hover:text-gray-900">
                Upload
              </Link>
            </li>
            <li>
              <Link to="/home/profile" className="hover:text-gray-900">
                Profile
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact / Social */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Connect</h3>
          <p className="text-sm text-gray-600">Email: support@snapnest.com</p>
          <div className="flex space-x-4 text-lg mt-4">
            <a href="#" className="hover:text-gray-900">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-gray-900">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-gray-900">
              <Youtube className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-gray-900">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-gray-300 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} SnapNest. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
