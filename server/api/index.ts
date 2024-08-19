import express from 'express';
import rateLimit from 'express-rate-limit';

import { ANIME } from "@consumet/extensions"
import { collNames, dbName, connectToDatabase } from './atlasConfig';

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

// SEARCH v2
app.get('/api/searchV2', async (req, res) => {
  const { query, subOrDub } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  const queryTerms = String(query)
    .split(' ')
    .filter(term => term);

  const fields = ["title", "otherNames"];

  const textQueries = queryTerms.map((term) => ({
    text: {
      query: term,
      path: fields,
      score: { constant: { value: 1 } },
    }
  }));

  const autocompleteQueries = fields.map((field) => ({
    autocomplete: {
      query: query,
      path: field,
      score: { constant: { value: 1 } }
    }
  }));

  try {
    const db = await connectToDatabase()
    const collection = db.collection(collNames.animeDetails);

    const searchResults = await collection.aggregate([
      {
        $search: {
          index: 'AnimeDetailsIndex',
          compound: {
            must: [
              {
                autocomplete: {
                  query: subOrDub,
                  path: "subOrDub"
                }
              },
            ],
            should: [
              ...textQueries,
              ...autocompleteQueries
            ],
            minimumShouldMatch: 1
          },
        },
      },
      { $limit: 15 },
    ]).toArray();

    res.status(200).json(searchResults);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' });
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