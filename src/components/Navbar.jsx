import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-black text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Profile Manager</Link>
        <div className="space-x-6">
          <Link to="/" className="hover:text-gray-300 transition-colors duration-200">Home</Link>
          <Link to="/admin" className="hover:text-gray-300 transition-colors duration-200">Admin</Link>
        </div>
      </div>
    </nav>
  );
}