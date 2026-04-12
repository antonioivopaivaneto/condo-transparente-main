import { Button } from "@/components/ui/button";
import { Building2, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className=" rounded-lg p-2">
              <img  className="w-24" src="../../public/logo.png"/>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/sindico" className="text-muted-foreground hover:text-primary transition-colors">
              Síndico
            </Link>
            <Link to="/morador" className="text-muted-foreground hover:text-primary transition-colors">
              Morador
            </Link>
            <Link to="/fornecedor" className="text-muted-foreground hover:text-primary transition-colors">
              Fornecedor
            </Link>
            <Link to="/login">
               <Button  variant="hero">Acessar Sistema</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3">
            <Link
              to="/sindico"
              className="block text-muted-foreground hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Síndico
            </Link>
            <Link
              to="/morador"
              className="block text-muted-foreground hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Morador
            </Link>
            <Link
              to="/fornecedor"
              className="block text-muted-foreground hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Fornecedor
            </Link>
            <Button variant="hero" className="w-full">Acessar Sistema</Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
