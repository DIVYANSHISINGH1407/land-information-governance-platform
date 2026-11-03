import cors from 'cors';
import 'dotenv/config';
import express from 'express';

const app = express();
const port = process.env.PORT || 5000;
const frontendOrigin =
  process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: frontendOrigin }));
app.use(express.json());

app.listen(port, () => {
  console.log(`BhoomiSetu backend listening on port ${port}`);
});
