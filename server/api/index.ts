import express from 'express';
import rateLimit from 'express-rate-limit';

import { ANIME } from "@consumet/extensions"
import { collNames, dbName, mongoClient } from './atlasConfig';
import { MongoOIDCError } from 'mongodb';

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

app.get('/api/searchV2', async (req, res) => {
  const { query, subOrDub } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const collection = mongoClient
      .db(dbName)
      .collection(collNames.animeDetails);

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
              }
            ],
            should: [
              {
                autocomplete: {
                  query: query,
                  path: "title"
                }
              },
              {
                text: {
                  query: query,
                  path: "title",
                  score: { boost: { value: 30 } }
                }
              },
              {
                autocomplete: {
                  query: query,
                  path: "otherNames",
                }
              },
              {
                phrase: {
                  query: query,
                  path: "otherNames",
                  score: { boost: { value: 30 } }
                }
              },
              {
                text: {
                  query: query,
                  path: "otherNames",
                }
              }
            ],
            minimumShouldMatch: 1
          }
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