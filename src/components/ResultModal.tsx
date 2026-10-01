interface ResultModalProps {
  isOpen: boolean;
  prize: string;
  onClose: () => void;
  onRetry: () => void;
}

export default function ResultModal({ isOpen, prize, onClose, onRetry }: ResultModalProps) {
  if (!isOpen) return null;

  const isRetry = prize === '再来一次';

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="modal-enter bg-gradient-to-br from-yellow-500 to-orange-500 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
        <div className="text-6xl mb-4">{isRetry ? '🔄' : '🎉'}</div>
        <h2 className="text-2xl font-bold text-white mb-2">
          {isRetry ? '恭喜！再来一次！' : '恭喜中奖！'}
        </h2>
        <p className="text-xl text-white/90 mb-6">
          {isRetry ? '您可以再次抽奖！' : `您获得了：${prize}`}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-full font-medium transition-colors"
          >
            关闭
          </button>
          {isRetry && (
            <button
              onClick={onRetry}
              className="px-6 py-3 bg-white text-orange-500 rounded-full font-bold hover:bg-gray-100 transition-colors"
            >
              立即重抽
            </button>
          )}
        </div>
      </div>
    </div>
  );
}