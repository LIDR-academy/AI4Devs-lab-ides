import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import candidatesRouter from './routes/candidates';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/candidates', candidatesRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
