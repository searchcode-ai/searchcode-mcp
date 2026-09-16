// GENERATED from the searchcode.ai customer API contract. Do not edit by hand.
// MCP tool-surface tests.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CUSTOMER_API_ROUTES } from '@searchcode/core';
import { server } from '../src/index.js';

const mcpRoutes = Object.values(CUSTOMER_API_ROUTES).filter((r) => r.auth === 'api_key' && r.mcpTool);

/** The SDK keeps registered tools on the server instance; read them however it exposes them. */
function registeredTools() {
  const internal = server._registeredTools ?? server.registeredTools ?? {};
  return Object.keys(internal);
}

test('every contract tool is registered, and nothing else', () => {
  const registered = registeredTools().sort();
  const expected = mcpRoutes.map((r) => r.mcpTool).sort();
  assert.deepEqual(registered, expected);
});

test('no tool targets an admin or withdrawn path', () => {
  for (const route of mcpRoutes) {
    assert.doesNotMatch(route.path, /secret|audit|admin|operator/i, route.mcpTool);
  }
});

test('every tool advertises the contract credit cost and plan', () => {
  const tools = server._registeredTools ?? server.registeredTools ?? {};
  for (const route of mcpRoutes) {
    const description = tools[route.mcpTool]?.description ?? '';
    assert.match(
      description,
      new RegExp(`Costs ${route.meter.credits} credit`),
      `${route.mcpTool} must state its ${route.meter.credits}-credit cost`,
    );
    if (route.minTier !== 'free') {
      assert.match(description, /Requires the .+ plan or above/, route.mcpTool);
    }
  }
});

test('every tool describes what it does', () => {
  const tools = server._registeredTools ?? server.registeredTools ?? {};
  for (const route of mcpRoutes) {
    const description = tools[route.mcpTool]?.description ?? '';
    assert.ok(description.length > 80, `${route.mcpTool} description is too thin`);
  }
});

test('every tool declares a schema for each contract parameter', () => {
  const tools = server._registeredTools ?? server.registeredTools ?? {};
  for (const route of mcpRoutes) {
    const shape = tools[route.mcpTool]?.inputSchema?.shape ?? {};
    for (const param of route.params ?? []) {
      assert.ok(param.name in shape, `${route.mcpTool} is missing ${param.name}`);
    }
  }
});
