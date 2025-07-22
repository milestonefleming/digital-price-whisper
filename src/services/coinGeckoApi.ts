const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

export interface CoinGeckoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
}

export interface CoinData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  icon: string;
}

const coinIcons: Record<string, string> = {
  bitcoin: "₿",
  ethereum: "Ξ", 
  dogecoin: "Ð"
};

export const fetchCoinData = async (): Promise<CoinData[]> => {
  try {
    const response = await fetch(
      `${COINGECKO_API_BASE}/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,dogecoin&order=market_cap_desc&per_page=3&page=1&sparkline=false&price_change_percentage=24h`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch coin data');
    }
    
    const data: CoinGeckoData[] = await response.json();
    
    return data.map(coin => ({
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.current_price,
      change24h: coin.price_change_percentage_24h || 0,
      icon: coinIcons[coin.id] || coin.symbol.charAt(0).toUpperCase()
    }));
  } catch (error) {
    console.error('Error fetching coin data:', error);
    // Fallback to mock data in case of API failure
    return [
      { symbol: "BTC", name: "Bitcoin", price: 45250.32, change24h: 2.45, icon: "₿" },
      { symbol: "ETH", name: "Ethereum", price: 2850.67, change24h: -1.23, icon: "Ξ" },
      { symbol: "DOGE", name: "Dogecoin", price: 0.08, change24h: 5.67, icon: "Ð" }
    ];
  }
};

export const fetchSingleCoinData = async (coinId: string): Promise<CoinData | null> => {
  try {
    const geckoId = coinId === 'btc' ? 'bitcoin' : coinId === 'eth' ? 'ethereum' : 'dogecoin';
    const response = await fetch(
      `${COINGECKO_API_BASE}/coins/${geckoId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch single coin data');
    }
    
    const data = await response.json();
    
    return {
      symbol: data.symbol.toUpperCase(),
      name: data.name,
      price: data.market_data.current_price.usd,
      change24h: data.market_data.price_change_percentage_24h || 0,
      icon: coinIcons[data.id] || data.symbol.charAt(0).toUpperCase()
    };
  } catch (error) {
    console.error('Error fetching single coin data:', error);
    return null;
  }
};