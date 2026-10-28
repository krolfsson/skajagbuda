/**
 * Monte Carlo: hur många användare kör en analys på skajagbuda.se, och hur många betalar om
 * betalväggen slås på — vid 29 kr respektive 10 kr. 20 000 simuleringar, nov 2026 – okt 2027,
 * uppdelat på tre åldersgrupper.
 *
 * Run: npx tsx scripts/simulate-customers.ts
 *
 * Mätt: 3 unika användare har slutfört en analys på 27 dagar sedan fixarna 30 sep (0 de
 * senaste 25 dagarna). Allt annat är antaganden med osäkerhet — se ANTAGANDEN nedan.
 * Uppdatera BASE_* när ny data finns.
 */

// ── seeded RNG ───────────────────────────────────────────────────────────────
let seed = 20261028;
const rand = () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const normal = () => {
  let u = 0; while (u === 0) u = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand());
};
function gamma(shape: number, scale = 1): number {
  if (shape < 1) return gamma(shape + 1, scale) * Math.pow(rand(), 1 / shape);
  const d = shape - 1 / 3, c = 1 / Math.sqrt(9 * d);
  for (;;) {
    let x, v;
    do { x = normal(); v = 1 + c * x; } while (v <= 0);
    v = v * v * v;
    const u = rand();
    if (u < 1 - 0.0331 * x ** 4 || Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v * scale;
  }
}
const beta = (a: number, b: number) => { const x = gamma(a); return x / (x + gamma(b)); };
const dirichlet = (alpha: number[]) => { const g = alpha.map((a) => gamma(a)); const t = g.reduce((p, q) => p + q, 0); return g.map((x) => x / t); };
function poisson(l: number): number {
  if (l <= 0) return 0;
  if (l > 40) return Math.max(0, Math.round(l + Math.sqrt(l) * normal()));
  const L = Math.exp(-l); let k = 0, p = 1;
  do { k++; p *= rand(); } while (p > L);
  return k - 1;
}
const binomial = (n: number, p: number) => { let k = 0; for (let i = 0; i < n; i++) if (rand() < p) k++; return k; };
const triangular = (a: number, m: number, b: number) => {
  const u = rand(), f = (m - a) / (b - a);
  return u < f ? a + Math.sqrt(u * (b - a) * (m - a)) : b - Math.sqrt((1 - u) * (b - a) * (b - m));
};

// ── ANTAGANDEN ───────────────────────────────────────────────────────────────
const N = 20_000;
/** Mätt: unika användare och antal dagar sedan fixarna. */
const BASE_USERS = 3;
const BASE_DAYS = 27;
const MONTHS = ["nov", "dec", "jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt"];
/** Bostadsmarknadens säsong (vår och höst starka, juli och december svaga), snitt ≈ 1. */
const SEASON = [1.0, 0.6, 0.8, 1.0, 1.25, 1.25, 1.2, 0.95, 0.6, 0.95, 1.15, 1.15];
/** Åldersfördelning och relativ betalvilja — antagna, ingen åldersdata finns. */
const SEGMENTS = [
  { name: "20–29 år", share: 0.35, payMult: 0.8 },
  { name: "30–44 år", share: 0.45, payMult: 1.2 },
  { name: "45+ år", share: 0.2, payMult: 1.0 },
];
/** Stripe, vanliga EES-kort: 1,5 % + 1,80 kr per köp (kontrollera mot ditt Stripe-konto). */
const net = (price: number) => price - (price * 0.015 + 1.8);

// ── simulering ───────────────────────────────────────────────────────────────
type Acc = { users: number[]; p29: number[]; p10: number[] };
const mk = (): Acc => ({ users: [], p29: [], p10: [] });
const tot6 = mk(), tot12 = mk();
const seg12 = SEGMENTS.map(mk);
const rev29: number[] = [], rev10: number[] = [];
const monthly = MONTHS.map(() => [] as number[]);
let tenWins = 0;

for (let sim = 0; sim < N; sim++) {
  // Basnivå per månad: Gamma-posterior från observerade användare (Jeffreys-prior).
  const base = gamma(BASE_USERS + 0.5, 1 / (BASE_DAYS / 30));
  // Ny CTA på kassa-guiden (≈ 75 % av klicken): mest troligt +25 %, spann 0 … +100 %.
  const ctaLift = triangular(1.0, 1.25, 2.0);
  // Organisk tillväxt per månad: mest troligt +8 %, spann −5 % … +25 %.
  const growth = triangular(-0.05, 0.08, 0.25);
  // Andel som betalar 29 kr: medel 6 %, ungefär 2–12 %. Aldrig testat (betalväggen avstängd).
  const pay29 = beta(3, 47);
  // Vid 10 kr betalar fler: mest troligt 1,8× så många, spann 1,2–3,0×.
  const pay10 = Math.min(0.6, pay29 * triangular(1.2, 1.8, 3.0));
  const shares = dirichlet(SEGMENTS.map((g) => g.share * 30));

  let level = base * ctaLift;
  const t6 = { u: 0, a: 0, b: 0 }, t12 = { u: 0, a: 0, b: 0 };
  const sU = SEGMENTS.map(() => 0), sA = SEGMENTS.map(() => 0), sB = SEGMENTS.map(() => 0);

  for (let m = 0; m < 12; m++) {
    level *= Math.exp(Math.log1p(growth) + 0.1 * normal());
    const users = poisson(level * SEASON[m]);
    monthly[m].push(users);
    let rest = users;
    SEGMENTS.forEach((g, i) => {
      const n = i === SEGMENTS.length - 1
        ? rest
        : binomial(rest, shares[i] / shares.slice(i).reduce((x, y) => x + y, 0));
      rest -= n;
      // Samma slumptal per användare för båda priserna: den som köper för 29 kr köper också för 10 kr.
      let a = 0, b = 0;
      for (let k = 0; k < n; k++) {
        const r = rand();
        if (r < Math.min(1, pay29 * g.payMult)) a++;
        if (r < Math.min(1, pay10 * g.payMult)) b++;
      }
      sU[i] += n; sA[i] += a; sB[i] += b;
      t12.u += n; t12.a += a; t12.b += b;
      if (m < 6) { t6.u += n; t6.a += a; t6.b += b; }
    });
  }
  tot6.users.push(t6.u); tot6.p29.push(t6.a); tot6.p10.push(t6.b);
  tot12.users.push(t12.u); tot12.p29.push(t12.a); tot12.p10.push(t12.b);
  SEGMENTS.forEach((_, i) => { seg12[i].users.push(sU[i]); seg12[i].p29.push(sA[i]); seg12[i].p10.push(sB[i]); });
  const r29 = t12.a * net(29), r10 = t12.b * net(10);
  rev29.push(r29); rev10.push(r10);
  if (r10 > r29) tenWins++;
}

// ── rapport ──────────────────────────────────────────────────────────────────
const q = (xs: number[], p: number) => { const a = [...xs].sort((x, y) => x - y); return a[Math.floor(p * (a.length - 1))]; };
const f = (xs: number[]) => `${q(xs, 0.1)} / ${q(xs, 0.5)} / ${q(xs, 0.9)}`;
const kr = (xs: number[]) => `${Math.round(q(xs, 0.1))} / ${Math.round(q(xs, 0.5))} / ${Math.round(q(xs, 0.9))} kr`;
const pr = (xs: number[], t: number) => ((xs.filter((x) => x >= t).length / xs.length) * 100).toFixed(0) + " %";

console.log(`N ${N} | netto per köp: 29 kr → ${net(29).toFixed(2)} kr · 10 kr → ${net(10).toFixed(2)} kr`);
console.log("(P10 / P50 / P90)");
console.log("6 mån  användare", f(tot6.users), "| betalande 29 kr", f(tot6.p29), "| 10 kr", f(tot6.p10));
console.log("12 mån användare", f(tot12.users), "| betalande 29 kr", f(tot12.p29), "| 10 kr", f(tot12.p10));
console.log("12 mån nettointäkt 29 kr", kr(rev29), "| 10 kr", kr(rev10));
console.log("P(10 kr ger mer netto än 29 kr):", ((tenWins / N) * 100).toFixed(0) + " %");
console.log("P(≥50 användare)", pr(tot12.users, 50), "· P(≥100)", pr(tot12.users, 100),
  "· P(≥10 betalande, 29 kr)", pr(tot12.p29, 10), "· P(≥10 betalande, 10 kr)", pr(tot12.p10, 10));
SEGMENTS.forEach((g, i) =>
  console.log(`${g.name}: användare ${f(seg12[i].users)} | betalande 29 kr ${f(seg12[i].p29)} | 10 kr ${f(seg12[i].p10)}`));
console.log("Median användare/mån:", MONTHS.map((m, i) => `${m} ${q(monthly[i], 0.5)}`).join(" · "));
