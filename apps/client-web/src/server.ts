import { inject } from '@angular/core';
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import { API_URL } from '@e-commerce/client-web/shared/app-config';
import { Book } from '@e-commerce/shared/api-models';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SitemapStream, streamToPromise } from 'sitemap';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/**', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

app.use('/robots.txt', (req, res) => {
  res.sendFile(`${browserDistFolder}/robots.txt`);
});

app.use('/sitemap.xml', async (req, res) => {
  const sitemap = new SitemapStream({ hostname: 'https://localhost:4200' });

  res.header('Content-Type', 'application/xml');

  sitemap.write({ url: '/', priority: 1.0 });
  sitemap.write({ url: '/browse', priority: 0.8 });

  const books: Book[] = await fetch(`http://localhost:3000/books`)
    .then((response) => response.json())
    .then((books) => books.items);

  books.forEach((book) => {
    sitemap.write({
      url: `/browse/${book.id}`,
      changefreq: 'weekly',
      priority: 0.7,
    });
  });

  sitemap.end();
  streamToPromise(sitemap).then((sm) => res.send(sm.toString()));
});

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * The request handler used by the Angular CLI (dev-server and during build).
 */
export const reqHandler = createNodeRequestHandler(app);
