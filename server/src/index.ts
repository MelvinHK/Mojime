import express from 'express';

import { ANIME } from "@consumet/extensions"

const app = express();
const port = process.env.PORT || 3001;

const provider = new ANIME.Gogoanime();

app.get('/api/episode/:episodeId', async (req, res) => {
  try {
    const response = await provider.fetchEpisodeSources(req.params.episodeId);
    const data = response;
    res.json(data);
  } catch (error) {
    throw error;
  }
});

app.get('/api/search/:query/page/:pageNumber', async (req, res) => {
  try {
    const response = await provider.search(req.params.query, Number(req.params.pageNumber));
    const data = response;
    res.json(data);
  } catch (error) {
    throw error;
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});