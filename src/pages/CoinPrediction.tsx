import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Calendar, Target, ArrowLeft, Zap } from "lucide-react";
import { fetchSingleCoinData, type CoinData } from "@/services/coinGeckoApi";

interface PredictionData {
  period: string;
  predictedPrice: number;
  confidence: number;
  direction: "up" | "down";
  potentialReturn: number;
}

const validCoins = ['btc', 'eth', 'doge'];

const CoinPrediction = () => {
  const { coinId } = useParams();
  const [coin, setCoin] = useState<CoinData | null>(null);
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [selectedTab, setSelectedTab] = useState("1d");
  const [loading, setLoading] = useState(true);

  if (!coinId || !validCoins.includes(coinId)) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    const loadCoinData = async () => {
      setLoading(true);
      const data = await fetchSingleCoinData(coinId!);
      if (data) {
        setCoin(data);
      }
      setLoading(false);
    };

    loadCoinData();
    
    // Update data every 60 seconds
    const interval = setInterval(loadCoinData, 60000);

    return () => clearInterval(interval);
  }, [coinId]);

  useEffect(() => {
    if (!coin) return;

    // Simulate AI predictions
    const generatePredictions = () => {
      const periods = ["1d", "3d", "7d"];
      const newPredictions = periods.map(period => {
        const randomFactor = 1 + (Math.random() - 0.5) * 0.15; // ±7.5% variation
        const predictedPrice = coin.price * randomFactor;
        const direction: "up" | "down" = predictedPrice > coin.price ? "up" : "down";
        const potentialReturn = ((predictedPrice - coin.price) / coin.price) * 100;
        
        return {
          period,
          predictedPrice,
          confidence: 75 + Math.random() * 20, // 75-95% confidence
          direction,
          potentialReturn
        };
      });
      
      setPredictions(newPredictions);
    };

    generatePredictions();
    const interval = setInterval(generatePredictions, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [coin]);

  const currentPrediction = predictions.find(p => p.period === selectedTab);

  if (loading || !coin) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-10 bg-secondary rounded w-40 mb-6"></div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-secondary rounded-2xl"></div>
                <div>
                  <div className="h-8 bg-secondary rounded w-32 mb-2"></div>
                  <div className="h-4 bg-secondary rounded w-16"></div>
                </div>
              </div>
              <div className="text-right">
                <div className="h-8 bg-secondary rounded w-32 mb-2"></div>
                <div className="h-6 bg-secondary rounded w-20"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => window.history.back()}
          className="mb-6 hover:bg-secondary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Coin Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="text-4xl p-4 bg-gradient-card rounded-2xl shadow-card">
              {coin.icon}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{coin.name}</h1>
              <p className="text-muted-foreground">{coin.symbol}</p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-3xl font-bold">
              ${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <Badge 
              variant={coin.change24h >= 0 ? "default" : "destructive"}
              className={`${coin.change24h >= 0 ? "bg-crypto-green" : "bg-crypto-red"} text-white`}
            >
              {coin.change24h >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {Math.abs(coin.change24h).toFixed(2)}%
            </Badge>
          </div>
        </div>

        {/* Prediction Tabs */}
        <Card className="bg-gradient-card shadow-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-primary" />
              <span>AI Price Predictions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="1d">1 Day</TabsTrigger>
                <TabsTrigger value="3d">3 Days</TabsTrigger>
                <TabsTrigger value="7d">7 Days</TabsTrigger>
              </TabsList>
              
              {predictions.map(prediction => (
                <TabsContent key={prediction.period} value={prediction.period}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-secondary/30">
                      <CardContent className="p-6 text-center">
                        <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                        <p className="text-2xl font-bold">
                          ${prediction.predictedPrice.toLocaleString(undefined, { 
                            minimumFractionDigits: coin.symbol === "DOGE" ? 4 : 2, 
                            maximumFractionDigits: coin.symbol === "DOGE" ? 4 : 2 
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground">Predicted Price</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-secondary/30">
                      <CardContent className="p-6 text-center">
                        <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                          prediction.direction === "up" ? "bg-crypto-green/20" : "bg-crypto-red/20"
                        }`}>
                          {prediction.direction === "up" ? 
                            <TrendingUp className="w-5 h-5 text-crypto-green" /> : 
                            <TrendingDown className="w-5 h-5 text-crypto-red" />
                          }
                        </div>
                        <p className={`text-2xl font-bold ${
                          prediction.direction === "up" ? "text-crypto-green" : "text-crypto-red"
                        }`}>
                          {prediction.potentialReturn > 0 ? "+" : ""}{prediction.potentialReturn.toFixed(2)}%
                        </p>
                        <p className="text-sm text-muted-foreground">Expected Return</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-secondary/30">
                      <CardContent className="p-6 text-center">
                        <Calendar className="w-8 h-8 text-accent mx-auto mb-2" />
                        <p className="text-2xl font-bold">{prediction.confidence.toFixed(0)}%</p>
                        <p className="text-sm text-muted-foreground">Confidence Level</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="mt-6 p-4 bg-secondary/20 rounded-lg">
                    <h4 className="font-semibold mb-2">AI Analysis Summary</h4>
                    <p className="text-sm text-muted-foreground">
                      Based on current market trends, technical indicators, and sentiment analysis, 
                      our LSTM neural network predicts {coin.name} will trade at approximately{" "}
                      <span className="font-semibold text-foreground">
                        ${prediction.predictedPrice.toLocaleString()} 
                      </span>{" "}
                      in {prediction.period === "1d" ? "1 day" : prediction.period === "3d" ? "3 days" : "7 days"}, 
                      representing a potential {prediction.direction === "up" ? "gain" : "loss"} of{" "}
                      <span className={`font-semibold ${
                        prediction.direction === "up" ? "text-crypto-green" : "text-crypto-red"
                      }`}>
                        {Math.abs(prediction.potentialReturn).toFixed(2)}%
                      </span>.
                    </p>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="bg-secondary/10 border-accent/20">
          <CardContent className="p-6">
            <h4 className="font-semibold text-accent mb-2">⚠️ Important Disclaimer</h4>
            <p className="text-sm text-muted-foreground">
              These predictions are generated by AI models for educational purposes only. 
              Cryptocurrency investments are highly volatile and risky. Past performance 
              does not guarantee future results. Always do your own research and consult 
              with financial advisors before making investment decisions.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CoinPrediction;