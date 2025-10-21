import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-gray-200">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-600">
          <p>&copy; 2025 Content Hub. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-blue-500 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-blue-500 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
