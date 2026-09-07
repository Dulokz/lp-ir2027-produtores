import assert from "node:assert/strict";
import test from "node:test";
import { diagnose, validAnswers, whatsappUrl } from "../lib/diagnostic";
test("organized answers yield 100 and at least three recommendations", () => {
  const r = diagnose([[0], [0], [0], [0], [0], [1], [1], [4]]);
  assert.equal(r.score, 100);
  assert.equal(r.level, "Organizada");
  assert.equal(r.insights.length, 3);
});
test("low organization produces risk and personalized insights", () => {
  const r = diagnose([[1], [3], [2], [2], [2], [0], [0], [0, 1]]);
  assert.equal(r.score, 20);
  assert.equal(r.level, "Risco");
  assert.equal(r.insights.length, 5);
  assert.ok(r.insights.some((x) => x.includes("financiamentos")));
});
test("score boundaries are deterministic", () => {
  assert.equal(
    diagnose([[0], [1], [1], [1], [0], [1], [1], [5]]).level,
    "Atenção",
  );
  assert.equal(diagnose([[0], [0], [0], [1], [1], [1], [1], [0]]).score, 75);
  assert.equal(
    diagnose([[0], [1], [0], [0], [0], [1], [1], [0]]).level,
    "Organizada",
  );
});
test("assets and financing alone do not reduce organization", () => {
  assert.equal(diagnose([[0], [0], [0], [0], [0], [0], [0], [4]]).score, 100);
});
test("rejects malformed, duplicate, contradictory, missing, and out-of-range answers", () => {
  assert.equal(validAnswers([[0], [0], [0], [0], [0], [0], [0], [4]]), true);
  for (const a of [
    [],
    null,
    [[0], [0], [0], [0], [0], [0], [0], [0, 4]],
    [[0], [0], [0], [0], [0], [0], [0], [0, 0]],
    [[99], [0], [0], [0], [0], [0], [0], [4]],
    [[0], [0], [0], [0], [0], [0], [0], []],
  ])
    assert.equal(validAnswers(a), false);
});
test("WhatsApp safely encodes accents and user text", () => {
  const url = new URL(
    whatsappUrl("Olá! Nome: João & Maria\nCidade: Cunha Porã/SC"),
  );
  assert.equal(url.hostname, "wa.me");
  assert.equal(
    url.searchParams.get("text"),
    "Olá! Nome: João & Maria\nCidade: Cunha Porã/SC",
  );
});
