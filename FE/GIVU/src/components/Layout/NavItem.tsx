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
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors
        ${
          isActive
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
        }`}
    >
      {label}
    </Link>
  );
};

export default NavItem; 