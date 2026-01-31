import { Link } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 glass border-b border-dark-100 dark:border-dark-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="font-display font-bold text-xl text-dark-900 dark:text-white">
              Ecommerce
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/shop"
              className="text-dark-600 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-500 transition-colors"
            >
              Cửa hàng
            </Link>
            <Link
              to="/recipes"
              className="text-dark-600 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-500 transition-colors"
            >
              Công thức
            </Link>
            <Link
              to="/about"
              className="text-dark-600 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-500 transition-colors"
            >
              Về chúng tôi
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors">
              <Search className="w-5 h-5 text-dark-600 dark:text-dark-300" />
            </button>

            <Link
              to="/cart"
              className="relative p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-dark-600 dark:text-dark-300" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                0
              </span>
            </Link>

            <Link
              to="/login"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
            >
              <User className="w-4 h-4" />
              <span>Đăng nhập</span>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
            >
              <Menu className="w-5 h-5 text-dark-600 dark:text-dark-300" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-dark-100 dark:border-dark-800">
            <div className="flex flex-col gap-2">
              <Link
                to="/shop"
                className="px-4 py-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800"
              >
                Cửa hàng
              </Link>
              <Link
                to="/recipes"
                className="px-4 py-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800"
              >
                Công thức
              </Link>
              <Link
                to="/about"
                className="px-4 py-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800"
              >
                Về chúng tôi
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
