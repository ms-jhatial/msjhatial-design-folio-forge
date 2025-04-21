
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, User } from 'lucide-react';

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="w-full border-b border-border bg-background/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold tracking-tight text-brand-dark">
          <span className="text-brand-purple">msjhatial</span> design
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium hover:text-brand-purple transition-colors">
            Home
          </Link>
          <Link to="/portfolio" className="text-sm font-medium hover:text-brand-purple transition-colors">
            Portfolio
          </Link>
          <Link to="/timeline" className="text-sm font-medium hover:text-brand-purple transition-colors">
            Timeline
          </Link>
          <Link to="/about" className="text-sm font-medium hover:text-brand-purple transition-colors">
            About
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-sm font-medium hover:text-brand-purple transition-colors">
                Dashboard
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button variant="default" size="sm">
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
            </Link>
          )}
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMenu}
          className="md:hidden p-2 text-foreground"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-background border-t border-border animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link to="/" className="text-sm font-medium hover:text-brand-purple transition-colors py-2" onClick={toggleMenu}>
              Home
            </Link>
            <Link to="/portfolio" className="text-sm font-medium hover:text-brand-purple transition-colors py-2" onClick={toggleMenu}>
              Portfolio
            </Link>
            <Link to="/timeline" className="text-sm font-medium hover:text-brand-purple transition-colors py-2" onClick={toggleMenu}>
              Timeline
            </Link>
            <Link to="/about" className="text-sm font-medium hover:text-brand-purple transition-colors py-2" onClick={toggleMenu}>
              About
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-sm font-medium hover:text-brand-purple transition-colors py-2" onClick={toggleMenu}>
                  Dashboard
                </Link>
                <Button variant="ghost" size="sm" onClick={() => { logout(); toggleMenu(); }}>
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login" onClick={toggleMenu}>
                <Button variant="default" size="sm" className="w-full">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
