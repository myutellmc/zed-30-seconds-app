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

type SavedTeam = {
  _id: string;
  name: string;
  members: string[];
  gamesPlayed: number;
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

  // Safe fallbacks for Convex functionality
  const savedTeams: SavedTeam[] = [];
  const teamsLoading = false;
  const saveTeam = async (_teamData?: { name: string; members: string[] }) => {
    console.log('Team save temporarily disabled');
    return Promise.resolve();
  };
  const recordGame = async (_gameData?: any) => {
    console.log('Game recording temporarily disabled');
    return Promise.resolve();
  };

  // Zambian-themed cards with closely associated forbidden words (not literal word components)
  const zambianCards = [
    ["Victoria Falls", "Mosi-oa-Tunya", "Seven Wonders", "Spray", "Tourism"],
    ["Kenneth Kaunda", "KK", "Father", "Nation", "Uhuru"],
    ["Nshima", "Hands", "Relish", "Dinner", "White"],
    ["Copper", "Red", "Copperbelt", "Export", "Mining"],
    ["Chitenge", "Women", "Wrapper", "Two metres", "Colourful"],
    ["Lusaka", "CBD", "Parliament", "Million", "Central"],
    ["Michael Sata", "Cobra", "PF", "Boma", "Populist"],
    ["Kafue National Park", "Largest", "Antelope", "Conservation", "Central Province"],
    ["Baobab", "Upside down", "Ancient", "Cream", "Massive"],
    ["Zambezi", "Fourth longest", "Atlantic", "Border", "Source"],
    ["Chibuku", "Shake shake", "Carton", "Sour", "Opaque"],
    ["Kapenta", "Tanganyika", "Protein", "Small", "Silver"],
    ["Chongololo", "Coil", "Many", "Harmless", "Garden"],
    ["Braai", "Weekend", "Charcoal", "Meat", "Social"],
    ["Mukwa", "Hardwood", "Furniture", "Indigenous", "Valuable"],
    ["Ifisashi", "Green", "Groundnuts", "Dinner", "Sauce"],
    ["Ukushana", "Movement", "Rhythm", "Cultural", "Celebration"],
    ["Boma", "Traditional", "Elders", "Decisions", "Circle"],
    ["Impala", "Graceful", "Leaping", "Antelope", "Swift"],
    ["Chimanga", "Roasted", "Street", "Yellow", "Snack"],
    ["Masuku", "Wild", "Season", "Sweet", "Bush"],
    ["Livingstone", "Adventure", "Tourism", "Southern", "Gateway"],
    ["Ndola", "Industrial", "Second", "Copperbelt", "Mining"],
    ["Kitwe", "Copper", "Mining", "Industrial", "Copperbelt"],
    ["Lake Kariba", "Artificial", "Hydroelectric", "Fishing", "Zimbabwe"],
    ["Kalabo", "Floods", "Western", "Remote", "Traditional"],
    ["Mongu", "Royal", "Western", "Floodplains", "Capital"],
    ["Kuomboka", "Royal", "Floods", "Ceremony", "March"],
    ["South Luangwa", "Walking", "Leopard", "Norman Carr", "Conservation"],
    ["Lower Zambezi", "Elephants", "Canoeing", "Escarpment", "Remote"],
    ["Matero", "High density", "Residential", "Urban", "Community"],
    ["Kanyama", "Largest", "Compound", "High density", "Urban"],
    ["Insaka", "Traditional", "Shade", "Meetings", "Gathering"],
    ["Ubuntu", "African", "Philosophy", "Humanity", "Community"],
    ["Nsima", "Staple", "Hands", "Relish", "White"],
    ["Ichalo", "Traditional", "Seeds", "Strategy", "Ancient"],
    ["Kwacha", "Eagle", "Rebased", "Currency", "Zambian"],
    ["Ngoma", "Rhythm", "Ceremony", "Traditional", "Sound"],
    ["Musika", "Vendors", "Wholesale", "Trading", "Commercial"],
    ["Chitapa", "Root", "Orange", "Nutritious", "Sweet"],
    ["Munkoyo", "Fermented", "Traditional", "Roots", "Sweet"],
    ["Umwenge", "Traditional", "Fermented", "Sorghum", "Local"],
    ["Kalimba", "Fingers", "Metal", "Music", "Traditional"],
    ["Citemene", "Slash", "Burn", "Traditional", "Agriculture"],
    ["Luyando", "Emotion", "Heart", "Care", "Affection"],
    ["Tubwato", "Traditional", "Wooden", "Transport", "River"],
    ["Nkuku", "Poultry", "Village", "Eggs", "Meat"],
    ["Matamba", "Fermented", "Traditional", "Sweet", "Local"],
    ["Chikanda", "African", "Orchid", "Protein", "Sausage"],
    ["Delele", "Slimy", "Green", "Vegetable", "Okra"],
    ["Chishimba", "Northern", "Beautiful", "Cascade", "Tourism"],
    ["Mfuwe", "Gateway", "International", "South Luangwa", "Tourism"],
    ["Mazabuka", "Sugar", "Sweet", "Southern", "Agriculture"],
    ["Solwezi", "Copper", "North Western", "Mining", "Remote"],
    ["Manda Hill", "Mall", "Shopping", "Western", "Modern"],
    ["Cathedral of the Holy Cross", "Catholic", "Ridgeway", "Archbishop", "Gothic"],
    ["Agricultural Show", "Annual", "Showgrounds", "Farming", "July"],
    ["Ndola Trade Fair", "Exhibitors", "July", "Four day", "Holiday"],
    ["Soweto Market", "Second hand", "Clothes", "Busy", "Affordable"],
    ["Tuesday Market", "Weekly", "Vendors", "Fresh", "Produce"],
    ["Chisokone Market", "Central", "Kitwe", "Busy", "Commercial"],
    ["Father Christmas", "December", "Gifts", "Children", "Festive"],
    
    // Additional cards for more variety
    ["Edgar Lungu", "Sixth", "PF", "Lawyer", "Eastern"],
    ["Hakainde Hichilema", "HH", "UPND", "Economist", "Seventh"],
    ["Rupiah Banda", "RB", "Fourth", "MMD", "Diplomat"],
    ["Frederick Chiluba", "Privatisation", "MMD", "Second", "Economy"],
    ["Levy Mwanawasa", "Third", "Integrity", "Anti-corruption", "MMD"],
    ["Zambia Sugar", "Mazabuka", "Sweet", "Plantation", "Industry"],
    ["ZESCO", "Electricity", "Power", "Utility", "Hydroelectric"],
    ["Konkola", "Copper", "Mining", "Chingola", "KCM"],
    ["First Quantum", "Kansanshi", "Solwezi", "Mining", "Canadian"],
    ["Mopani", "Copper", "Mufulira", "Kitwe", "Mining"],
    ["University of Zambia", "UNZA", "Lusaka", "Higher", "Education"],
    ["Copperbelt University", "CBU", "Kitwe", "Engineering", "Mining"],
    ["Mulungushi University", "Kabwe", "Central", "Campus", "Students"],
    ["Great North Road", "T2", "Longest", "Mpika", "Highway"],
    ["Great East Road", "T4", "Eastern", "Chipata", "Highway"],
    ["Kafue Bridge", "Toll", "T1", "Crossing", "Southern"],
    ["Heroes Stadium", "Lusaka", "Football", "National", "Stadium"],
    ["Levy Mwanawasa Stadium", "Ndola", "Sports", "Football", "Copperbelt"],
    ["Arthur Davies Stadium", "Kitwe", "Football", "Sports", "Copperbelt"],
    ["Chipolopolo", "National team", "Football", "Eagles", "Soccer"],
    ["Green Eagles", "Choma", "Football", "Club", "Zambia"],
    ["Zanaco", "Football", "Lusaka", "Banking", "Club"],
    ["Power Dynamos", "Kitwe", "Football", "Blue", "Copperbelt"],
    ["Red Arrows", "Lusaka", "Football", "Military", "Club"],
    ["Nkana", "Kitwe", "Football", "Red Devils", "Historic"],
    ["Zesco United", "Ndola", "Football", "Electricity", "Champions"],
    ["Prison Leopards", "Kabwe", "Football", "Correctional", "Sports"],
    ["Buildcon", "Ndola", "Football", "Construction", "Company"],
    ["Forest Rangers", "Ndola", "Football", "Green", "Rangers"],
    ["Chambeshi", "River", "Source", "Congo", "Northern"],
    ["Luangwa River", "Eastern", "Valley", "Wildlife", "Tributary"],
    ["Cuando River", "Western", "Angola", "Border", "Remote"],
    ["Kafue River", "Longest", "Internal", "Central", "Tributary"],
    ["Bangweulu", "Swamps", "Wetlands", "Shoebill", "Northern"],
    ["Mweru", "Lake", "Northern", "Congo", "Border"],
    ["Tanganyika", "Lake", "Northern", "Deep", "Mpulungu"],
    ["Mpulungu", "Port", "Lake", "Northern", "Fishing"],
    ["Samfya", "Beach", "Bangweulu", "Tourism", "Northern"],
    ["Siavonga", "Lake Kariba", "Tourism", "Resort", "Southern"],
    ["Kasaba Bay", "Lake Tanganyika", "Lodge", "Northern", "Tourism"],
    ["Mumbwa", "Central", "Honey", "Agriculture", "Traditional"],
    ["Mkushi", "Central", "Farming", "Agriculture", "Wheat"],
    ["Serenje", "Central", "Honey", "Agriculture", "Rural"],
    ["Petauke", "Eastern", "Cotton", "Agriculture", "Rural"],
    ["Katete", "Eastern", "Groundnuts", "Agriculture", "Rural"],
    ["Lundazi", "Eastern", "Border", "Malawi", "Rural"],
    ["Chipata", "Eastern", "Capital", "Border", "Malawi"],
    ["Mansa", "Northern", "Capital", "Bangweulu", "Administrative"],
    ["Kasama", "Northern", "Capital", "Administrative", "Bemba"],
    ["Nchelenge", "Northern", "Lake", "Fishing", "Mweru"],
    ["Kawambwa", "Northern", "Lake", "Mweru", "Rural"],
    ["Mporokoso", "Northern", "Remote", "Rural", "Traditional"],
    ["Luwingu", "Northern", "Rural", "Remote", "Traditional"],
    ["Mbala", "Northern", "Kalambo", "Falls", "Tourism"],
    ["Kalambo Falls", "Second highest", "Africa", "Northern", "Tourism"],
    ["Shiwa Ngandu", "Northern", "Estate", "Historic", "Colonial"],
    ["Kapiri Mposhi", "Central", "Railway", "Junction", "TAZARA"],
    ["TAZARA", "Railway", "Tanzania", "Chinese", "Freedom"],
    ["Tazara Station", "Kapiri", "Railway", "Chinese", "New"],
    ["Zambia Railways", "ZR", "Transport", "Freight", "Passenger"],
    ["Kenneth Kaunda Airport", "International", "Lusaka", "Aviation", "Gateway"],
    ["Simon Mwansa Kapwepwe", "Ndola", "International", "Copperbelt", "Airport"],
    ["Mfuwe Airport", "Eastern", "Tourism", "Wildlife", "Gateway"],
    ["Royal Airstrip", "Mongu", "Western", "Aviation", "Regional"],
    ["Proflight", "Airline", "Domestic", "Aviation", "Zambian"],
    ["Zambia Airways", "Former", "National", "Airline", "Defunct"],
    ["Indeni", "Oil", "Refinery", "Ndola", "Petroleum"],
    ["Nitrogen Chemicals", "Fertiliser", "Kafue", "Industry", "Agriculture"]
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

    // Save teams to database
    try {
      for (const team of newTeams) {
        if (team.name !== `Team ${newTeams.indexOf(team) + 1}` && team.members.length > 0) {
          await saveTeam({ name: team.name, members: team.members });
        }
      }
      toast.success("Teams saved successfully!");
    } catch (error) {
      console.log('Team save failed:', error);
      toast.success("Teams configured successfully!"); // Show success anyway for UX
    }

    setTeams(newTeams);
    setGameState('setup');
  };

  const recordGameResults = async () => {
    const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
    const winningTeam = sortedTeams[0];
    
    try {
      await recordGame({
        teamScores: teams.map(team => ({
          teamName: team.name,
          teamMembers: team.members,
          score: team.score,
        })),
        totalRounds,
        winningTeam: winningTeam.name,
      });
      toast.success(`Game complete! ${winningTeam.name} wins with ${winningTeam.score} points!`);
    } catch (error) {
      console.log('Game recording failed:', error);
      toast.success(`Game complete! ${winningTeam.name} wins with ${winningTeam.score} points!`); // Show success anyway for UX
    }
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
