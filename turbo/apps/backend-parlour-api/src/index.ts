import express from 'express';

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (_, res) => {
  res.send('Backend running ✅');
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
