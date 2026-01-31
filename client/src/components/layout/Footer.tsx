import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark-900 text-dark-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="font-display font-bold text-xl text-white">
                Ecommerce Shop
              </span>
            </Link>
            <p className="text-dark-400 mb-4 max-w-md">
              Nền tảng thương mại điện tử thông minh với AI Recipe Intelligence.
              Mua sắm thực phẩm và khám phá công thức nấu ăn dễ dàng.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Liên kết</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="hover:text-primary-500 transition-colors">
                  Cửa hàng
                </Link>
              </li>
              <li>
                <Link to="/recipes" className="hover:text-primary-500 transition-colors">
                  Công thức
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary-500 transition-colors">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary-500 transition-colors">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-4">Hỗ trợ</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="hover:text-primary-500 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-primary-500 transition-colors">
                  Vận chuyển
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-primary-500 transition-colors">
                  Đổi trả
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary-500 transition-colors">
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-700 mt-8 pt-8 text-center text-dark-500">
          <p>&copy; {new Date().getFullYear()} Ecommerce Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
