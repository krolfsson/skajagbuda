import type { Scorecard } from "@/lib/schemas";

export const EXAMPLE_PROPERTY = {
  title: "Sveavägen 123, Vasastan",
  meta: "2 rok · 62 kvm · BRF Vasastan · Utgångspris 7 950 000 kr",
  metaShort: "2 rok · 62 kvm · BRF Vasastan · Exempelanalys",
};

export const EXAMPLE_PRICE_VS_MARKET =
  "Jämför med faktiska slutpriser, inte utgångspriser: tre 2:or i kvarteret gick för 128 000–134 000 kr/kvm det senaste året. Utgångspriset (128 000 kr/kvm) är satt lågt för att dra upp budgivningen — den verkliga marknadsnivån ligger snarare runt 8,1–8,3 Mkr.";

export const EXAMPLE_CONCLUSION =
  "Buda försiktigt och kräv svar om stambyte, tomträtt och räntebindning innan slutbud.";

export const EXAMPLE_SCORECARD: Scorecard = {
  score: 68,
  recommendation: "Buda försiktigt",
  riskLevel: "Medel",
  maxBidSuggestion: 8150000,
  oneSentenceSummary:
    "Bra läge och rimlig avgift, men ett stambyte 2026–2027 utan finansiering — plus mindre uppenbara saker som tomträtt och rörliga föreningslån — döljer kostnader som inte syns i annonsen.",
  summary:
    "Sveavägen 123 ligger i ett attraktivt läge nära Odenplan med en månadsavgift på 4 200 kr för 62 kvm — vid första anblick rimligt. Men avgiften säger lite om man inte väger in vad som är på väg.\n\nDet tydligaste är stambytet som är planerat 2026–2027. Kostnaden är ännu inte fastställd, och med en kassa på bara 2,5 Mkr och ett lågt underhållssparande (~120 kr/kvm/år) är risken stor att notan landar som avgiftshöjning eller engångsinsats för medlemmarna. En ljuspunkt: köksstammarna byttes delvis redan 2015, vilket kan minska omfattningen.\n\nAnnonsen nämner inte heller två saker som är lätta att missa: fastigheten står på tomträtt, och avgälden (markhyran till staden) omförhandlas 2027 — den kan höja avgiften helt oberoende av stambytet. Dessutom har 60 % av föreningens lån rörlig ränta; vid +2 procentenheter ökar räntekostnaden cirka 310 000 kr/år, vilket ensamt motsvarar ungefär 8 % avgiftshöjning.\n\nAtt avgiften dessutom sänktes 4 % för två år sedan är värt att notera — ofta ett sätt att få föreningen att se billig ut inför försäljningar snarare än ett tecken på stark ekonomi. Priset ligger i linje med Vasastan, men jämfört med faktiska slutpriser (inte utgångspriser) finns begränsat utrymme uppåt. Rekommendationen är att buda försiktigt och kräva skriftliga svar om stambytets finansiering, tomträttsavgäld och räntebindning innan slutbud.",
  strengths: [
    "Attraktivt läge nära Odenplan, grönområden och Odenplans tunnelbana",
    "Köksstammar delvis bytta 2015 — kan minska omfattningen av kommande stambyte",
    "Skuld/kvm 6 500 kr — under snitt i området",
    "Söderbalkong och genomtänkt planlösning utan mörka ytor",
    "Renoverat badrum 2023 med tätskikt enligt branschregler",
    "Hiss i fastigheten — höjer tillgänglighet och vidareförsäljningsvärde",
    "Hög andel bostadsrätter (få hyresrätter) ger en stabilare förening",
  ],
  weaknesses: [
    "Tomträtt — avgälden omförhandlas 2027 och kan höja avgiften oavsett stambytet",
    "60 % av föreningens lån har rörlig ränta — känsligt för räntehöjningar",
    "Underhållssparande ~120 kr/kvm/år är lågt för ett hus från 1929",
    "Avgiften sänktes 4 % för två år sedan — kan vara kosmetiskt inför försäljningar",
    "Stambyte planerat 2026–2027 — kostnad ännu ej fastställd",
  ],
  redFlags: [
    "Tomträttsavgäld omförhandlas 2027 — potentiellt stor dold kostnad",
    "Stambyte 2026–2027 utan bekräftad finansiering och tunn kassa (2,5 Mkr)",
    "20 % av föreningens intäkter kommer från en enda lokalhyresgäst, avtal ut 2026",
    "Ditt andelstal (2,34 %) är högre än lägenhetens andel av total boyta — du betalar en större del av framtida kostnader än ytan motiverar",
  ],
  questionsToAsk: [
    "Hur stor är dagens tomträttsavgäld och när/hur omförhandlas den 2027?",
    "Hur är föreningens lån fördelade på bunden vs rörlig ränta, och när löper bindningarna ut?",
    "Finns en detaljerad kostnadskalkyl för stambytet och hur ska det finansieras?",
    "Vad händer om lokalhyresgästen inte förnyar avtalet 2026?",
    "Varför sänktes avgiften för två år sedan och är den nivån långsiktigt hållbar?",
    "Stämmer lägenhetens andelstal med boytan, eller betalar jag en oproportionerlig andel?",
  ],
  bidStrategy: {
    openingMove:
      "7 700 000 kr — tydligt under utgångspris för att signalera medvetenhet om tomträtt, stambyte och osäker kostnadsbild. Utgångspriset är lågt satt för att locka bud, så låt dig inte stressas av tempot.",
    nextStep:
      "Budsteg om 50 000–100 000 kr. Gå inte över 8 150 000 kr utan skriftliga svar om tomträttsavgäld, stambytesfinansiering och räntebindning.",
    walkAwayPoint:
      "8 300 000 kr — över detta kompenseras inte tomträttsrisken och föreningens samlade ekonomiska exponering.",
    negotiationNotes:
      "Använd tomträtt, stambyte och den höga andelen rörliga lån som konkreta förhandlingsargument. En snabb budstrid talar ofta för ett medvetet lågt utgångspris — håll fast vid din walk-away-nivå och kräv skriftliga svar innan slutbud.",
  },
  categoryScores: {
    price: 64,
    association: 50,
    condition: 70,
    location: 85,
    liquidity: 60,
    risk: 55,
  },
  disclaimer:
    "Detta är inte finansiell rådgivning. Gör alltid din egen bedömning och rådgör med bank och eventuellt en oberoende mäklare eller jurist innan du fattar beslut.",
};

export const EXAMPLE_SUMMARY_SHORT =
  "Avgiften på 4 200 kr ser rimlig ut — men annonsen nämner inte att fastigheten står på tomträtt med omförhandling 2027, att 60 % av föreningens lån är rörliga (ca 8 % avgiftshöjning vid +2 räntepunkter) eller att underhållssparandet är lågt inför stambytet 2026–2027. Avgiften sänktes dessutom nyligen, vilket kan vara kosmetiskt. Priset ligger i linje med Vasastan, men mot faktiska slutpriser finns begränsat utrymme uppåt.";
