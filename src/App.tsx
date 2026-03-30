import React, { useState, useRef, useEffect } from 'react';
import { Home, Play, Trophy, Camera, CheckCircle2, HeartHandshake, Zap, Award, VideoOff } from 'lucide-react';

// --- Types & Interfaces ---
interface SignPrompt {
  id: number;
  word: string;
  hint: string;
  image: string;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
}

// --- Mock Data (Should be fetched from Backend in the future: GET /api/prompts) ---
const SIGN_PROMPTS: SignPrompt[] = [
  { id: 1, word: 'สวัสดี (Hello)', hint: 'ยกมือขึ้นระดับอกแล้วโบกเบาๆ', image: '👋' },
  { id: 2, word: 'ขอบคุณ (Thank You)', hint: 'แตะมือที่คางแล้วผายมือออกไปด้านหน้า', image: '🙏' },
  { id: 3, word: 'รัก (Love)', hint: 'ทำมือเป็นรูปไอเลิฟยู (ชูนิ้วโป้ง ชี้ ก้อย)', image: '🤟' },
  { id: 4, word: 'โอเค (OK)', hint: 'ทำนิ้วโป้งและนิ้วชี้ติดกันเป็นวงกลม', image: '👌' },
];

// --- Mock Data (Should be fetched from Backend in the future: GET /api/leaderboard) ---
const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'Somsak P.', score: 1250 },
  { rank: 2, name: 'Malee W.', score: 980 },
  { rank: 3, name: 'John D.', score: 850 },
  { rank: 4, name: 'Anna K.', score: 720 },
  { rank: 5, name: 'Piti T.', score: 610 },
];

type PageState = 'home' | 'game' | 'rank';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageState>('home');

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => setCurrentPage('home')}>
              <HeartHandshake className="h-8 w-8 text-indigo-600 mr-2" />
              <span className="font-bold text-xl text-indigo-900 tracking-tight">SignBridge</span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setCurrentPage('home')}
                className={`p-2 rounded-md transition-colors ${currentPage === 'home' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50'}`}
              >
                <Home className="h-5 w-5" />
              </button>
              <button 
                onClick={() => setCurrentPage('rank')}
                className={`p-2 rounded-md transition-colors ${currentPage === 'rank' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50'}`}
              >
                <Trophy className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'home' && <HomeView onPlay={() => setCurrentPage('game')} onRank={() => setCurrentPage('rank')} />}
        {currentPage === 'game' && <GameView onQuit={() => setCurrentPage('home')} />}
        {currentPage === 'rank' && <LeaderboardView />}
      </main>
    </div>
  );
}

// --- Views ---

interface HomeViewProps {
  onPlay: () => void;
  onRank: () => void;
}

function HomeView({ onPlay, onRank }: HomeViewProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Section */}
      <div className="text-center max-w-2xl space-y-6 mt-8">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium mb-4">
          <Zap className="h-4 w-4 mr-1 text-indigo-600" /> Interactive Learning
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          เชื่อมโลกการสื่อสาร<br />ด้วย<span className="text-indigo-600">ภาษามือ</span>
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          เรียนรู้และฝึกฝนภาษามือผ่านเกมแบบโต้ตอบ โดยส่งภาพจากกล้องไปประมวลผลที่ระบบเซิร์ฟเวอร์แบบเรียลไทม์ มาร่วมกันลดช่องว่างการสื่อสารและสร้างสังคมที่ทุกคนเข้าถึงได้
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <button 
          onClick={onPlay}
          className="flex items-center justify-center px-8 py-4 text-lg font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
        >
          <Play className="h-6 w-6 mr-2 fill-current" />
          เริ่มเล่นเกม
        </button>
        <button 
          onClick={onRank}
          className="flex items-center justify-center px-8 py-4 text-lg font-bold rounded-xl text-indigo-700 bg-white border-2 border-indigo-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm"
        >
          <Trophy className="h-6 w-6 mr-2" />
          ดูอันดับคะแนน
        </button>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-12">
        <FeatureCard icon={<Camera />} title="วิเคราะห์ผลเรียลไทม์" desc="ส่งภาพไปยัง Backend Server เพื่อตรวจจับความถูกต้องของท่าทางมืออย่างแม่นยำ" />
        <FeatureCard icon={<Award />} title="สะสมคะแนน" desc="เปลี่ยนการเรียนรู้ให้สนุกขึ้นด้วยระบบท้าทายและเก็บคะแนน" />
        <FeatureCard icon={<HeartHandshake />} title="สร้างความเข้าใจ" desc="ช่วยลดกำแพงการสื่อสารระหว่างคนหูหนวกและคนทั่วไป" />
      </div>
    </div>
  );
}

interface GameViewProps {
  onQuit: () => void;
}

type GameState = 'playing' | 'success' | 'timeout' | 'completed';

