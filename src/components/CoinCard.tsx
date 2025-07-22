import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SentimentIndicator from "./SentimentIndicator";
import { type CoinSentiment } from "@/services/sentimentAnalysis";

interface CoinCardProps {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  icon: string;
  sentiment?: CoinSentiment;
}

const CoinCard = ({ symbol, name, price, change24h, icon, sentiment }: CoinCardProps) => {
  const navigate = useNavigate();
  const isPositive = change24h >= 0;

  const handleClick = () => {
    navigate(`/coin/${symbol.toLowerCase()}`);
  };

  return (
    <Card 
      className="bg-gradient-card shadow-card hover:shadow-glow-primary transition-all duration-300 cursor-pointer group hover:scale-105"
      onClick={handleClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{icon}</div>
            <div>
              <h3 className="font-semibold text-lg">{name}</h3>
              <p className="text-sm text-muted-foreground">{symbol}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold animate-price-update">
              ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <Badge 
              variant={isPositive ? "default" : "destructive"}
              className={`${isPositive ? "bg-crypto-green" : "bg-crypto-red"} text-white`}
            >
              {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {Math.abs(change24h).toFixed(2)}%
            </Badge>
            {sentiment && (
              <div className="mt-2">
                <SentimentIndicator sentiment={sentiment} compact />
              </div>
            )}
          </div>
        </div>
        <div className="h-1 bg-gradient-primary rounded-full group-hover:animate-pulse-glow"></div>
      </CardContent>
    </Card>
  );
};

export default CoinCard;