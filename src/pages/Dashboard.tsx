import { useState, useEffect } from "react";
import Header from "@/components/Header";
import CoinCard from "@/components/CoinCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, Users, Clock } from "lucide-react";

interface CoinData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  icon: string;
}

const Dashboard = () => {
  const [coins, setCoins] = useState<CoinData[]>([
    { symbol: "BTC", name: "Bitcoin", price: 45250.32, change24h: 2.45, icon: "₿" },
    { symbol: "ETH", name: "Ethereum", price: 2850.67, change24h: -1.23, icon: "Ξ" },
    { symbol: "DOGE", name: "Dogecoin", price: 0.08, change24h: 5.67, icon: "Ð" }
  ]);

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCoins(prevCoins => 
        prevCoins.map(coin => ({
          ...coin,
          price: coin.price * (1 + (Math.random() - 0.5) * 0.02), // ±1% random change
          change24h: coin.change24h + (Math.random() - 0.5) * 0.5
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            AI-Powered{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Crypto Predictions
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get intelligent short-term price forecasts for Bitcoin, Ethereum, and Dogecoin 
            powered by advanced machine learning models.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-card shadow-card">
            <CardContent className="p-6 text-center">
              <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">87%</p>
              <p className="text-sm text-muted-foreground">Accuracy Rate</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card shadow-card">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-crypto-green mx-auto mb-2" />
              <p className="text-2xl font-bold">12.5K</p>
              <p className="text-sm text-muted-foreground">Predictions Made</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card shadow-card">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold">3.2K</p>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card shadow-card">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-crypto-orange mx-auto mb-2" />
              <p className="text-2xl font-bold">24/7</p>
              <p className="text-sm text-muted-foreground">Live Updates</p>
            </CardContent>
          </Card>
        </div>

        {/* Live Prices Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Live Cryptocurrency Prices</h3>
            <Badge variant="secondary" className="animate-pulse-glow">
              <div className="w-2 h-2 bg-crypto-green rounded-full mr-2"></div>
              Live
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coins.map((coin) => (
              <CoinCard
                key={coin.symbol}
                symbol={coin.symbol}
                name={coin.name}
                price={coin.price}
                change24h={coin.change24h}
                icon={coin.icon}
              />
            ))}
          </div>
        </div>

        {/* How It Works */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="text-center text-2xl">How Our AI Predictions Work</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-foreground">1</span>
                </div>
                <h4 className="font-semibold mb-2">Data Collection</h4>
                <p className="text-sm text-muted-foreground">
                  We gather real-time market data from multiple exchanges and news sources
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-foreground">2</span>
                </div>
                <h4 className="font-semibold mb-2">AI Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Advanced LSTM neural networks analyze patterns and market sentiment
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-foreground">3</span>
                </div>
                <h4 className="font-semibold mb-2">Smart Predictions</h4>
                <p className="text-sm text-muted-foreground">
                  Get accurate 1-7 day price forecasts updated every 24 hours
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;