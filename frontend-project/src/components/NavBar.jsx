import { NavLink } from 'react-router-dom';

const linkClass = ({ isActive }) =>
  `nav-link ${isActive ? 'nav-link-active' : 'text-ink hover:bg-white/60'}`;

export default function NavBar() {
  return (
    <header className="nav-shell">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center gap-2">
        <div className="brand text-xl font-bold mr-auto flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-amber-400 text-white text-sm">SP</span>
          SmartPark CWSMS
        </div>
        <nav className="flex flex-wrap gap-2">
          <NavLink to="/cars" className={linkClass}>Car</NavLink>
          <NavLink to="/packages" className={linkClass}>Packages</NavLink>
          <NavLink to="/service-records" className={linkClass}>ServicePackage</NavLink>
          <NavLink to="/payments" className={linkClass}>Payment</NavLink>
          <NavLink to="/reports" className={linkClass}>Reports</NavLink>
          <NavLink to="/logout" className={linkClass}>Logout</NavLink>
        </nav>
      </div>
    </header>
  );
}
