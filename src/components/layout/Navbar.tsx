import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Heart,
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  Store,
  SlidersHorizontal,
  LogOut,
  Zap,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { GlobalSearchModal } from './GlobalSearchModal';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const { totalItemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, logout, switchRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsAccountMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
          isScrolled
            ? 'bg-[#FDFCF9]/95 backdrop-blur-md border-b border-black/10 shadow-xs py-3.5'
            : 'bg-[#FDFCF9] border-b border-black/5 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-none bg-[#0A0A0A] text-[#C0FF00] flex items-center justify-center font-display font-black text-lg shadow-xs group-hover:scale-105 transition-transform">
                R
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-2xl tracking-tighter text-[#0A0A0A] leading-none">
                  RE:PHONE
                </span>
                <span className="text-[9px] font-mono tracking-widest text-[#0A0A0A]/50 uppercase leading-none mt-0.5">
                  puranphone.com
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
              <Link
                to="/phones"
                className={`transition-all pb-1 ${
                  location.pathname === '/phones' && !location.search.includes('deals')
                    ? 'font-bold border-b-2 border-[#C0FF00] text-[#0A0A0A]'
                    : 'text-[#0A0A0A]/60 hover:text-[#0A0A0A]'
                }`}
              >
                Shop
              </Link>

              <Link
                to="/phones?filter=deals"
                className={`transition-all flex items-center gap-1.5 pb-1 ${
                  location.search.includes('deals')
                    ? 'font-bold border-b-2 border-[#C0FF00] text-[#0A0A0A]'
                    : 'text-[#0A0A0A]/60 hover:text-[#0A0A0A]'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-[#0A0A0A] fill-[#C0FF00]" />
                Deals
              </Link>

              <Link
                to="/grading"
                className={`transition-all pb-1 ${
                  location.pathname === '/grading'
                    ? 'font-bold border-b-2 border-[#C0FF00] text-[#0A0A0A]'
                    : 'text-[#0A0A0A]/60 hover:text-[#0A0A0A]'
                }`}
              >
                Our Grading
              </Link>
            </nav>
          </div>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              to="/sell"
              className="text-sm font-bold border-b-2 border-[#C0FF00] pb-1 text-[#0A0A0A] hover:opacity-80 hidden sm:inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0A0A0A]" />
              Sell your phone
            </Link>

            {/* Global Search Button */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-none bg-[#F5F4F0] hover:bg-[#eae8e2] text-[#0A0A0A]/70 hover:text-[#0A0A0A] border border-black/10 transition-colors text-xs font-medium"
              title="Search phones (⌘K)"
            >
              <Search className="w-4 h-4 text-[#0A0A0A]" />
              <span className="hidden md:inline">Search phones...</span>
              <kbd className="hidden md:inline px-1 py-0.5 text-[9px] bg-white border border-black/20 rounded-none font-mono text-[#0A0A0A]/60">
                ⌘K
              </kbd>
            </button>

            {/* Wishlist Icon */}
            <Link
              to="/account?tab=wishlist"
              className="relative p-2 rounded-none text-[#0A0A0A] hover:bg-black/5 transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[1.75]" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-none bg-[#0A0A0A] text-[#C0FF00] text-[10px] font-mono font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 rounded-none text-[#0A0A0A] hover:bg-black/5 transition-colors flex items-center gap-1"
              title="Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
              {totalItemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-none bg-[#C0FF00] text-[#0A0A0A] font-mono font-bold text-[10px] flex items-center justify-center border border-black/10">
                  {totalItemCount}
                </span>
              )}
            </Link>

            {/* Account / Role Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-none bg-[#F5F4F0] hover:bg-[#eae8e2] border border-black/10 text-xs font-mono font-bold text-[#0A0A0A] transition-colors"
              >
                <div className="w-6 h-6 rounded-none overflow-hidden bg-[#0A0A0A] text-[#C0FF00] flex items-center justify-center font-display font-bold text-xs">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{user ? user.name.charAt(0) : 'U'}</span>
                  )}
                </div>
                <span className="hidden sm:inline font-mono truncate max-w-[90px] uppercase">
                  {user ? user.name.split(' ')[0] : 'Account'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-black/50 hidden sm:inline" />
              </button>

              {/* Dropdown Menu */}
              {isAccountMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#FDFCF9] rounded-none border border-black/20 p-2 z-50 font-mono text-xs">
                  {user ? (
                    <>
                      <div className="p-3 border-b border-black/10 mb-1">
                        <div className="font-display font-bold text-[#0A0A0A] text-sm truncate uppercase">{user.name}</div>
                        <div className="text-[11px] text-black/60 truncate">{user.email}</div>
                        <span className="inline-block mt-1 text-[9px] uppercase font-mono font-bold px-2 py-0.5 rounded-none bg-[#0A0A0A] text-[#C0FF00]">
                          Role: {user.role}
                        </span>
                      </div>

                      <Link
                        to="/account"
                        onClick={() => setIsAccountMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-black/80 hover:bg-[#F5F4F0] rounded-none uppercase"
                      >
                        <UserIcon className="w-4 h-4 text-black/60" />
                        My Orders & Profile
                      </Link>

                      <Link
                        to="/seller"
                        onClick={() => {
                          switchRole('seller');
                          setIsAccountMenuOpen(false);
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-black/80 hover:bg-[#F5F4F0] rounded-none uppercase"
                      >
                        <Store className="w-4 h-4 text-black/60" />
                        Seller Hub (Motaleb Plaza)
                      </Link>

                      <Link
                        to="/admin"
                        onClick={() => {
                          switchRole('admin');
                          setIsAccountMenuOpen(false);
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-black/80 hover:bg-[#F5F4F0] rounded-none uppercase"
                      >
                        <SlidersHorizontal className="w-4 h-4 text-black/60" />
                        Admin Dashboard
                      </Link>

                      <div className="border-t border-black/10 my-1 pt-1">
                        <div className="px-3 py-1 text-[9px] uppercase tracking-wider text-black/40 font-mono">
                          Quick Demo Switcher
                        </div>
                        <div className="grid grid-cols-3 gap-1 px-1 py-1">
                          <button
                            type="button"
                            onClick={() => {
                              switchRole('customer');
                              navigate('/account');
                            }}
                            className={`text-[10px] py-1 rounded-none font-bold uppercase border ${
                              user.role === 'customer'
                                ? 'bg-[#0A0A0A] text-[#C0FF00] border-black'
                                : 'bg-[#F5F4F0] text-black/70 border-black/10 hover:bg-black/5'
                            }`}
                          >
                            Customer
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              switchRole('seller');
                              navigate('/seller');
                            }}
                            className={`text-[10px] py-1 rounded-none font-bold uppercase border ${
                              user.role === 'seller'
                                ? 'bg-[#0A0A0A] text-[#C0FF00] border-black'
                                : 'bg-[#F5F4F0] text-black/70 border-black/10 hover:bg-black/5'
                            }`}
                          >
                            Seller
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              switchRole('admin');
                              navigate('/admin');
                            }}
                            className={`text-[10px] py-1 rounded-none font-bold uppercase border ${
                              user.role === 'admin'
                                ? 'bg-[#0A0A0A] text-[#C0FF00] border-black'
                                : 'bg-[#F5F4F0] text-black/70 border-black/10 hover:bg-black/5'
                            }`}
                          >
                            Admin
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setIsAccountMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-none mt-1 uppercase"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <div className="p-2 space-y-2">
                      <Link
                        to="/account"
                        onClick={() => setIsAccountMenuOpen(false)}
                        className="block w-full text-center py-2 bg-[#0A0A0A] text-[#C0FF00] border border-black font-bold text-xs rounded-none uppercase"
                      >
                        Sign In / Register
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-none text-[#0A0A0A] hover:bg-[#F5F4F0] transition-colors border border-black/10"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#FDFCF9] border-b border-black/10 px-6 py-5 space-y-4 font-mono">
            <nav className="flex flex-col gap-2 font-bold text-[#0A0A0A] uppercase text-xs">
              <Link
                to="/phones"
                className="py-2.5 px-3 rounded-none hover:bg-[#F5F4F0] border border-black/5 flex items-center justify-between"
              >
                <span>Shop All Phones</span>
                <span className="text-[10px] text-black/40">14 Models</span>
              </Link>
              <Link
                to="/phones?filter=deals"
                className="py-2.5 px-3 rounded-none hover:bg-[#F5F4F0] border border-black/5 flex items-center gap-2 text-[#0A0A0A]"
              >
                <Zap className="w-4 h-4 text-[#0A0A0A] fill-[#C0FF00]" />
                Special Deals (Up to 53% Off)
              </Link>
              <Link to="/grading" className="py-2.5 px-3 rounded-none hover:bg-[#F5F4F0] border border-black/5">
                Our 30-Point Inspection & Grading
              </Link>
              <Link
                to="/sell"
                className="py-2.5 px-4 rounded-none bg-[#0A0A0A] text-[#C0FF00] border border-black font-bold flex items-center justify-between"
              >
                <span>Sell Your Phone</span>
                <Sparkles className="w-4 h-4" />
              </Link>
            </nav>

            <div className="pt-4 border-t border-black/10 flex flex-col gap-2">
              <Link
                to="/seller"
                className="flex items-center gap-2 py-2 px-3 text-xs font-bold text-black/70 hover:bg-[#F5F4F0] rounded-none uppercase"
              >
                <Store className="w-4 h-4 text-black/60" />
                Merchant / Seller Portal
              </Link>
              <Link
                to="/admin"
                className="flex items-center gap-2 py-2 px-3 text-xs font-bold text-black/70 hover:bg-[#F5F4F0] rounded-none uppercase"
              >
                <SlidersHorizontal className="w-4 h-4 text-black/60" />
                Admin Operations
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
