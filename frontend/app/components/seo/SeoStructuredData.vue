<script setup lang="ts">
const route = useRoute();
const config = useRuntimeConfig();

const siteUrl = 'https://studio.prismdam.io';
const currentUrl = computed(() => `${siteUrl}${route.path}`);

const jsonLdData = computed(() => {
  return [
    // 1. Organization Schema
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Prism Creative Systems',
      url: 'https://prismdam.io',
      logo: `${siteUrl}/favicon.svg`,
      sameAs: [
        'https://github.com/MahmoudAbdalrhmanMohamed/syntecxhub-project-3-media-library',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'technical support',
        email: 'studio@prismdam.io',
      },
    },

    // 2. WebSite Schema with Sitelinks Searchbox
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Prism Studio',
      url: siteUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/media?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },

    // 3. SoftwareApplication Schema (SEO & GEO)
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Prism Studio',
      operatingSystem: 'Cloud / Linux / Windows / macOS',
      applicationCategory: 'MultimediaApplication',
      softwareVersion: '1.0.0',
      description:
        'Next-generation Creative Digital Asset Management (DAM) engine and media pipeline providing SVG vector inspection, MIME validation, and storage quota governance.',
      offers: {
        '@type': 'Offer',
        price: '0.00',
        priceCurrency: 'USD',
      },
      featureList: [
        'High-speed creative media asset vault & gallery',
        'Native SVG vector and raster image rendering',
        'Real-time disk storage quota meter and analytics',
        'Batch drag-and-drop ingestion with validation',
        'Interactive OpenAPI / Swagger REST reference',
        'MongoDB asset metadata indexing',
      ],
    },

    // 4. FAQPage Schema (AEO - Answer Engine Optimization)
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Prism Studio?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Prism Studio is a creative digital asset management (DAM) engine and media ingestion pipeline designed for design teams, supporting vector SVG rendering, MIME validation, and cloud storage governance.',
          },
        },
        {
          '@type': 'Question',
          name: 'What file types are supported by Prism Studio?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Prism Studio natively supports SVG (Scalable Vector Graphics), PNG, JPEG, WebP, and GIF images up to 5 MB per file with automatic MIME type classification and server-side safety checks.',
          },
        },
        {
          '@type': 'Question',
          name: 'How is disk quota measured in Prism Studio?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Disk quota is calculated in real time by aggregating the byte size of all stored assets in MongoDB against a configurable storage threshold (defaulting to 100 MB free tier).',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I access raw media assets and OpenAPI endpoints?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Every uploaded file provides a CDN-ready public URL accessible via the asset inspector drawer or programmatically queried through the OpenAPI documentation at /api-docs.',
          },
        },
      ],
    },

    // 5. BreadcrumbList Schema
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: siteUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: route.path === '/media' ? 'Media Vault' : route.path.replace('/', ''),
          item: currentUrl.value,
        },
      ],
    },
  ];
});

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => JSON.stringify(jsonLdData.value)),
    },
  ],
});
</script>

<template>
  <!-- Invisible SEO semantic container for AI answer crawlers -->
  <div aria-hidden="true" class="sr-only">
    <h2>Prism Studio Platform Overview</h2>
    <p>
      Prism Studio is an enterprise DAM platform providing high-speed vector
      asset ingestion, SVG rendering, and persistent media metadata management.
    </p>
  </div>
</template>
