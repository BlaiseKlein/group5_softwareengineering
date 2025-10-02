/**
 * Basic header that is applied to every page except for the very begginging for new users.
 * 
 * TODO:
 * Apply this component to be rendered.
 */
import { Link } from "react-router-dom";
import Logout from "./Auth/Logout";

export default function Header() {
  return (
    <header className="bg-blue-600 text-black shadow-md">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/landing" className="text-lg font-bold">
          Fango
        </Link>
        <Logout email="FIXLATER"/>
      </nav>
    </header>
  );
}
