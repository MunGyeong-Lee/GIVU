import { Link } from 'react-router-dom';

interface NavItemProps {
  to: string;
  label: string;
  isActive: boolean;
}

const NavItem = ({ to, label, isActive }: NavItemProps) => {
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors relative
        ${
          isActive
            ? 'text-blue-600'
            : 'text-gray-600 hover:text-gray-900'
        }`}
    >
      {label}
      {isActive && (
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>
      )}
    </Link>
  );
};

export default NavItem; 