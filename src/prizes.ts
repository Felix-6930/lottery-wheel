export interface Prize {
  name: string;
  probability: number;
  color: string;
  textColor: string;
}

export const prizes: Prize[] = [
  { name: '随机奖', probability: 0.30, color: '#FFD700', textColor: '#000' },
  { name: '一部手机', probability: 0.05, color: '#FF6347', textColor: '#fff' },
  { name: '一台平板', probability: 0.05, color: '#9370DB', textColor: '#fff' },
  { name: '一台拯救者电脑', probability: 0.02, color: '#20B2AA', textColor: '#fff' },
  { name: '再来一次', probability: 0.20, color: '#FFA500', textColor: '#000' },
  { name: '安慰奖', probability: 0.38, color: '#87CEEB', textColor: '#000' },
];
