import express from 'express';

import { ANIME } from "@consumet/extensions"

const app = express();
const port = process.env.PORT || 3001;

const provider = new ANIME.Gogoanime();

app.get('/api/search/:query/page/:pageNumber', async (req, res, next) => {
  try {
    const response = await provider.search(req.params.query, Number(req.params.pageNumber));
    const data = response;
    res.json(data);
  } catch (error) {
    next(error);
  }
});

app.get('/api/anime/:animeId', async (req, res, next) => {
  try {
    const response = await provider.fetchAnimeInfo(req.params.animeId);
    const data = response;
    res.json(data);
  } catch (error) {
    next(error);
  }
});

app.get('/api/anime/:animeId/episode/:episodeNo', async (req, res, next) => {
  try {
    const id = `${req.params.animeId}-episode-${req.params.episodeNo}`
    const response = await provider.fetchEpisodeSources(id);
    const data = response;
    res.json(data);
  } catch (error) {
    next(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});