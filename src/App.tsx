import { useState, useEffect, useRef } from 'react';
import LotteryWheel from './components/LotteryWheel';
import ProbabilityTable from './components/ProbabilityTable';
import ResultModal from './components/ResultModal';
import { prizes } from './prizes';

interface LotteryRecord {
  id: number;
  username: string;
  phone: string;
  prize: string;
  created_at: string;
}

export default function App() {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [resultPrize, setResultPrize] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [records, setRecords] = useState<LotteryRecord[]>([]);
  const [error, setError] = useState('');
  const spinTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetchRecords();
    return () => {
      if (spinTimerRef.current) clearTimeout(spinTimerRef.current);
    };
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await fetch('/api/records');
      const data = await response.json();
      if (data.success) {
        setRecords(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch records:', err);
    }
  };

  const handleSpin = async () => {
    if (isSpinning) return;
    if (!username.trim()) {
      setError('请输入用户名');
      return;
    }
    if (!phone.trim()) {
      setError('请输入手机号');
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      setError('请输入有效的手机号');
      return;
    }

    setError('');
    setIsSpinning(true);
    setResultPrize(null);

    try {
      const response = await fetch('/api/lottery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), phone: phone.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setResultPrize(data.prize);
        fetchRecords();
        spinTimerRef.current = setTimeout(() => {
          setShowModal(true);
        }, 4000);
      } else {
        setError(data.message);
        setIsSpinning(false);
      }
    } catch (err) {
      setError('抽奖失败，请重试');
      setIsSpinning(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsSpinning(false);
    setResultPrize(null);
  };

  const handleRetry = () => {
    setShowModal(false);
    setIsSpinning(false);
    setResultPrize(null);
    if (spinTimerRef.current) {
      clearTimeout(spinTimerRef.current);
      spinTimerRef.current = null;
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 bg-clip-text text-transparent">
          🎊 超级大奖等你来拿 🎊
        </h1>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-xl border border-white/20">
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-white/80 text-sm mb-2">用户名</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="请输入您的姓名"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-yellow-400 transition-colors"
                  disabled={isSpinning}
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm mb-2">手机号</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="请输入您的手机号"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-yellow-400 transition-colors"
                  disabled={isSpinning}
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-center mb-4">{error}</p>
            )}

            <LotteryWheel
              isSpinning={isSpinning}
              resultPrize={resultPrize}
            />

            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className={`mt-8 w-full py-4 rounded-xl text-xl font-bold text-white transition-all transform ${
                isSpinning
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 hover:scale-105 hover:shadow-lg active:scale-95'
              }`}
            >
              {isSpinning ? '抽奖中...' : '🎯 点击开抽'}
            </button>
          </div>

          <ProbabilityTable prizes={prizes} />

          <div className="w-full max-w-md mx-auto mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
            <h3 className="text-xl font-bold text-center text-yellow-400 mb-4">🎁 最新抽奖记录</h3>
            <div className="max-h-48 overflow-y-auto scrollbar-hide space-y-2">
              {records.length === 0 ? (
                <p className="text-white/60 text-center">暂无抽奖记录</p>
              ) : (
                records.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between bg-white/10 rounded-lg px-4 py-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                        {record.username.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{record.username}</p>
                        <p className="text-white/60 text-xs">{record.phone}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-yellow-400 font-bold text-sm">{record.prize}</p>
                      <p className="text-white/60 text-xs">
                        {new Date(record.created_at).toLocaleTimeString('zh-CN')}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <p className="text-center text-white/40 text-sm mt-6">
          本次活动最终解释权归主办方所有
        </p>
      </div>

      <ResultModal
        isOpen={showModal}
        prize={resultPrize || ''}
        onClose={handleCloseModal}
        onRetry={handleRetry}
      />
    </div>
  );
}
