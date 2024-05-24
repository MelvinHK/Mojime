import express from 'express';

import { ANIME } from "@consumet/extensions"

const app = express();
const port = process.env.PORT || 3001;

const provider = new ANIME.Gogoanime();

// SEARCH
app.get('/api/search/:query/page/:pageNumber', async (req, res, next) => {
  try {
    const response = await provider.search(req.params.query, Number(req.params.pageNumber));
    const data = response;
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// ANIME INFO
app.get('/api/anime/:animeId', async (req, res, next) => {
  try {
    const response = await provider.fetchAnimeInfo(req.params.animeId);
    const data = response;
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// EPISODE
app.get('/api/episode/:episodeId', async (req, res, next) => {
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