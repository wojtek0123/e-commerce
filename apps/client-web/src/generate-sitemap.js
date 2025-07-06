const fs = require('fs');
const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');

(async () => {
  const sitemap = new SitemapStream({ hostname: 'https://yourdomain.com' });

  const writeStream = createWriteStream('dist/browser/sitemap.xml');
  sitemap.pipe(writeStream);

  // Example static pages
  sitemap.write({ url: '/', priority: 1.0 });
  sitemap.write({ url: '/about', priority: 0.8 });

  // Simulate fetching dynamic product/book URLs from JSON or DB
  const products = [{ slug: 'book-1' }, { slug: 'book-2' }, { slug: 'book-3' }];

  products.forEach((product) => {
    sitemap.write({
      url: `/product/${product.slug}`,
      changefreq: 'weekly',
      priority: 0.7,
    });
  });

  sitemap.end();

  await streamToPromise(writeStream);
  console.log('✅ Sitemap generated');
})();
