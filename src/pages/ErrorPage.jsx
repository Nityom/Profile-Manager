import { Link } from "react-router-dom";

function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <h1 className="text-4xl font-bold text-black">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600 mt-2">Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="mt-4 px-6 py-2 bg-black text-white rounded-md ">
        Go Back Home
      </Link>
    </div>
  );
}

export default ErrorPage;
