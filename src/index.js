#!/usr/bin/env node
// GENERATED from the searchcode.ai customer API contract. Do not edit by hand.
// searchcode.ai MCP server — source and technology intelligence for agents.

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import * as z from 'zod/v4';
import { ApiError, callRoute, configFromEnv, hintFor } from '@searchcode/core';

const cfg = configFromEnv();

/** Everything except the named path params, which travel in the URL. */
function rest(args, exclude) {
  return Object.fromEntries(Object.entries(args).filter(([k]) => !exclude.includes(k)));
}

/** Run a tool call, turning API errors into text an agent can act on. */
async function run(fn) {
  try {
    const payload = await fn();
    return { content: [{ type: 'text', text: JSON.stringify(payload, null, 2) }] };
  } catch (error) {
    if (error instanceof ApiError) {
      const hint = hintFor(error.code);
      return {
        isError: true,
        content: [{
          type: 'text',
          text: `searchcode error ${error.status} ${error.code}: ${error.message}${hint ? ` (${hint})` : ''}`,
        }],
      };
    }
    return { isError: true, content: [{ type: 'text', text: `searchcode error: ${error.message || error}` }] };
  }
}

export const server = new McpServer({ name: 'searchcode', version: '0.1.0' });

server.tool(
  'search_source',
  "Search the raw source (HTML, inline JavaScript and CSS) of websites across the public web for a substring or regular expression. Returns matching domains ranked by popularity with an exact match count. Use it to find every site embedding a snippet, endpoint, tracking id, or library. Free tier. Costs 5 credits.",
  {
    q: z.string().describe("Source substring or bounded literal expression"),
    query_kind: z.string().optional().describe("literal or regex — regex needs Solo+"),
    content_type: z.string().optional().describe("html, js, css, json, text, or xml"),
    site: z.string().optional().describe("Restrict to one registrable domain"),
    tld: z.string().optional().describe("TLD suffix filter"),
    tech: z.string().optional().describe("Comma list; sites using ALL of these technologies"),
    category: z.string().optional().describe("Comma list; sites using ANY of these categories"),
    country: z.number().int().optional().describe("ISO country codes from hosting/ccTLD data; matches any listed country (CH = Switzerland, DE = Germany, PL = Poland)."),
    max_results: z.string().optional().describe("Raise the job's result cap past your plan's depth (Solo+; rows past the depth are priced per page when served)"),
    limit: z.number().int().optional().describe("Page size, clamped by tier result depth"),
    offset: z.number().int().optional().describe("Rank-ordered offset"),
  },
  (args) => run(() => callRoute(cfg, 'source_search_sync', { query: args })),
);

server.tool(
  'facet_count',
  "Get the exact number of sites carrying one signal, answering \"how many sites use X\". Free tier. Costs 1 credit.",
  {
    kind: z.string().describe("tech, identifier, or request_host"),
    signal: z.string().describe("Facet value to count: a technology name in any case or its slug, a request host, or an identifier value"),
    id_type: z.string().optional().describe("Identifier family, required for identifier facets"),
  },
  (args) => run(() => callRoute(cfg, 'facet_count', { query: args })),
);

server.tool(
  'tech_query',
  "List every site detected using a given technology, rank-ordered, with an exact site count. Result depth is capped by plan. Free tier. Costs 3 credits.",
  {
    name: z.string().optional().describe("Exact technology name"),
    name_slug: z.string().optional().describe("Canonical route slug"),
    category: z.string().optional().describe("Detector category slug (mutually exclusive with name)"),
    tech: z.string().optional().describe("Comma list of up to 5 further technologies (names or slugs); a site must use ALL of them in addition to the selection"),
    country: z.number().int().optional().describe("Comma-separated ISO country codes from hosting/ccTLD data; matches any listed country (CH = Switzerland, DE = Germany, PL = Poland)."),
    limit: z.number().int().optional().describe("Maximum rows"),
    offset: z.number().int().optional().describe("Rank-ordered offset for paging; rows past your plan's result depth cost overage credits on Solo+ (1 per started 100 rows), Free stops at its depth"),
  },
  (args) => run(() => callRoute(cfg, 'tech_query', { query: args })),
);

server.tool(
  'tech_lookup',
  "Get the full technology and statistics profile for one domain: detected technologies by category, page and byte counts, and sample pages. Requires the Pro plan or above. Costs 3 credits.",
  {
    domain: z.string().describe("Registrable domain to profile"),
  },
  (args) => run(() => callRoute(cfg, 'site_profile', { query: args })),
);

server.tool(
  'read_source',
  "Read the retained source of one page from a search hit, by its blob hash and content type. Use it to verify a match or read everything around it. Requires the Pro plan or above. Costs 5 credits.",
  {
    blob_hash: z.string().describe("The 64-character blob hash of a search hit"),
    content_type: z.string().describe("The hit's content type: html, js, css, json, text, or xml"),
  },
  (args) => run(() => callRoute(cfg, 'source_read', { pathParams: { blob_hash: args.blob_hash }, query: rest(args, ["blob_hash"]) })),
);

