import { useRef, useEffect } from 'react';
import { prizes } from '../prizes';

interface LotteryWheelProps {
  isSpinning: boolean;
  resultPrize: string | null;
}

// 按概率计算每个扇形的角度信息
let cumulative = 0;
const segments = prizes.map(prize => {
  const angleDeg = prize.probability * 360;
  const startAngle = cumulative;
  const endAngle = cumulative + angleDeg;
  const centerAngle = (startAngle + endAngle) / 2;
  cumulative = endAngle;
  return { ...prize, startAngle, endAngle, centerAngle };
});

// 奖品中心角度查找表（用于旋转定位）
const prizeCenterAngles: Record<string, number> = {};
segments.forEach(s => { prizeCenterAngles[s.name] = s.centerAngle; });

// 文字距中心的半径
const TEXT_RADIUS = 95;

export default function LotteryWheel({ isSpinning, resultPrize }: LotteryWheelProps) {
  const rotationRef = useRef(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (resultPrize && wheelRef.current) {
      const prizeAngle = prizeCenterAngles[resultPrize] ?? 0;
      const extraSpins = 5;
      // 确保累积旋转后指针正确指向目标奖品中心
      const base = ((360 - prizeAngle) % 360 + 360) % 360;
      const currentMod = rotationRef.current % 360;
      const adjustment = (base - currentMod + 360) % 360;
      const targetRotation = rotationRef.current + 360 * extraSpins + adjustment;
      rotationRef.current = targetRotation;
      wheelRef.current.style.transform = `rotate(${targetRotation}deg)`;
    }
  }, [resultPrize]);

  const conicGradient = segments
    .map(s => `${s.color} ${s.startAngle}deg ${s.endAngle}deg`)
    .join(', ');

  return (
    <div className="relative w-80 h-80 md:w-96 md:h-96 mx-auto">
      {/* 外圈金色边框 */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 p-3 shadow-2xl glow-effect">
        {/* 顶部指针 - 三角形朝下指向转盘中心 */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 z-20"
          style={{
            borderLeft: '16px solid transparent',
            borderRight: '16px solid transparent',
            borderTop: '36px solid #dc2626',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
          }}
        />

        {/* 转盘本体 */}
        <div
          ref={wheelRef}
          className="relative w-full h-full rounded-full overflow-hidden"
          style={{
            background: `conic-gradient(${conicGradient})`,
            transition: isSpinning
              ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)'
              : 'none',
            transform: `rotate(${rotationRef.current}deg)`,
          }}
        >
          {/* 奖品文字 - 沿半径方向排列，底朝向转盘中心 */}
          {segments.map((segment) => {
            const { centerAngle, textColor, name } = segment;
            // conic角度→CSS角度转换（conic 0°=顶部, CSS 0°=右侧）
            const cssAngle = centerAngle - 90;
            // 上半圆(0°-180°): 文字正向排列，底朝向中心
            // 下半圆(180°-360°): 翻转180°，避免文字颠倒
            const isTopHalf = centerAngle <= 180;
            const textRotation = isTopHalf ? 0 : 180;

            return (
              <div
                key={name}
                className="absolute top-1/2 left-1/2"
                style={{
                  width: 0,
                  height: 0,
                  transform: `rotate(${cssAngle}deg) translateX(${TEXT_RADIUS}px) rotate(${textRotation}deg)`,
                }}
              >
                <span
                  className="absolute whitespace-nowrap text-xs md:text-sm font-bold"
                  style={{
                    color: textColor,
                    transform: 'translate(-50%, -50%)',
                    textShadow: textColor === '#fff'
                      ? '0 1px 2px rgba(0,0,0,0.5)'
                      : 'none',
                  }}
                >
                  {name}
                </span>
              </div>
            );
          })}

          {/* 中心圆 */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-white to-gray-100 flex items-center justify-center shadow-lg border-4 border-yellow-500 z-10">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">🎁</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
