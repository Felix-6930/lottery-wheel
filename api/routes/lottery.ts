import express from 'express';
import pool from '../db';

const router = express.Router();

const prizes = [
  { name: '随机奖', probability: 0.30, angle: 0 },
  { name: '一部手机', probability: 0.05, angle: 60 },
  { name: '一台平板', probability: 0.05, angle: 120 },
  { name: '一台拯救者电脑', probability: 0.02, angle: 180 },
  { name: '再来一次', probability: 0.20, angle: 240 },
  { name: '安慰奖', probability: 0.38, angle: 300 },
];

function drawPrize(): string {
  const random = Math.random();
  let cumulative = 0;
  for (const prize of prizes) {
    cumulative += prize.probability;
    if (random < cumulative) {
      return prize.name;
    }
  }
  return '安慰奖';
}

router.post('/lottery', async (req, res) => {
  try {
    const { username, phone } = req.body;
    
    if (!username || !phone) {
      return res.status(400).json({ success: false, message: '请输入用户名和手机号' });
    }
    
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ success: false, message: '请输入有效的手机号' });
    }
    
    const prize = drawPrize();
    
    const [result] = await pool.execute(
      'INSERT INTO lottery_records (username, phone, prize) VALUES (?, ?, ?)',
      [username, phone, prize]
    );
    
    console.log(`Lottery record created: ${username}, ${phone}, ${prize}`);
    
    res.json({ 
      success: true, 
      prize, 
      message: prize === '再来一次' ? '恭喜！您获得了再来一次的机会！' : `恭喜！您获得了${prize}！` 
    });
  } catch (error) {
    console.error('Lottery error:', error);
    res.status(500).json({ success: false, message: '抽奖失败，请重试' });
  }
});

router.get('/records', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, username, phone, prize, created_at FROM lottery_records ORDER BY created_at DESC LIMIT 100'
    );
    
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Get records error:', error);
    res.status(500).json({ success: false, message: '获取记录失败' });
  }
});

router.get('/prizes', async (req, res) => {
  res.json({ success: true, data: prizes });
});

export default router;