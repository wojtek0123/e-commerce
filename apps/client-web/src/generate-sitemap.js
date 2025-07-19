const fs = require('fs');
const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const { url } = require('inspector');

(async () => {
  const sitemap = new SitemapStream({
    hostname: 'https://storystash.vercel.app',
  });

  const writeStream = createWriteStream('dist/browser/sitemap.xml');

  sitemap.pipe(writeStream);

  sitemap.write({ url: '/', priority: 1.0 });
  sitemap.write({ url: '/about', priority: 0.8 });
  sitemap.write({ url: '/browse/books', priority: 1.0 });

  sitemap.write({ url: '/cart/order-process', priority: 0.3 });
  sitemap.write({ url: '/cart/order-summary', priority: 0.3 });
  sitemap.write({ url: '/cart/payment-status', priority: 0.3 });

  sitemap.write({ url: '/account/favourite-books-list', priority: 0.5 });
  sitemap.write({ url: '/account/information', priority: 0.5 });
  sitemap.write({ url: '/account/orders', priority: 0.5 });

  const books = await fetch('https://e-commerce-api-usdu.onrender.com/books')
    .then((response) => response.json())
    .then((res) => res.items);

  books.forEach((book) => {
    sitemap.write({
      url: `/browse/book/${book.id}`,
      priority: 0.8,
    });
  });

  sitemap.end();

  await streamToPromise(writeStream);
  console.log('✅ Sitemap generated');
})();
