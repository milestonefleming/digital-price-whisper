import { Button } from "@/components/ui/button";
import { TrendingUp, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-gradient-card shadow-card border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="p-2 bg-gradient-primary rounded-lg shadow-glow-primary">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                CryptoPredictAI
              </h1>
              <p className="text-xs text-muted-foreground">Smart Price Predictions</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="hover:bg-secondary"
            >
              Dashboard
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/predictions')}
              className="hover:bg-secondary"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Predictions
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;