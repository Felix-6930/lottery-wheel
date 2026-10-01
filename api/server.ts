import express from 'express';
import cors from 'cors';
import { initDatabase } from './db';
import lotteryRoutes from './routes/lottery';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/api', lotteryRoutes);

app.get('/', (req, res) => {
  res.send('Lottery API Server');
});

async function startServer() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();