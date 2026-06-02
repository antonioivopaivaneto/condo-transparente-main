import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, Menu, Settings, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { token, logout, role } = useAuth();
  const navigate = useNavigate();
  const dashboardHref = role === "sindico" ? "/sindico" : "/escolherUnidade";
  const roleLabel = role === "sindico" ? "Síndico" : "Morador";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="rounded-lg p-2">
              <img className="w-24" src="/logo.png" alt="Logo" />
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {!token ? (
              <>
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
                  <Button variant="hero">Acessar Sistema</Button>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={dashboardHref}
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Painel
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <UserRound className="h-4 w-4" />
                      {roleLabel}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={dashboardHref} className="cursor-pointer flex items-center">
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Painel
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/my-data" className="cursor-pointer flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        Meus Dados
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>

          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3">
            {!token ? (
              <>
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
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="hero" className="w-full">Acessar Sistema</Button>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={dashboardHref}
                  className="flex items-center text-muted-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Painel
                </Link>
                <Link
                  to="/my-data"
                  className="flex items-center text-muted-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserRound className="h-4 w-4 mr-2" />
                  Meus Dados
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left text-red-600 hover:text-red-700 transition-colors py-2 flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
