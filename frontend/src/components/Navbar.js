import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white font-bold text-lg">College Cooperation</Link>
        <div className="space-x-4">
          <Link to="/dashboard" className="text-white hover:underline">Dashboard</Link>
          {/* <Link to="/departments" className="text-white hover:underline">Departments</Link> */}
          <Link to="/collaborate/departments" className="text-white hover:underline">Collaborate</Link>
        </div>
      </div>
    </nav>
  );
}