function GameView({ onQuit }: GameViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<boolean>(false);
  
  // Game State
  const [currentPromptIndex, setCurrentPromptIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60); // Added time for AI processing
  const [gameState, setGameState] = useState<GameState>('playing');
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');
  const [detectedWord, setDetectedWord] = useState<string>('กำลังรอรับภาพ...');

  const currentPrompt = SIGN_PROMPTS[currentPromptIndex];

  // Initialize Camera
  useEffect(() => {
    async function setupCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(mediaStream);
        setCameraError(false);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.warn("Error accessing camera:", err);
        setCameraError(true);
      }
    }
    setupCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Timer logic
  useEffect(() => {
    if (gameState !== 'playing' || timeLeft <= 0) return;
    
    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState('timeout');
          // When time is up, should call API to save score (POST /api/score)
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, gameState]);

  // --- MOCK API CALL TO BACKEND ---
  // This function is used to mock sending the image to the Backend for verification
  // In actual implementation, the Backend will receive the Base64 image and call the Gemini API
  const verifyGestureWithBackend = async (base64Image: string, targetWord: string): Promise<string> => {
    /* ** Example of actual code when Backend is ready: **
    
    try {
      const response = await fetch('http://localhost:3000/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image, word: targetWord })
      });
      const data = await response.json();
      return data.result; // Assuming Backend returns 'YES' or 'other guessed words'
    } catch (err) {
      console.error(err);
      return "Server error...";
    }
    */

    // --- Backend simulation part ---
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate a 20% chance that the AI on the Backend guesses correctly (to allow passing the level)
        const isCorrect = Math.random() > 0.8; 
        if (isCorrect) {
          resolve('YES');
        } else {
          // Randomly pick a wrong guess to simulate an incorrect gesture
          const mockGuesses = ['กำลังขยับมือ', 'ชูสองนิ้ว', 'กำหมัด', 'ไม่เห็นมือ', 'แบมือ'];
          resolve(mockGuesses[Math.floor(Math.random() * mockGuesses.length)]);
        }
      }, 1000); // Simulate Network latency and Backend processing time
    });
  };

  // Real-time Frame Capture Loop (Continuously send images to Backend)
  useEffect(() => {
    if (gameState !== 'playing' || cameraError) return;

    let isChecking = false;

    const intervalId = setInterval(async () => {
      // Prevent overlapping API calls if the previous one hasn't finished
      if (isChecking || !videoRef.current || !canvasRef.current || videoRef.current.readyState !== 4) return;
      isChecking = true;
      setDetectedWord('กำลังส่งภาพไป Backend...');

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Frontend's role is to capture the video frame onto the Canvas
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert image to Base64 (Reduce quality to minimize file size before HTTP request)
        const base64Image = canvas.toDataURL('image/jpeg', 0.6);

        // Send data (image + expected word) to Backend for verification
        const result = await verifyGestureWithBackend(base64Image, currentPrompt.word);

        if (result === 'YES') {
          setDetectedWord(currentPrompt.word);
          handleSuccess();
        } else {
          setDetectedWord(result);
        }
      }
      isChecking = false;
    }, 2500); // Send frame to Backend every 2.5 seconds

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, currentPrompt, cameraError]);

  const handleSuccess = () => {
    setGameState('success');
    setScore(s => s + 50);
    setFeedbackMsg('เยี่ยมมาก! ท่าทางถูกต้อง');
    
    setTimeout(() => {
      if (currentPromptIndex + 1 < SIGN_PROMPTS.length) {
        setCurrentPromptIndex((prev) => prev + 1);
        setGameState('playing');
        setTimeLeft(60); 
        setDetectedWord('กำลังรอรับภาพ...');
      } else {
        setGameState('completed');
        // When the game ends, should call API to save score (POST /api/score)
      }
    }, 2000);
  };

  const handleRestart = () => {
    setScore(0);
    setTimeLeft(60);
    setCurrentPromptIndex(0);
    setGameState('playing');
    setDetectedWord('กำลังรอรับภาพ...');
  };

  if (gameState === 'timeout' || gameState === 'completed') {
    const isVictory = gameState === 'completed';
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-in zoom-in-95 duration-500">
        {isVictory ? <Award className="h-24 w-24 text-yellow-400" /> : <Trophy className="h-24 w-24 text-slate-400" />}
        <h2 className="text-4xl font-bold text-slate-800">
          {isVictory ? 'ยินดีด้วย! คุณผ่านทุกด่านแล้ว 🎉' : 'หมดเวลา!'}
        </h2>
        <div className="text-2xl text-slate-600">คะแนนของคุณ: <span className="text-indigo-600 font-bold text-4xl">{score}</span></div>
        <p className="text-sm text-slate-400 bg-slate-100 px-4 py-2 rounded-lg">(ในระบบจริง คะแนนจะถูกส่งไปบันทึกที่ Database ของ Backend)</p>
        <div className="flex gap-4 mt-8">
          <button onClick={handleRestart} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700">เล่นอีกครั้ง</button>
          <button onClick={onQuit} className="px-6 py-3 bg-slate-200 text-slate-800 rounded-xl font-bold hover:bg-slate-300">กลับหน้าแรก</button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Game Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center space-x-2">
          <Trophy className="text-yellow-500 h-6 w-6" />
          <span className="font-bold text-xl">{score}</span>
        </div>
        <div className="text-center hidden sm:block">
          <div className="text-sm text-slate-500 font-medium">ด่านที่</div>
          <div className="font-bold text-xl text-indigo-600">{currentPromptIndex + 1} <span className="text-slate-400 text-sm">/ {SIGN_PROMPTS.length}</span></div>
        </div>
        <div className="text-center">
          <div className="text-sm text-slate-500 font-medium">เวลาที่เหลือ</div>
          <div className={`font-mono font-bold text-2xl ${timeLeft <= 10 ? 'text-red-500' : 'text-slate-800'}`}>
            00:{timeLeft.toString().padStart(2, '0')}
          </div>
        </div>
        <button onClick={onQuit} className="text-slate-400 hover:text-red-500 font-medium text-sm transition-colors">
          ออกเกม
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Target Prompt */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-indigo-100">
            <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${(timeLeft / 60) * 100}%` }} />
          </div>
          
          <div className="text-sm font-bold tracking-widest text-indigo-400 uppercase">โจทย์ของคุณ</div>
          <div className="text-8xl">{currentPrompt.image}</div>
          <h2 className="text-3xl font-bold text-slate-800">{currentPrompt.word}</h2>
          <p className="text-slate-500 bg-slate-50 p-4 rounded-xl w-full">
            💡 คำใบ้: {currentPrompt.hint}
          </p>
        </div>

        {/* Right: Camera Feed & Action */}
        <div className="space-y-4">
          <div className="relative bg-slate-900 rounded-3xl overflow-hidden aspect-video shadow-inner border-4 border-slate-800 flex items-center justify-center">
            {cameraError ? (
              <div className="text-slate-400 flex flex-col items-center p-6 text-center">
                <VideoOff className="h-12 w-12 mb-3 opacity-50" />
                <p className="font-bold text-lg text-slate-300">ไม่สามารถเข้าถึงกล้องได้</p>
                <div className="mt-2 text-sm text-indigo-400 px-4 py-2">
                  โปรดอนุญาตให้เข้าถึงกล้องเพื่อจับภาพ
                </div>
              </div>
            ) : (
              <>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover transform -scale-x-100"
                />
                {/* Hidden Canvas for Frontend to extract the video frame and encode it to Base64 before sending to Backend */}
                <canvas ref={canvasRef} className="hidden" />
              </>
            )}

            {/* Feedback Overlay */}
            {gameState === 'success' && (
              <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 z-10 backdrop-blur-sm">
                <div className="flex flex-col items-center p-6 rounded-2xl bg-white shadow-2xl animate-in zoom-in-90">
                  <CheckCircle2 className="h-16 w-16 text-green-500 mb-2" />
                  <div className="font-bold text-xl text-green-700">
                    {feedbackMsg}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* AI Real-time Scanning Box */}
          {gameState === 'playing' && !cameraError && (
            <div className="flex justify-center">
              <div className="w-full bg-white text-slate-700 px-6 py-4 rounded-2xl font-sans text-lg flex items-center justify-center shadow-sm border border-slate-200 animate-in fade-in slide-in-from-top-2">
                <div className="h-3 w-3 bg-blue-500 rounded-full animate-pulse mr-3 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                ระบบกำลังแปล: <span className="ml-3 font-bold text-indigo-600 min-w-[120px] text-left">{detectedWord}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LeaderboardView() {
  return (
    <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-8 duration-500">
      <div className="text-center mb-10">
        <div className="inline-flex justify-center items-center h-20 w-20 rounded-full bg-yellow-100 mb-4">
          <Trophy className="h-10 w-10 text-yellow-600" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900">ตารางคะแนนสูงสุด</h2>
        <p className="text-slate-500 mt-2">แข่งขันและเรียนรู้ไปพร้อมกับทุกคน</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative">
        <div className="absolute top-2 right-2 px-3 py-1 bg-slate-100 text-slate-400 text-xs rounded-full font-medium">Mock Data</div>
        <div className="divide-y divide-slate-100 mt-4">
          {MOCK_LEADERBOARD.map((user, index) => (
            <div 
              key={user.rank} 
              className={`flex items-center p-6 transition-colors hover:bg-slate-50 ${index < 3 ? 'bg-gradient-to-r from-transparent to-yellow-50/30' : ''}`}
            >
              <div className="w-12 font-bold text-2xl text-slate-400 text-center">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : user.rank}
              </div>
              
              <div className="ml-6 flex-1 flex items-center">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold mr-4">
                  {user.name.charAt(0)}
                </div>
                <span className="font-bold text-lg text-slate-800">{user.name}</span>
              </div>
              
              <div className="text-right">
                <div className="font-bold text-xl text-indigo-600">{user.score}</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Points</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Shared Components ---

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

function FeatureCard({ icon, title, desc }: FeatureCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow text-center flex flex-col items-center">
      <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-lg text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}