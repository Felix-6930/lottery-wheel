interface ProbabilityTableProps {
  prizes: { name: string; probability: number; color: string }[];
}

export default function ProbabilityTable({ prizes }: ProbabilityTableProps) {
  return (
    <div className="w-full max-w-md mx-auto mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
      <h3 className="text-xl font-bold text-center text-yellow-400 mb-4">奖品概率表</h3>
      <div className="space-y-3">
        {prizes.map((prize) => (
          <div key={prize.name} className="flex items-center gap-4">
            <div 
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: prize.color }}
            ></div>
            <span className="flex-1 text-white font-medium">{prize.name}</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-600 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${prize.probability * 100}%`,
                    backgroundColor: prize.color 
                  }}
                ></div>
              </div>
              <span className="text-yellow-400 font-bold w-12 text-right">
                {(prize.probability * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}