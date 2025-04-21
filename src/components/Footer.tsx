
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full border-t border-border py-8 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="text-lg font-semibold tracking-tight text-brand-dark">
              <span className="text-brand-purple">msjhatial</span> design
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Portfolio builder for creative professionals.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            <div>
              <h4 className="font-medium text-sm mb-2">Navigation</h4>
              <ul className="space-y-1">
                <li>
                  <Link to="/" className="text-xs text-muted-foreground hover:text-brand-purple transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/portfolio" className="text-xs text-muted-foreground hover:text-brand-purple transition-colors">
                    Portfolio
                  </Link>
                </li>
                <li>
                  <Link to="/timeline" className="text-xs text-muted-foreground hover:text-brand-purple transition-colors">
                    Timeline
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-xs text-muted-foreground hover:text-brand-purple transition-colors">
                    About
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-sm mb-2">Account</h4>
              <ul className="space-y-1">
                <li>
                  <Link to="/login" className="text-xs text-muted-foreground hover:text-brand-purple transition-colors">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="text-xs text-muted-foreground hover:text-brand-purple transition-colors">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} msjhatial design. All rights reserved.
          </p>
          <div className="mt-2 md:mt-0">
            <ul className="flex space-x-4">
              <li>
                <a href="#" className="text-xs text-muted-foreground hover:text-brand-purple transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-xs text-muted-foreground hover:text-brand-purple transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
