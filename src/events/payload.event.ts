

interface PayloadEvent {
  
  game: {
    
    home: {
      market: string;
    }
    
    away: {
      market: string;
    }
  }

  clocks: {
    game: string;
  }
  
}