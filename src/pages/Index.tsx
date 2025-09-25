import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Timer, Play, RotateCcw, Users, Trophy, Gamepad2, Edit3 } from "lucide-react";
import { toast } from "sonner";

type Team = {
  name: string;
  members: string[];
  score: number;
};

// Helper component for handling game completion effect
function GameCompleteEffect({ isGameComplete, onComplete }: { isGameComplete: boolean; onComplete: () => void }) {
  useEffect(() => {
    if (isGameComplete) {
      onComplete();
    }
  }, [isGameComplete, onComplete]);
  
  return null;
}

export default function Index() {
  const [gameState, setGameState] = useState<'cover' | 'menu' | 'teams' | 'setup' | 'playing' | 'results'>('cover');
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [numberOfTeams, setNumberOfTeams] = useState(2);
  const [teams, setTeams] = useState<Team[]>([
    { name: "Team 1", members: [], score: 0 },
    { name: "Team 2", members: [], score: 0 }
  ]);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentCard, setCurrentCard] = useState<string[]>([]);
  const [usedCards, setUsedCards] = useState<Set<string>>(new Set());
  const [teamInputs, setTeamInputs] = useState({
    team1Name: "",
    team1Members: "",
    team2Name: "",
    team2Members: "",
    team3Name: "",
    team3Members: "",
    team4Name: "",
    team4Members: "",
    team5Name: "",
    team5Members: ""
  });
  const [totalRounds, setTotalRounds] = useState(1);
  const [currentRound, setCurrentRound] = useState(1);

  // Comprehensive Zambian cards inspired by South African 30 Seconds
  const zambianCards = [
    // ============= POP CULTURE & TRENDING =============
    ["TikTok Dance", "Video", "Viral", "Social Media", "Challenge"],
    ["Zed Twitter", "Zambian Twitter", "Trending", "Hashtag", "Social Media"],
    ["Ku Chalo", "World", "Zambia", "YouTube", "Internet"],
    ["Diamond TV", "TV", "Local Channel", "News", "Television"],
    ["Komboni Radio", "Radio", "Pobo", "Akuna Kulala", "94.9FM"],
    ["Load Shedding", "ZESCO", "Power Cut", "Electricity", "Darkness"],
    ["WhatsApp Group", "Chat", "Family", "Messages", "Green App"],
    ["Mobile Money Agent", "Booth", "Cash Out", "Transfer", "Float"],
    ["Zed Gossip", "Facebook Page", "Drama", "Celebrities", "Scandal"],
    ["ZNBC Memes", "TV1", "Funny", "Internet Jokes", "Broadcasting"],
    ["Slay Queen", "Instagram", "Fashion", "Lifestyle", "Social Media"],
    ["Ben Lombe", "Salon", "Comedian", "Zed Content", "YouTube"],
    ["Simon Mwewa Lane", "Vlogger", "Facebook", "Simoson", "Reflector Vest"],
    
    // ============= POLITICS & CURRENT AFFAIRS =============
    ["Hakainde Hichilema", "HH", "Bally", "UPND", "President"],
    ["Edgar Lungu", "ECL", "PF", "Former President", "Chagwa"],
    ["Michael Sata", "King Cobra", "PF", "Donchi Kubeba", "Former President"],
    ["Kenneth Kaunda", "KK", "First President", "Independence", "UNIP"],
    ["Levy Mwanawasa", "MMD", "Third", "Former President", "Anti-corruption"],
    ["Frederick Chiluba", "FTJ", "Democracy", "MMD", "Second President"],
    ["Rupiah Banda", "RB", "Bwezani", "Politician", "Former President"],
    ["Constitutional Court", "ConCourt", "Judges", "Legal", "Ruling"],
    ["CDF", "Loan", "Development", "Government", "Council"],
    ["Free Education", "Learning", "Government", "School", "UPND"],
    ["IMF Deal", "Loan", "Debt", "Re-structuring", "Economy"],
    ["By-election", "Voting", "Constituency", "Campaign", "Politics"],
    ["ACC", "Anti-Corruption", "Fraud", "Investigation", "Government"],
    ["Parliament", "MPs", "National Assembly", "Laws", "Debate"],
    ["ECZ", "Electoral Commission", "Voting", "Elections", "Results"],
    ["Cadre", "Political Supporter", "Violence", "Bus Station", "Politics"],
    
    // ============= FOOD & DRINK (ZAMBIAN) =============
    ["Nshima", "Mealie Meal", "Ubwali", "Staple", "White"],
    ["Vinkubala", "Caterpillars", "Mopane Worms", "Protein", "Fried"],
    ["Chikanda", "African Polony", "Orchid", "Vegetarian Meat", "Traditional"],
    ["Ifisashi", "Vegetables", "Groundnuts", "Pumpkin Leaves", "Soda"],
    ["Kapenta", "Small Fish", "Dried", "Eat", "Sardines"],
    ["Village Chicken", "Village", "Free Range", "Traditional", "Tough"],
    ["Munkoyo", "Drink", "Fermented", "Traditional", "Sweet"],
    ["Chibuku", "Shake Shake", "Beer", "Carton", "Traditional"],
    ["Bondwe", "Amaranthus", "Leafy Vegetable", "Traditional", "Green"],
    ["Inswa", "Flying", "Insect", "Rainy Season", "Eat"],
    ["Vitumbuwa", "Fritters", "Fry", "Street Food", "Dough"],
    ["Thobwa", "Fermented Drink", "Maize", "Sweet Sour", "Traditional"],
    ["Maheu", "Flavours", "Maize Drink", "Shake", "Sweet"],
    ["Bream", "Fish", "Kafue", "Grilled", "Fresh"],
    ["T-bone", "Steak", "Braai", "Meat", "Matebeto"],
    ["Mosi Lager", "Beer", "Zambian Breweries", "Golden", "Bottle"],
    ["Castle Lager", "Beer", "Bar", "South African", "Premium"],
    ["Eagle Lager", "Beer", "Affordable", "Bar", "Bottle"],
    
    // ============= CULTURE & TRADITIONS =============
    ["Lobola", "Bride Price", "Marriage Payment", "Traditional", "Dowry"],
    ["Kitchen Party", "Pre-wedding", "Women Only", "Advice", "Gifts"],
    ["Matebeto", "Food", "Marriage", "Bemba Tradition", "Feast"],
    ["Kuomboka", "Lozi Ceremony", "Barotse", "Flood", "Royal Barge"],
    ["Nc'wala", "Ngoni Ceremony", "First Fruits", "Eastern", "February"],
    ["Umutomboko", "Lunda Ceremony", "Chief Mwata Kazembe", "Luapula", "Dance"],
    ["Icilanga Mulilo", "Keeping Fire", "Mourning", "Funeral", "Tradition"],
    ["Chilanga Mulilo", "Marriage", "Ceremony", "Presentation", "Food"],
    ["Insaka", "Traditional Hut", "Meeting Place", "Shade", "Elders"],
    ["Ubuntu", "Humanity", "Philosophy", "Community", "African"],
    ["Chitenge", "African Print", "Wrapper", "Meters", "Women"],
    ["Bashikulu", "Grandfather", "Elder", "Respect", "Old Man"],
    ["Mukanda", "Boys Initiation", "Circumcision", "Ceremony", "Men"],
    
    // ============= COLLOQUIALISMS & SLANG =============
    ["Bally", "Father", "Old Man", "HH", "Dad"],
    ["Ka Something", "Small Amount", "Little Bit", "Some", "Few"],
    ["Exay", "Ohn", "Friend", "Guy", "Boyi"],
    ["Zigolo", "Sugar", "Water", "Drink", "Food"],
    ["Kaponya", "Bus Conductor", "Call Boy", "Change", "Transport"],
    ["Mayo", "Mother", "Mum", "Woman", "Respect"],
    ["Chibanda", "Ghost", "Spirit", "Scary", "Supernatural"],
    ["Bondi", "Home", "House", "Live", "Stay"],
    ["Kamtemba", "Kiosk", "Small Shop", "Corner Store", "Tuckshop"],
    ["Kapokola", "Police", "Officers", "Uniform", "Law"],
    ["Komboni", "Compound", "Township", "High Density", "Community"],
    ["Racks", "Money", "Cash", "Kwacha", "Currency"],
    ["Ndoshi", "Witch", "Witchcraft", "Magic", "Evil"],
    
    // ============= MUSIC - ZAMBIAN (70%) =============
    ["Yo Maps", "Olios", "Kidist", "Aweah", "Komando"],
    ["Macky 2", "Kopala", "King Bugga", "Rap", "Ghetto President"],
    ["Chef 187", "Numero Uno", "Bon Appetit", "Lyrical Sensei", "Rap"],
    ["Slapdee", "King Dizzo", "Rap", "XYZ", "Chikali"],
    ["Mampi", "Queen Diva", "Walilowelela", "Singer", "Fashion"],
    ["Roberto", "Amarulah", "Singer", "R&B", "My Name is..."],
    ["Cleo Ice Queen", "Rapper", "Shoulda Coulda Woulda", "Hip Hop", "Dreamers"],
    ["T-Sean", "Baila", "Dancehall", "Producer", "CEO"],
    ["Jay Rox", "Zone Fam", "Scar", "Auto Pilot", "Calibre"],
    ["B-Flow", "Dear Mama", "Sunda Station", "Political Music", "Conscious"],
    ["Pompi", "Singer", "Gospel", "Mizu", "Rap"],
    ["Abel Chungu", "Gospel", "Worship", "Christian", "Singer"],
    ["Ephraim", "Son of Africa", "Gospel", "Worship", "Singer"],
    ["Mag44", "Rapper", "Christian", "Believe", "44Drums"],
    ["Amayenge", "Legendary Band", "Kalindula", "Alice Chuma", "Group"],
    ["PK Chishala", "Kalindula", "Na Musonda", "Glasses", "Umuntu Ni Bantu"],
    ["Angela Nyirenda", "Ngoni", "Female", "Vintage", "Singer"],
    ["Danny Kaya", "Kaya", "R&B", "Twaumfwa", "Singer"],
    ["Lily T", "Female Artist", "Singer", "Voice", "Mvela"],
    ["Wezi", "Heart of Africa", "Singer", "Actress", "Voice"],
    ["Chanda Na Kay", "Duo", "Zambian Music", "Kopala", "Young Artists"],
    ["4 Na 5", "Duo", "Party", "Kontolola", "Dance"],
    ["Drimz", "Mr Muziq", "Baila", "Producer", "Artist"],
    ["Jemax", "New Wave", "Hip Hop", "Rap", "Music"],
    
    // ============= MUSIC - INTERNATIONAL (30%) =============
    ["Beyoncé", "Queen B", "Formation", "Single Ladies", "Jay-Z"],
    ["Drake", "Canadian", "Rapper", "OVO", "Hotline Bling"],
    ["Rihanna", "Barbados", "Umbrella", "Fenty", "Singer"],
    ["Burna Boy", "African Giant", "Nigerian", "Afrobeats", "Grammy"],
    ["Davido", "Aye", "Nigerian", "Fall", "Afrobeats"],
    ["Wizkid", "Starboy", "Nigerian", "Essence", "Afrobeats"],
    ["Amapiano", "South Africa", "Genre", "Dance", "Piano"],
    ["Diamond Platnumz", "Tanzanian", "Bongo Flava", "East Africa", "Simba"],
    ["Sauti Sol", "Kenya", "Melanin", "Afro", "Group"],
    ["Ed Sheeran", "British", "Shape of You", "Singer", "Guitar"],
    
    // ============= MOVIES & SERIES - ZAMBIAN (30%) =============
    ["Zuba", "Zambezi Magic", "Lute", "Sosala", "TV Show"],
    ["Mpali", "Zambezi Magic", "Nguzu", "Farm", "Series"],
    ["Banja", "Comedy", "Family Show", "Zambian", "Muvi TV"],
    ["Love Games", "Drama Series", "Zambian", "Dating", "HIV/AIDS"],
    ["I Am Not A Witch", "Film", "Award Winning", "Rungano Nyoni", "International"],
    ["The Letter Reader", "Zambian Film", "Drama", "Local", "Movie"],
    ["Shaka Zulu", "Film", "Zulu King", "South Africa", "Cow-horn formation"],
    ["Suwi", "Drama Series", "Local", "TV Show", "Popular"],
    ["Kabanana", "Series", "Drama", "Jason", "TV"],
    ["Mwine Mushi", "Kasaka", "Comedy", "TV", "Village"],
    
    // ============= MOVIES & SERIES - INTERNATIONAL (70%) =============
    ["Black Panther", "Wakanda", "Marvel", "Chadwick Boseman", "Superhero"],
    ["Money Heist", "La Casa de Papel", "Netflix", "Professor", "Spanish"],
    ["Squid Game", "Korean", "Netflix", "Deadly Games", "456"],
    ["Bridgerton", "Netflix", "Historical", "Romance", "Duke"],
    ["Game of Thrones", "Stark", "Dragon", "Winter", "Daenerys Targaryen"],
    ["The Queen", "Mzansi Magic", "South African", "Drama", "Telenovela"],
    ["Gomora", "Mzansi Magic", "South African", "Township", "Drama"],
    ["Blood and Water", "Netflix", "South African", "Teen Drama", "Cape Town"],
    ["Woman King", "Dahomey", "Warriors", "Viola Davis", "Fight"],
    ["Coming to America", "Eddie Murphy", "Comedy", "Prince", "Queens"],
    ["Titanic", "Ship", "Leonardo DiCaprio", "Romance", "Iceberg"],
    ["Avatar", "Blue People", "Pandora", "James Cameron", "3D"],
    ["Avengers", "Marvel", "Superheroes", "Thanos", "Infinity Stones"],
    ["Fast and Furious", "Cars", "Racing", "Vin Diesel", "Family"],
    ["Friends", "Sitcom", "Central Perk", "Ross and Rachel", "Comedy"],
    ["The Office", "Comedy", "Dunder Mifflin", "Michael Scott", "Workplace"],
    ["Stranger Things", "Netflix", "Upside Down", "Eleven", "80s"],
    ["Breaking Bad", "Walter White", "Meth", "Heisenberg", "Chemistry"],
    ["Narcos", "Pablo Escobar", "Colombia", "DEA", "Drugs"],
    ["Prison Break", "Michael Scofield", "Tattoo", "Escape", "Brothers"],
    
    // ============= SPORTS & RECREATION =============
    ["Chipolopolo", "Men", "National Team", "Football", "Zambia"],
    ["AFCON 2012", "Zambia", "Gabon", "Penalty", "Win"],
    ["Kalusha Bwalya", "Great Kalu", "Legend", "Footballer", "1988"],
    ["Fashion Sakala", "Rangers", "Striker", "Glasgow", "Chipolopolo"],
    ["Patson Daka", "Leicester City", "Striker", "Red Bull", "Football"],
    ["Enock Mwepu", "Football", "Brighton", "Midfielder", "Retired"],
    ["Barbra Banda", "Women's Football", "Striker", "Shanghai", "Copper Queens"],
    ["Samuel Matete", "400m Hurdles", "Olympics", "Athletics", "Legend"],
    ["Muzala Samukonga", "400m", "Commonwealth", "Gold", "Runner"],
    ["Boxing Day", "December 26", "Holiday", "Sports", "Celebration"],
    ["Heroes Stadium", "National", "Lusaka", "Football", "Venue"],
    ["Nkana FC", "Kalampa", "Red Devils", "Kitwe", "Wusakile"],
    ["Power Dynamos", "Aba Yellow", "Kitwe", "Arthur Davies", "Football"],
    ["Zesco United", "Team Ya Ziko", "Ndola", "Champions", "Football"],
    ["Green Buffaloes", "Army Team", "Lusaka", "Military", "Football"],
    ["Red Arrows", "Airmen", "Air Force", "Nkoloma", "Football"],
    ["Zanaco FC", "Bankers", "The Sensational", "Sunset", "Football"],
    
    // ============= BUSINESS & BRANDS =============
    ["Shoprite", "Supermarket", "Mall", "Groceries", "Red"],
    ["Pick n Pay", "Supermarket", "Groceries", "Smart Shopper", "Blue"],
    ["Trade Kings", "Boom", "Manufacturing", "Local Company", "Detergent"],
    ["Zambeef", "Meat", "Butchery", "ZamChick", "Zambia"],
    ["Zambian Breweries", "Mosi", "Beer", "Clear Beer", "SABMiller"],
    ["MTN", "Network", "Mobile", "Yellow", "Everywhere You Go"],
    ["Airtel", "Network", "Mobile", "Red", "The Smartphone Network"],
    ["Zamtel", "Network", "Government", "Green", "Telecommunications"],
    ["Stanbic Bank", "Blue", "Bank", "Moving Forward", "Financial"],
    ["Zanaco Bank", "Red", "Bank", "The People's Bank", "Commercial"],
    ["FNB", "First National", "Banking", "How Can We Help", "eWallet"],
    ["Game Stores", "Department Store", "Electronics", "Furniture", "Mall"],
    ["Hungry Lion", "Fast Food", "Chicken", "Franchise", "Orange"],
    ["Debonairs Pizza", "Pizza", "Delivery", "Fast Food", "Black"],
    ["Nando's", "Chicken", "Festa Fries", "Restaurant", "Flame Grilled"],
    ["ZESCO", "Electricity", "Power", "Utility", "Load Shedding"],
    
    // ============= GEOGRAPHY & PLACES =============
    ["Victoria Falls", "Mosi-oa-Tunya", "Tourism", "Waterfall", "Livingstone"],
    ["Kariba Dam", "Hydroelectric", "Lake", "Zimbabwe Border", "Power"],
    ["Zambezi River", "River", "Mwinilunga", "Water", "Indian Ocean"],
    ["Lake Tanganyika", "Top", "Tanzania", "Mpulungu", "Water"],
    ["Kafue National Park", "Largest", "Wildlife", "Busanga Plains", "Conservation"],
    ["South Luangwa", "Walking Safaris", "Leopards", "Mfuwe", "Valley"],
    ["Copperbelt", "Mining Region", "Ndola", "Kitwe", "Copper"],
    ["Lusaka Province", "Capital", "Central", "Town", "City"],
    ["Western Province", "Barotseland", "Mongu", "Floodplains", "Lozi"],
    ["Eastern Province", "Chipata", "Fort Jameson", "Malawi", "Chewa"],
    ["Northern Province", "Kasama", "Bemba", "Waterfalls", "Up"],
    ["Chirundu", "Border", "Zimbabwe", "Bridge", "One Stop"],
    ["Great East Road", "Chelston", "Highway", "Chipata", "Town"],
    ["Great North Road", "Miles", "Highway", "Emmasdale", "Longest"],
    ["Devil's Pool", "Victoria Falls", "Edge", "Swimming", "Dangerous"],
    ["Blue Lagoon", "Kafue Flats", "Park", "Birds", "Wetlands"],
    ["Mukuni Village", "Cultural", "Traditional", "Tourism", "Chief"],
    
    // ============= COMPOUNDS & TOWNSHIPS =============
    ["Kanyama", "Compound", "Largest", "John Laing", "Kwa"],
    ["Chibolya", "Compound", "Misisi", "George", "Illegal"],
    ["Matero", "Compound", "Metro", "Lusaka West", "Market"],
    ["Mandevu", "Compound", "Constituency", "Lusaka", "Beard"],
    ["Bauleni", "Compound", "Leopards Hill", "Market", "Ibex"],
    ["Kalingalinga", "Compound", "Mtendere", "Market", "Traffic Lights"],
    ["Garden Compound", "Garden", "Chaisa", "Compound", "Students"],
    ["Mtendere", "Compound", "East", "PHI", "Market"],
    ["Soweto Market", "Lusaka Central", "Town", "Vegetables", "Busy"],
    ["Kamwala", "Wholesale", "Affordable", "Salaula", "Indian"],
    ["City Market", "Town Centre", "Curios", "Handicrafts", "Tourists"],
    ["Kulima Tower", "Bus Station", "Intercity", "Market", "Iringa Mall"],
    
    // ============= SCIENCE & TECHNOLOGY =============
    ["Solar Panel", "Electricity", "Sun", "Power", "Renewable"],
    ["Borehole", "Water", "Drilling", "Underground", "Pump"],
    ["Starlink", "Satellite Internet", "Elon Musk", "Space", "Fast"],
    ["WhatsApp", "Messaging", "Green", "Meta", "Voice Notes"],
    ["TikTok", "Videos", "Chinese", "Dancing", "For You Page"],
    ["Facebook", "Social Media", "Mark Zuckerberg", "Blue", "Meta"],
    ["Twitter", "X", "Tweets", "Elon Musk", "Blue Bird"],
    ["ZESCO App", "Electricity", "Units", "Buy", "Mobile"],
    ["E-Voucher", "FISP", "Farming", "Fertilizer", "Electronic"],
    ["Smart License", "RTSA", "Driving", "Card", "Chip"],
    ["NRC", "National Registration", "Green Book", "ID", "Citizenship"],
    ["COVID-19", "Coronavirus", "Pandemic", "Vaccine", "Mask"],
    ["Airtel Money", "Mobile Money", "Red", "Withdraw", "Send"],
    ["MTN MoMo", "Mobile Money", "Yellow", "Transfer", "Withdraw"],
    
    // ============= HISTORY & HERITAGE =============
    ["Independence", "October 24", "1964", "Freedom", "Britain"],
    ["UNIP", "United National", "Independence Party", "One Party", "KK"],
    ["Federation", "Rhodesia Nyasaland", "Colonial", "1953-1963", "Three Countries"],
    ["Cha-cha-cha", "Rebellion", "1961", "Northern", "UNIP"],
    ["Harry Mwaanga Nkumbula", "ANC", "Freedom Fighter", "Politics", "Leader"],
    ["Simon Kapwepwe", "Vice President", "UNIP", "Bemba", "Leader"],
    ["Alice Lenshina", "Lumpa Church", "Religious", "Movement", "Chinsali"],
    ["Chiluba Era", "MMD", "Democracy", "1991", "Change"],
    ["Privatization", "Selling", "State Companies", "1990s", "MMD"],
    ["Northern Rhodesia", "Colonial Name", "Zambia", "British", "Territory"],
    ["Barotseland Agreement", "1964", "Western Province", "Litunga", "Treaty"],
    ["Freedom Statue", "Monument", "Independence", "Lusaka", "1974"],
    
    // ============= EDUCATION INSTITUTIONS =============
    ["UNZA", "University of Zambia", "Great East Road", "Goma Lakes", "Students"],
    ["CBU", "Copperbelt University", "Kitwe", "Engineering", "Medicine"],
    ["Mulungushi University", "MU", "Kabwe", "Private", "Great North Road"],
    ["Apex Medical University", "Medicine", "Private", "Lusaka", "Health"],
    ["DMI St. Eugene", "Private University", "Chibombo", "Catholic", "Great North Road"],
    
    // ============= SHOPPING MALLS =============
    ["Manda Hill", "Mall", "Shopping Centre", "Cinema", "Great East"],
    ["Levy Junction", "Mall", "Shopping", "Church Road", "ZCAS"],
    ["East Park Mall", "Shopping", "Great East Road", "Chicagos", "Arcades"],
    ["Cosmopolitan Mall", "Cosmo", "Shopping", "Kafue Road", "Makeni"],
    ["Novare Pinnacle", "Mall", "Woodlands", "Shopping", "Roco Mamas"],
    
    // ============= MEDIA & COMMUNICATION =============
    ["Times of Zambia", "Newspaper", "Daily", "Government", "Print"],
    ["Daily Mail", "Newspaper", "Government", "Daily", "Print"],
    ["News Diggers", "Online", "Independent", "Media", "News"],
    ["Mwebantu", "Online Media", "News", "Website", "Gossip"],
    ["ZNBC", "TV1", "National", "TV2", "Television"],
    ["Radio Phoenix", "89.5 FM", "Paddy", "Breakfast Show", "Sweetheart Radio"],
    ["QFM", "94.5", "Quality", "Radio", "News"],
    ["Hot FM", "87.7", "Youth", "Music", "Radio"],
    ["Power FM", "99.7", "Talk Radio", "Politics", "Current Affairs"],
    ["Muvi TV", "Private", "Channel", "Local Content", "Entertainment"],
    ["Prime TV", "Private Television", "News", "Local", "Channel"],
    
    // ============= EVERYDAY OBJECTS & LIFE =============
    ["Brazier", "Mbaula", "Charcoal", "Cooking", "Heat"],
    ["Talk Time", "Airtime", "Units", "Phone", "Credit"],
    ["Cantor", "5 Liter", "Container", "Water", "Plastic"],
    ["Mosquito Net", "Bed", "Malaria", "Protection", "Sleep"],
    ["Chigayo", "Grinding", "Maize", "Machine", "Mealie Meal"],
    ["Minibus", "Blue Taxi", "Public Transport", "Conductor", "Komboni"],
    ["Rosa Bus", "Big Bus", "Public Transport", "Conductor", "Routes"],
    ["Kabende", "Groundnuts", "Maize", "Pound", "Katapa"],
    ["Pot", "Cooking", "Stove", "Round", "Fire"],
    ["Mpasa", "Sleeping", "Sit", "Traditional", "Mat"]
  ];

  const getNextCard = () => {
    const availableCards = zambianCards.filter(card => !usedCards.has(card[0]));
    
    // If all cards have been used, reset the used cards set
    if (availableCards.length === 0) {
      setUsedCards(new Set());
      return zambianCards[Math.floor(Math.random() * zambianCards.length)];
    }
    
    const selectedCard = availableCards[Math.floor(Math.random() * availableCards.length)];
    setUsedCards(prev => new Set([...prev, selectedCard[0]]));
    return selectedCard;
  };

  const startGame = () => {
    setGameState('playing');
    const newCard = getNextCard();
    setCurrentCard(newCard);
    setTimeLeft(30);
    startTimer();
  };

  const startTimer = () => {
    setIsTimerRunning(true);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimerRunning(false);
          setGameState('results');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const correctGuess = () => {
    setTeams(prev => prev.map((team, index) => 
      index === currentTeamIndex 
        ? { ...team, score: team.score + 1 }
        : team
    ));
    const newCard = getNextCard();
    setCurrentCard(newCard);
  };

  const nextTeam = () => {
    const nextTeamIndex = (currentTeamIndex + 1) % numberOfTeams;
    
    // If we've completed a full cycle (all teams played), increment round
    if (nextTeamIndex === 0) {
      if (currentRound >= totalRounds) {
        // Game is complete - show final results
        setGameState('results');
        return;
      } else {
        setCurrentRound(prev => prev + 1);
      }
    }
    
    setCurrentTeamIndex(nextTeamIndex);
    setGameState('setup');
  };

  const resetGame = () => {
    setGameState('menu');
    // Reset teams array to match selected number of teams
    const newTeams = Array.from({ length: numberOfTeams }, (_, i) => ({
      name: `Team ${i + 1}`,
      members: [],
      score: 0
    }));
    setTeams(newTeams);
    setCurrentTeamIndex(0);
    setCurrentRound(1);
    setTimeLeft(30);
    setIsTimerRunning(false);
    setUsedCards(new Set()); // Reset used cards for new game
  };

  const saveTeams = async () => {
    const newTeams: Team[] = Array.from({ length: numberOfTeams }, (_, i) => ({
      name: teamInputs[`team${i + 1}Name` as keyof typeof teamInputs] as string || `Team ${i + 1}`,
      members: (teamInputs[`team${i + 1}Members` as keyof typeof teamInputs] as string)
        .split(',')
        .map(m => m.trim())
        .filter(m => m.length > 0),
      score: teams[i]?.score || 0
    }));

    // Teams configured successfully - no backend saving for now
    toast.success("Teams configured successfully!");
    setTeams(newTeams);
    setGameState('setup');
  };

  const recordGameResults = async () => {
    const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
    const winningTeam = sortedTeams[0];
    
    // Game complete - no backend recording for now
    toast.success(`Game complete! ${winningTeam.name} wins with ${winningTeam.score} points!`);
  };

  if (gameState === 'cover') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 via-orange-500 to-red-600 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full"></div>
          <div className="absolute top-32 right-20 w-16 h-16 border-2 border-white rotate-45"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-32 right-10 w-12 h-12 border-2 border-white rotate-45"></div>
          <div className="absolute top-1/2 left-1/4 w-8 h-8 border-2 border-white rounded-full"></div>
          <div className="absolute top-1/3 right-1/3 w-6 h-6 border-2 border-white rotate-45"></div>
        </div>

        <div className="text-center space-y-12 max-w-lg mx-auto z-10">
          <div className="space-y-6">
            <div className="relative">
              {/* Hourglass Logo */}
              <div className="game-logo drop-shadow-2xl">
                <div className="zed-text">ZED</div>
                <div className="mx-auto">
                  <img 
                    src="/hourglass-icon.svg" 
                    alt="Hourglass" 
                    className="w-24 h-24 mx-auto drop-shadow-lg"
                  />
                </div>
                <div className="seconds-text">30 SECONDS</div>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
              <p className="text-2xl text-white/95 font-medium text-balance">
                The Ultimate Zambian
              </p>
              <p className="text-3xl text-white font-bold text-balance" style={{ fontFamily: 'Brasika, ui-sans-serif, system-ui, sans-serif' }}>
                Guessing Game
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <Timer className="size-8 mx-auto text-yellow-400 mb-2" />
                <p className="text-white/90 text-sm font-medium">30 Seconds</p>
              </div>
              <div className="text-center">
                <Users className="size-8 mx-auto text-yellow-400 mb-2" />
                <p className="text-white/90 text-sm font-medium">Team Game</p>
              </div>
              <div className="text-center">
                <Trophy className="size-8 mx-auto text-yellow-400 mb-2" />
                <p className="text-white/90 text-sm font-medium">Score Points</p>
              </div>
            </div>

            <Button 
              onClick={() => setGameState('menu')}
              size="lg" 
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-2 border-white/40 font-bold text-xl py-6 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              <Play className="mr-3 size-6" />
              Start Playing
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-6 text-center text-white/70 text-sm">
          <p>Celebrating Zambian Culture • Livingstone to Nakonde & everywhere in-between</p>
        </div>
      </div>
    );
  }

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 via-orange-500 to-red-600 dark:from-green-700 dark:via-orange-600 dark:to-red-700 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-8 max-w-md mx-auto">
          <div className="space-y-4">
            <Gamepad2 className="size-16 mx-auto text-white" />
            <h1 className="text-4xl font-bold text-white text-balance" style={{ fontFamily: 'Brasika, ui-sans-serif, system-ui, sans-serif' }}>
              Zed 30 Seconds
            </h1>
            <p className="text-lg text-white/90">
              The Zambian guessing game that brings friends together!
            </p>
          </div>
          
          <Card className="bg-white/95 backdrop-blur-sm dark:bg-gray-800/95">
            <CardHeader>
              <CardTitle className="text-center text-gray-800 dark:text-gray-100">How to Play</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-gray-700 dark:text-gray-200">• Teams take turns</p>
              <p className="text-gray-700 dark:text-gray-200">• Describe the main word without using the forbidden words</p>
              <p className="text-gray-700 dark:text-gray-200">• Get as many correct guesses as possible in 30 seconds</p>
              <p className="text-gray-700 dark:text-gray-200">• Featuring Zambian people, places, and culture!</p>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm dark:bg-gray-800/95">
            <CardHeader>
              <CardTitle className="text-center text-gray-800 dark:text-gray-100">Number of Teams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center gap-2 mb-4">
                {[2, 3, 4, 5].map((num) => (
                  <Button
                    key={num}
                    onClick={() => setNumberOfTeams(num)}
                    variant={numberOfTeams === num ? "default" : "outline"}
                    className="text-sm px-4 py-2"
                  >
                    {num}
                  </Button>
                ))}
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Selected: {numberOfTeams} teams
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm dark:bg-gray-800/95">
            <CardHeader>
              <CardTitle className="text-center text-gray-800 dark:text-gray-100">Number of Rounds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {[1, 5, 10, 15, 20].map((rounds) => (
                  <Button
                    key={rounds}
                    onClick={() => setTotalRounds(rounds)}
                    variant={totalRounds === rounds ? "default" : "outline"}
                    className="text-sm py-2"
                  >
                    {rounds}
                  </Button>
                ))}
              </div>
              <p className="text-center text-sm text-muted-foreground mt-2">
                Selected: {totalRounds} round{totalRounds > 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Button 
              onClick={() => setGameState('teams')} 
              size="lg" 
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-4"
            >
              <Edit3 className="mr-2 size-5" />
              Setup Teams
            </Button>
            
            <Button 
              onClick={() => setGameState('setup')} 
              size="lg" 
              variant="secondary"
              className="w-full"
            >
              <Play className="mr-2 size-5" />
              Quick Start
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'teams') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 via-orange-500 to-red-600 dark:from-green-700 dark:via-orange-600 dark:to-red-700 flex flex-col items-center justify-center p-4">
        <div className="max-w-md mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Brasika, ui-sans-serif, system-ui, sans-serif' }}>
              Setup {numberOfTeams} Teams
            </h2>
            <p className="text-white/90">Enter team names and player names</p>
          </div>

          <div className="space-y-6 max-h-96 overflow-y-auto">
            {Array.from({ length: numberOfTeams }, (_, i) => (
              <Card key={i} className="bg-white/95 backdrop-blur-sm dark:bg-gray-800/95">
                <CardHeader>
                  <CardTitle className="text-center text-gray-800 dark:text-gray-100">Team {i + 1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor={`team${i + 1}Name`} className="text-gray-700 dark:text-gray-200">Team Name</Label>
                    <Input
                      id={`team${i + 1}Name`}
                      placeholder={`e.g., The Zambezi Warriors`}
                      value={teamInputs[`team${i + 1}Name` as keyof typeof teamInputs] as string}
                      onChange={(e) => setTeamInputs(prev => ({ ...prev, [`team${i + 1}Name`]: e.target.value }))}
                      className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`team${i + 1}Members`} className="text-gray-700 dark:text-gray-200">Player Names (comma separated)</Label>
                    <Input
                      id={`team${i + 1}Members`}
                      placeholder={`e.g., Chanda, Mulenga, Temba`}
                      value={teamInputs[`team${i + 1}Members` as keyof typeof teamInputs] as string}
                      onChange={(e) => setTeamInputs(prev => ({ ...prev, [`team${i + 1}Members`]: e.target.value }))}
                      className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            <Button 
              onClick={saveTeams}
              size="lg" 
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4"
            >
              Save Teams & Continue
            </Button>
            
            <Button 
              onClick={() => setGameState('menu')}
              variant="secondary" 
              size="lg" 
              className="w-full"
            >
              Back to Menu
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'setup') {
    const currentTeam = teams[currentTeamIndex];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 via-orange-500 to-red-600 dark:from-green-700 dark:via-orange-600 dark:to-red-700 flex flex-col items-center justify-center p-4">
        <div className="max-w-md mx-auto space-y-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 text-lg px-4 py-2">
              {currentTeam.name}'s Turn
            </Badge>
            <div className="flex justify-center items-center gap-2 mb-2">
              <Badge variant="outline" className="text-sm bg-white/20 text-white border-white/30">
                Round {currentRound} of {totalRounds}
              </Badge>
            </div>
            {currentTeam.members.length > 0 && (
              <p className="text-white/90 text-sm">
                Players: {currentTeam.members.join(", ")}
              </p>
            )}
          </div>

          <Card className="bg-white/95 backdrop-blur-sm dark:bg-gray-800/95">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center gap-2 text-gray-800 dark:text-gray-100">
                <Trophy className="size-5" />
                Scoreboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teams.map((team, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-gray-100">{team.name}</div>
                      {team.members.length > 0 && (
                        <div className="text-sm text-muted-foreground">
                          {team.members.slice(0, 3).join(", ")}
                          {team.members.length > 3 && ` +${team.members.length - 3} more`}
                        </div>
                      )}
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {team.score}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Button 
              onClick={startGame}
              size="lg" 
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4"
            >
              <Timer className="mr-2 size-5" />
              Start 30 Seconds
            </Button>
            
            <div className="flex gap-3">
              <Button 
                onClick={() => setGameState('teams')}
                variant="secondary" 
                size="lg" 
                className="flex-1"
              >
                <Edit3 className="mr-2 size-4" />
                Edit Teams
              </Button>
              
              <Button 
                onClick={resetGame}
                variant="secondary" 
                size="lg" 
                className="flex-1"
              >
                <RotateCcw className="mr-2 size-4" />
                New Game
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    const currentTeam = teams[currentTeamIndex];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 via-orange-500 to-red-600 dark:from-green-700 dark:via-orange-600 dark:to-red-700 flex flex-col">
        {/* Header */}
        <div className="p-4 text-center bg-black/20 dark:bg-black/40">
          <div className="flex justify-between items-center mb-2">
            <Badge variant="secondary">{currentTeam.name}</Badge>
            <div className="text-center">
              <div className="text-3xl font-bold text-white bg-black/30 dark:bg-black/50 px-4 py-2 rounded-lg">
                {timeLeft}s
              </div>
              <Badge variant="outline" className="text-xs mt-1 bg-white/20 text-white border-white/30">
                Round {currentRound}/{totalRounds}
              </Badge>
            </div>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
          {currentTeam.members.length > 0 && (
            <p className="text-white/80 text-sm">
              {currentTeam.members.join(" • ")}
            </p>
          )}
        </div>

        {/* Game Card */}
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-sm bg-white dark:bg-gray-800 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-3xl font-bold text-green-700 dark:text-green-400 mb-2" style={{ fontFamily: 'Brasika, ui-sans-serif, system-ui, sans-serif' }}>
                {currentCard[0]}
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                Describe this without using the words below:
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {currentCard.slice(1).map((word, index) => (
                  <Badge 
                    key={index} 
                    variant="destructive" 
                    className="text-center py-2 text-sm"
                  >
                    {word}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="p-4 space-y-3">
          <Button 
            onClick={correctGuess}
            size="lg" 
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 text-lg"
          >
            ✓ Correct! Next Card
          </Button>
          
          <div className="flex gap-3">
            <Button 
              onClick={() => {
                const newCard = getNextCard();
                setCurrentCard(newCard);
              }}
              variant="secondary"
              size="lg" 
              className="flex-1"
            >
              Skip Card
            </Button>
            <Button 
              onClick={() => {
                setIsTimerRunning(false);
                setGameState('results');
              }}
              variant="destructive"
              size="lg" 
              className="flex-1"
            >
              End Turn
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'results') {
    const currentTeam = teams[currentTeamIndex];
    const isGameComplete = currentRound >= totalRounds && currentTeamIndex === (numberOfTeams - 1);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 via-orange-500 to-red-600 dark:from-green-700 dark:via-orange-600 dark:to-red-700 flex flex-col items-center justify-center p-4">
        <GameCompleteEffect isGameComplete={isGameComplete} onComplete={recordGameResults} />
        <div className="max-w-md mx-auto space-y-8">
          <div className="text-center">
            <Trophy className="size-16 mx-auto text-yellow-400 mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Brasika, ui-sans-serif, system-ui, sans-serif' }}>
              {isGameComplete ? 'Game Complete!' : 'Time\'s Up!'}
            </h2>
            <Badge variant="secondary" className="text-lg px-4 py-2 mb-2">
              {currentTeam.name} scored {currentTeam.score} points!
            </Badge>
            <Badge variant="outline" className="text-sm bg-white/20 text-white border-white/30">
              Round {currentRound} of {totalRounds}
            </Badge>
            {currentTeam.members.length > 0 && (
              <p className="text-white/90 text-sm mt-2">
                Great job: {currentTeam.members.join(", ")}!
              </p>
            )}
          </div>

          <Card className="bg-white/95 backdrop-blur-sm dark:bg-gray-800/95">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center gap-2 text-gray-800 dark:text-gray-100">
                <Users className="size-5" />
                {isGameComplete ? 'Final Scoreboard' : 'Current Scoreboard'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teams
                  .sort((a, b) => b.score - a.score) // Sort by score descending
                  .map((team, index) => (
                  <div key={team.name} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {isGameComplete && index === 0 && (
                        <Trophy className="size-4 text-yellow-500" />
                      )}
                      <div>
                        <div className="font-semibold text-gray-800 dark:text-gray-100">{team.name}</div>
                        {team.members.length > 0 && (
                          <div className="text-sm text-muted-foreground">
                            {team.members.slice(0, 2).join(", ")}
                            {team.members.length > 2 && ` +${team.members.length - 2} more`}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {team.score}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {!isGameComplete && (
              <Button 
                onClick={nextTeam}
                size="lg" 
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-4"
              >
                Next Team's Turn
              </Button>
            )}
            
            <Button 
              onClick={resetGame}
              variant="secondary" 
              size="lg" 
              className="w-full"
            >
              <RotateCcw className="mr-2 size-5" />
              New Game
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
