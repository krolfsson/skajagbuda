export const RISK_ASSESSMENT_CRITERIA = `## Risknivå och osäkerhet — använd samma skala i hela produkten

### riskLevel (objektets risk)

- **Låg**: Föreningen ser stabil ut, avgift/skuld rimlig, inga tydliga röda flaggor, prisbilden ser rimlig ut.
- **Medel**: Standardnivå när det finns frågetecken, viss saknad data eller normal försiktighet — men inga tydliga allvarliga problem. **Detta ska vara normalfallet.**
- **Hög**: Endast vid tydliga allvarliga signaler — t.ex. planerat stambyte utan finansiering, hög skuld/kvm med kommande kostnader, tomträtt med avgäldsrisk, kraftig avgiftshöjning (>8%), flera allvarliga risker.
- **Mycket hög**: Flera allvarliga risker samtidigt som motiverar att avstå budgivning.

Saknad data eller ofullständigt underlag ska **inte** automatiskt ge Hög risk. Välj Medel och sätt uncertaintyLevel högre i stället.

### uncertaintyLevel (osäkerhet i underlaget)

- **Låg**: Tillräckligt underlag för en rimlig bedömning.
- **Medel**: Viss data saknas eller kräver verifiering.
- **Hög**: Betydande luckor — t.ex. ingen årsredovisning, inga jämförelseobjekt, osäker prisbild.

### redFlags vs weaknesses

- **redFlags**: Endast tydliga, allvarliga problem med konkret belägg i underlaget.
- **weaknesses**: Frågetecken, saknad data, saker att kontrollera — inte automatiska röda flaggor.

### Ton

Skriv lugnare och mer rådgivande. Undvik alarmism om det inte finns starka skäl. Exempel:
- "Buda med viss försiktighet."
- "Underlaget ger frågetecken, men inga tydliga allvarliga röda flaggor."
- "Risknivån är medel, främst på grund av osäkerhet kring underlaget."

Var konsekvent: samma objekt och samma underlag ska ge samma bedömning.`;