server.tool(
  'owner_graph',
  "Find every domain sharing one analytics, advertising, or tracker identifier, revealing sites run by the same operator. Requires the Pro plan or above. Costs 5 credits.",
  {
    id: z.string().describe("Tracker/ad account id to resolve"),
    id_type: z.string().describe("Identifier family: ga, ga4, gtm, adsense, fb_pixel, google_ads, hotjar, mixpanel, segment, clarity, yandex_metrica"),
    limit: z.number().int().optional().describe("Maximum domains"),
  },
  (args) => run(() => callRoute(cfg, 'owner_graph', { query: args })),
);

server.tool(
  'browse_domains',
  "Browse the ranked domain index, optionally narrowed by a name fragment, top-level domain, technology, or country. Free tier. Costs 1 credit.",
  {
    q: z.string().optional().describe("Substring of the registrable domain (3+ chars)"),
    tld: z.string().optional().describe("TLD suffix filter"),
    tech: z.string().optional().describe("Restrict to sites using this technology"),
    country: z.number().int().optional().describe("Comma-separated ISO country codes from hosting/ccTLD data; matches any listed country (CH = Switzerland, DE = Germany, PL = Poland)."),
    sort: z.string().optional().describe("Only rank is supported"),
    limit: z.number().int().optional().describe("Page size"),
    offset: z.number().int().optional().describe("Row offset into the ordered result. Honoured at any depth (never clamped), but the cost of an offset page grows with its depth; walk deep result sets with cursor instead."),
    cursor: z.string().optional().describe("Opaque next_cursor / previous_cursor from a previous page. A cursor page costs the same at any depth and takes precedence over offset. Read has_more and next_cursor to detect the end, never the page size."),
  },
  (args) => run(() => callRoute(cfg, 'domain_browse', { query: args })),
);

server.tool(
  'list_shops',
  "Browse captured e-commerce storefronts by catalog size, optionally filtered by domain fragment or country. Requires the Enterprise plan or above. Costs 1 credit.",
  {
    q: z.string().optional().describe("Case-insensitive domain substring, 3–253 characters: letters, digits, hyphens, dots, or underscores; no consecutive dots, URLs, spaces, or wildcards. Omit to browse all shops. Search product titles with /shop/products instead."),
    country: z.number().int().optional().describe("ISO country codes from hosting/ccTLD data; matches any listed country (CH = Switzerland, DE = Germany, PL = Poland)."),
    limit: z.number().int().optional().describe("Page size"),
    offset: z.number().int().optional().describe("Row offset into the ordered result. Honoured at any depth (never clamped), but the cost of an offset page grows with its depth; walk deep result sets with cursor instead."),
    cursor: z.string().optional().describe("Opaque next_cursor / previous_cursor from a previous page. A cursor page costs the same at any depth and takes precedence over offset. Read has_more and next_cursor to detect the end, never the page size."),
  },
  (args) => run(() => callRoute(cfg, 'shop_browse', { query: args })),
);

server.tool(
  'shop_stats',
  "Aggregate statistics over the shop catalog: stores and products per platform, top vendors, product types, and price bands. Requires the Enterprise plan or above. Costs 1 credit.",
  {

  },
  (args) => run(() => callRoute(cfg, 'shop_stats', { query: args })),
);

server.tool(
  'shop_products',
  "Read captured product records: one store's catalog, or products across stores by title fragment, vendor, or country. Requires the Enterprise plan or above. Costs 2 credits.",
  {
    domain: z.string().optional().describe("One shop's registrable domain; omit to browse all"),
    q: z.string().optional().describe("Case-insensitive substring on the product title"),
    vendor: z.string().optional().describe("Exact vendor (brand) string as the storefront publishes it"),
    country: z.number().int().optional().describe("ISO country codes from hosting/ccTLD data; matches any listed country (CH = Switzerland, DE = Germany, PL = Poland)."),
    limit: z.number().int().optional().describe("Page size"),
    offset: z.number().int().optional().describe("Row offset into the ordered result. Honoured at any depth (never clamped), but the cost of an offset page grows with its depth; walk deep result sets with cursor instead."),
    cursor: z.string().optional().describe("Opaque next_cursor / previous_cursor from a previous page. A cursor page costs the same at any depth and takes precedence over offset. Read has_more and next_cursor to detect the end, never the page size."),
  },
  (args) => run(() => callRoute(cfg, 'shop_products', { query: args })),
);

if (import.meta.url === `file://${process.argv[1]}`) {
  if (!cfg.apiKey) {
    console.error('searchcode: SEARCHCODE_API_KEY is not set — every tool call will fail.');
    console.error('get a key at https://searchcode.ai/');
  }
  await server.connect(new StdioServerTransport());
  console.error(`searchcode MCP server ready (stdio) — ${cfg.baseUrl}`);
}
