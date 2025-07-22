import { useState, useEffect } from 'react';
import { analyzeCoinSentiment, type CoinSentiment } from '@/services/sentimentAnalysis';

export const useSentimentData = (symbols: string[]) => {
  const [sentimentData, setSentimentData] = useState<Record<string, CoinSentiment>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (symbols.length === 0) return;

    const fetchSentimentData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const sentimentPromises = symbols.map(async (symbol) => {
          const sentiment = await analyzeCoinSentiment(symbol);
          return [symbol, sentiment] as const;
        });

        const results = await Promise.all(sentimentPromises);
        const newSentimentData = Object.fromEntries(results);
        
        setSentimentData(newSentimentData);
      } catch (err) {
        console.error('Failed to fetch sentiment data:', err);
        setError('Failed to load sentiment analysis');
      } finally {
        setLoading(false);
      }
    };

    fetchSentimentData();
    
    // Update sentiment data every 5 minutes
    const interval = setInterval(fetchSentimentData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [symbols]);

  return { sentimentData, loading, error };
};

export const useSingleCoinSentiment = (symbol: string) => {
  const [sentiment, setSentiment] = useState<CoinSentiment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol) return;

    const fetchSentiment = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await analyzeCoinSentiment(symbol);
        setSentiment(result);
      } catch (err) {
        console.error('Failed to fetch sentiment:', err);
        setError('Failed to load sentiment analysis');
      } finally {
        setLoading(false);
      }
    };

    fetchSentiment();
    
    // Update every 3 minutes for single coin
    const interval = setInterval(fetchSentiment, 3 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [symbol]);

  return { sentiment, loading, error };
};