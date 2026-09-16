<!--
  GENERATED. This repository is produced from the searchcode.ai customer API contract.
  Edits here are overwritten on the next contract change — open an issue instead.
-->

# @searchcode/mcp

[![npm](https://img.shields.io/npm/v/@searchcode/mcp.svg)](https://www.npmjs.com/package/@searchcode/mcp) [![license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

An MCP server that lets a coding agent search the source code of the public web. Ask it which
sites embed a script, what a domain is built with, or which domains share an analytics id, and it
answers from [searchcode.ai](https://searchcode.ai) instead of guessing.

Works with Claude Code, Claude Desktop, Cursor, VS Code, and any other MCP client.

## Install

```bash
npx -y @searchcode/mcp
```

## Configure

Add it to your MCP client's config. For Claude Code:

```bash
claude mcp add searchcode --env SEARCHCODE_API_KEY=your-key -- npx -y @searchcode/mcp
```

Or by hand, in any client that takes the standard config shape:

```json
{
  "mcpServers": {
    "searchcode": {
      "command": "npx",
      "args": ["-y", "@searchcode/mcp"],
      "env": { "SEARCHCODE_API_KEY": "your-key" }
    }
  }
}
```

[Get a key](https://searchcode.ai/). The free plan needs no card.

## Tools

| Tool | Credits | Plan | What it does |
| --- | --- | --- | --- |
| `search_source` | 5 | Free | Search the raw source (HTML, inline JavaScript and CSS) of websites across the public web for a substring or regular expression. |
| `facet_count` | 1 | Free | Get the exact number of sites carrying one signal, answering "how many sites use X". |
| `tech_query` | 3 | Free | List every site detected using a given technology, rank-ordered, with an exact site count. |
| `tech_lookup` | 3 | Pro | Get the full technology and statistics profile for one domain: detected technologies by category, page and byte counts, and sample pages. |
| `read_source` | 5 | Pro | Read the retained source of one page from a search hit, by its blob hash and content type. |
| `owner_graph` | 5 | Pro | Find every domain sharing one analytics, advertising, or tracker identifier, revealing sites run by the same operator. |
| `browse_domains` | 1 | Free | Browse the ranked domain index, optionally narrowed by a name fragment, top-level domain, technology, or country. |
| `list_shops` | 1 | Enterprise | Browse captured e-commerce storefronts by catalog size, optionally filtered by domain fragment or country. |
| `shop_stats` | 1 | Enterprise | Aggregate statistics over the shop catalog: stores and products per platform, top vendors, product types, and price bands. |
| `shop_products` | 2 | Enterprise | Read captured product records: one store's catalog, or products across stores by title fragment, vendor, or country. |

Each tool reports its own credit cost and plan requirement in its description, so the agent knows
what a call will cost before it makes one.

## What you can ask

Once it is connected, questions like these work:

- "Which sites embed the Stripe checkout script?"
- "What is shopify.com built with?"
- "How many sites use React?"
- "Find every domain sharing this Google Analytics id."
- "Show me the source of that match so I can see the surrounding code."

## Environment

| Variable | Meaning |
| --- | --- |
| `SEARCHCODE_API_KEY` | your API key, required |
| `SEARCHCODE_API_URL` | gateway base URL, defaults to `https://searchcode.ai` |

## How this repository is produced

Every file here is generated from the searchcode.ai customer API contract. When the API changes,
the contract changes, these packages are regenerated, their tests run, and a new version is
published. That is why the commands, tools, credit costs and plan requirements documented here
can never drift from what the API actually does.

Found a problem? [Open an issue](https://github.com/searchcode-ai) — please don't send a pull request against generated
files, they are overwritten on the next contract change.

## Links

- [Documentation](https://searchcode.ai/docs/)
- [Free source search, no account needed](https://searchcode.ai/)
- [Plans and pricing](https://searchcode.ai/docs/plans/)
- Contact: hello@searchcode.ai

## License

MIT
