// ============================================
// Netlify Serverless Function - Geocoding Proxy
// ============================================
//
// This function proxies geocoding requests to Nominatim API
// to avoid CORS issues and API blocking in the browser.
//
// Endpoint: /.netlify/functions/geocode?q=address
// Returns: JSON with geocoding results

const fetch = require('node-fetch');

// Simple in-memory cache (resets on cold start)
const cache = new Map();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Rate limiting: track last request time
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second between requests

exports.handler = async (event, context) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Get address from query parameters
  const address = event.queryStringParameters?.q;

  if (!address) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Missing query parameter: q' })
    };
  }

  // Check cache first
  const cacheKey = address.toLowerCase().trim();
  const cached = cache.get(cacheKey);

  if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
    console.log('Cache HIT:', cacheKey);
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=86400' // 24 hours
      },
      body: JSON.stringify(cached.data)
    };
  }

  // Rate limiting: ensure minimum interval between requests
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }

  lastRequestTime = Date.now();

  // Make request to Nominatim
  try {
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address + ', Rio de Janeiro, RJ, Brazil')}&format=json&limit=1&addressdetails=1`;

    console.log('Geocoding request:', address);

    const response = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'LeCard-Mapper/1.0 (Netlify Serverless Function; +https://github.com/gianimpronta/lecard)',
        'Accept': 'application/json',
        'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8'
      }
    });

    if (!response.ok) {
      console.error('Nominatim error:', response.status, response.statusText);
      return {
        statusCode: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          error: 'Geocoding service error',
          status: response.status,
          message: response.statusText
        })
      };
    }

    const data = await response.json();

    // Store in cache
    cache.set(cacheKey, {
      data: data,
      timestamp: Date.now()
    });

    // Limit cache size (prevent memory issues)
    if (cache.size > 1000) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    console.log('Geocoding success:', address, '- Results:', data.length);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=86400' // 24 hours
      },
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error('Geocoding error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};
