import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, TrendingUp, TrendingDown } from "lucide-react";
import { type CoinSentiment, getSentimentColor, getSentimentIcon } from "@/services/sentimentAnalysis";

interface SentimentIndicatorProps {
  sentiment: CoinSentiment;
  compact?: boolean;
}

const SentimentIndicator = ({ sentiment, compact = false }: SentimentIndicatorProps) => {
  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm">{getSentimentIcon(sentiment.trends)}</span>
        <Badge 
          variant="secondary" 
          className={`text-xs ${getSentimentColor(sentiment.overall)}`}
        >
          {sentiment.confidence}%
        </Badge>
      </div>
    );
  }

  return (
    <Card className="bg-secondary/30">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Social Sentiment</span>
          </div>
          <span className="text-lg">{getSentimentIcon(sentiment.trends)}</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Overall Trend</span>
            <Badge 
              variant={sentiment.trends === 'bullish' ? 'default' : sentiment.trends === 'bearish' ? 'destructive' : 'secondary'}
              className="capitalize"
            >
              {sentiment.trends === 'bullish' && <TrendingUp className="w-3 h-3 mr-1" />}
              {sentiment.trends === 'bearish' && <TrendingDown className="w-3 h-3 mr-1" />}
              {sentiment.trends}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Confidence</span>
            <span className={`font-semibold ${getSentimentColor(sentiment.overall)}`}>
              {sentiment.confidence}%
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Posts Analyzed</span>
            <span className="text-sm font-medium">{sentiment.tweetCount}</span>
          </div>
          
          {/* Sentiment Bar */}
          <div className="mt-3">
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  sentiment.trends === 'bullish' ? 'bg-crypto-green' : 
                  sentiment.trends === 'bearish' ? 'bg-crypto-red' : 'bg-crypto-orange'
                }`}
                style={{ width: `${sentiment.confidence}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Bearish</span>
              <span>Neutral</span>
              <span>Bullish</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SentimentIndicator;