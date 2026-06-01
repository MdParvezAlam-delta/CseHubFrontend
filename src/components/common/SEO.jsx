import React from 'react';
import { Helmet } from 'react-helmet-async';

function SEO({
  title = 'Subject Catalog',
  description = 'Browse our complete subject catalog with 28+ courses including Algorithms, Data Structures, Cloud Computing, DevOps, and more.',
  keywords = 'algorithms, data structures, cloud computing, devops, frontend development, backend systems, computer science, coding courses',
  ogType = 'website',
  canonicalUrl = 'https://yoursite.com/',
  robots = 'index, follow'
}) {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Your Site Name" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {/* Structured Data (Schema.org) */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": title,
          "description": description,
          "url": canonicalUrl,
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://yoursite.com/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Subject Catalog",
                "item": canonicalUrl
              }
            ]
          }
        })}
      </script>
    </Helmet>
  );
}

export default SEO;