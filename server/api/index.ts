import express from 'express';
import rateLimit from 'express-rate-limit';

import { ANIME } from "@consumet/extensions"

const app = express();
const port = process.env.PORT || 3001;

const provider = new ANIME.Gogoanime();

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: 'Too many requests'
});

app.use(limiter);

app.get("/api", (req, res) => res.send("Express on Vercel"));

// SEARCH
app.get('/api/search/:query/page/:pageNumber', limiter, async (req, res, next) => {
  try {
    const response = await provider.search(req.params.query, Number(req.params.pageNumber));
    const data = response;
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// ANIME INFO
app.get('/api/anime/:animeId', limiter, async (req, res, next) => {
  try {
    const response = await provider.fetchAnimeInfo(req.params.animeId);
    const data = response;
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// EPISODE
app.get('/api/episode/:episodeId', limiter, async (req, res, next) => {
  try {
    const response = await provider.fetchEpisodeSources(req.params.episodeId);
    const data = response;
    res.json(data);
  } catch (error) {
    next(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;