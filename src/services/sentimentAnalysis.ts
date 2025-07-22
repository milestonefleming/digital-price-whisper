import { pipeline } from '@huggingface/transformers';

export interface SentimentResult {
  label: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  score: number;
}

export interface CoinSentiment {
  symbol: string;
  overall: SentimentResult;
  confidence: number;
  tweetCount: number;
  trends: 'bullish' | 'bearish' | 'neutral';
}

// Mock social media data for each coin
const mockSocialData = {
  BTC: [
    "Bitcoin is looking strong today! #BTC #crypto",
    "BTC breaking resistance levels, bullish momentum",
    "Institutional adoption of Bitcoin continues to grow",
    "Bitcoin network hash rate reaching new highs",
    "Some concerns about market volatility but overall positive",
    "BTC holders staying strong despite market uncertainty"
  ],
  ETH: [
    "Ethereum 2.0 upgrades showing promising results",
    "ETH gas fees are improving with latest updates",
    "Smart contract adoption on Ethereum increasing",
    "DeFi protocols on Ethereum gaining traction",
    "Some scalability concerns but development is active",
    "Ethereum ecosystem continues to expand rapidly"
  ],
  DOGE: [
    "DOGE community remains strong and supportive",
    "Dogecoin adoption in payments growing",
    "DOGE holders staying optimistic about future",
    "Community-driven initiatives boosting DOGE visibility",
    "Some profit-taking but long-term sentiment positive",
    "Dogecoin memes keeping the community engaged"
  ]
};

let sentimentClassifier: any = null;

const initializeSentimentAnalysis = async () => {
  if (!sentimentClassifier) {
    try {
      sentimentClassifier = await pipeline(
        'sentiment-analysis',
        'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
        { device: 'webgpu' }
      );
    } catch (error) {
      console.warn('WebGPU not available, falling back to CPU');
      sentimentClassifier = await pipeline(
        'sentiment-analysis',
        'Xenova/distilbert-base-uncased-finetuned-sst-2-english'
      );
    }
  }
  return sentimentClassifier;
};

export const analyzeCoinSentiment = async (symbol: string): Promise<CoinSentiment> => {
  try {
    const classifier = await initializeSentimentAnalysis();
    const socialPosts = mockSocialData[symbol as keyof typeof mockSocialData] || [];
    
    if (socialPosts.length === 0) {
      return {
        symbol,
        overall: { label: 'NEUTRAL', score: 0.5 },
        confidence: 50,
        tweetCount: 0,
        trends: 'neutral'
      };
    }

    // Analyze sentiment for each post
    const sentimentResults = await Promise.all(
      socialPosts.map(async (post) => {
        const result = await classifier(post);
        return {
          label: result[0].label === 'POSITIVE' ? 'POSITIVE' : 'NEGATIVE',
          score: result[0].score
        } as SentimentResult;
      })
    );

    // Calculate overall sentiment
    const positiveCount = sentimentResults.filter(r => r.label === 'POSITIVE').length;
    const negativeCount = sentimentResults.filter(r => r.label === 'NEGATIVE').length;
    const avgScore = sentimentResults.reduce((sum, r) => sum + r.score, 0) / sentimentResults.length;
    
    let overall: SentimentResult;
    let trends: 'bullish' | 'bearish' | 'neutral';
    
    if (positiveCount > negativeCount) {
      overall = { label: 'POSITIVE', score: avgScore };
      trends = 'bullish';
    } else if (negativeCount > positiveCount) {
      overall = { label: 'NEGATIVE', score: avgScore };
      trends = 'bearish';
    } else {
      overall = { label: 'NEUTRAL', score: avgScore };
      trends = 'neutral';
    }

    const confidence = Math.round(avgScore * 100);

    return {
      symbol,
      overall,
      confidence,
      tweetCount: socialPosts.length,
      trends
    };
  } catch (error) {
    console.error('Sentiment analysis failed:', error);
    // Fallback to simple sentiment based on symbol
    const fallbackSentiments = {
      'BTC': { label: 'POSITIVE' as const, score: 0.75 },
      'ETH': { label: 'POSITIVE' as const, score: 0.65 },
      'DOGE': { label: 'NEUTRAL' as const, score: 0.55 }
    };
    
    const fallback = fallbackSentiments[symbol as keyof typeof fallbackSentiments] || { label: 'NEUTRAL' as const, score: 0.5 };
    
    let trendValue: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    if (fallback.label === 'POSITIVE') trendValue = 'bullish';
    // Note: fallback sentiments don't include NEGATIVE, so we only check for POSITIVE
    
    return {
      symbol,
      overall: fallback,
      confidence: Math.round(fallback.score * 100),
      tweetCount: 6,
      trends: trendValue
    };
  }
};

export const getSentimentColor = (sentiment: SentimentResult) => {
  switch (sentiment.label) {
    case 'POSITIVE':
      return 'text-crypto-green';
    case 'NEGATIVE':
      return 'text-crypto-red';
    default:
      return 'text-muted-foreground';
  }
};

export const getSentimentIcon = (trends: 'bullish' | 'bearish' | 'neutral') => {
  switch (trends) {
    case 'bullish':
      return '📈';
    case 'bearish':
      return '📉';
    default:
      return '📊';
  }
};