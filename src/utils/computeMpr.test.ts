import { describe, it, expect } from "vitest";
import { computeMpr } from "./computeMpr";

describe("computeMpr", () => {
  // 1. FORFAIT – Très modeste
  it("PAC Air/Eau très modeste 1 personne", () => {
    const r = computeMpr({ nbPersonnes: 1, rfr: 15000, typeTravaux: "PAC Air/Eau" });
    expect(r.categorie).toBe("TRES_MODESTE");
    expect(r.unite).toBe("FORFAIT");
    expect(r.montantUnitaire).toBe(5000);
    expect(r.mprBrut).toBe(5000);
    expect(r.plafondEligibleTotal).toBe(12000);
    expect(r.capEcretement).toBe(10800); // 0.9 * 12000
    expect(r.mprFinal).toBe(5000);
  });

  // 2. FORFAIT – Modeste
  it("Poêle à granulés modeste 3 personnes", () => {
    const r = computeMpr({ nbPersonnes: 3, rfr: 35000, typeTravaux: "Poêle à granulés" });
    expect(r.categorie).toBe("MODESTE");
    expect(r.mprBrut).toBe(1000);
    expect(r.capEcretement).toBe(3750); // 0.75 * 5000
    expect(r.mprFinal).toBe(1000);
  });

  // 3. FORFAIT – Intermédiaire
  it("CET intermédiaire 2 personnes", () => {
    const r = computeMpr({ nbPersonnes: 2, rfr: 40000, typeTravaux: "Chauffe-eau thermodynamique (CET)" });
    expect(r.categorie).toBe("INTERMEDIAIRE");
    expect(r.mprBrut).toBe(400);
    expect(r.capEcretement).toBe(2100); // 0.6 * 3500
    expect(r.mprFinal).toBe(400);
  });

  // 4. SUPERIEUR → 0
  it("SUPERIEUR donne mprFinal = 0", () => {
    const r = computeMpr({ nbPersonnes: 1, rfr: 999999, typeTravaux: "PAC Air/Eau" });
    expect(r.categorie).toBe("SUPERIEUR");
    expect(r.mprBrut).toBe(0);
    expect(r.mprFinal).toBe(0);
  });

  // 5. M2 – Isolation rampants très modeste
  it("Isolation rampants M2 très modeste 80m²", () => {
    const r = computeMpr({ nbPersonnes: 2, rfr: 20000, typeTravaux: "Isolation rampants / plafonds combles", quantite: 80 });
    expect(r.categorie).toBe("TRES_MODESTE");
    expect(r.unite).toBe("M2");
    expect(r.montantUnitaire).toBe(25);
    expect(r.mprBrut).toBe(2000); // 25 * 80
    expect(r.plafondEligibleTotal).toBe(6000); // 75 * 80
    expect(r.capEcretement).toBe(5400); // 0.9 * 6000
    expect(r.mprFinal).toBe(2000);
  });

  // 6. EQ – Fenêtres modeste
  it("Fenêtres EQ modeste 6 équipements", () => {
    const r = computeMpr({ nbPersonnes: 4, rfr: 44000, typeTravaux: "Fenêtres simple vitrage → performant", quantite: 6 });
    expect(r.categorie).toBe("MODESTE");
    expect(r.unite).toBe("EQ");
    expect(r.mprBrut).toBe(480); // 80 * 6
    expect(r.plafondEligibleTotal).toBe(6000); // 1000 * 6
    expect(r.capEcretement).toBe(4500); // 0.75 * 6000
    expect(r.mprFinal).toBe(480);
  });

  // 7. CEE fait tomber mprFinal à 0
  it("CEE élevé fait tomber mprFinal à 0", () => {
    const r = computeMpr({ nbPersonnes: 1, rfr: 15000, typeTravaux: "Poêle à bûches", cee: 5000 });
    expect(r.categorie).toBe("TRES_MODESTE");
    expect(r.mprBrut).toBe(1250);
    expect(r.capEcretement).toBe(3600); // 0.9 * 4000
    expect(r.mprFinal).toBe(0); // min(1250, 3600-5000) => min(1250, -1400) => max(0, -1400) = 0
  });

  // 8. CEE réduit partiellement mprFinal
  it("CEE réduit mprFinal partiellement", () => {
    const r = computeMpr({ nbPersonnes: 1, rfr: 15000, typeTravaux: "PAC Air/Eau", cee: 8000 });
    expect(r.mprFinal).toBe(2800); // min(5000, 10800-8000) = min(5000, 2800) = 2800
  });

  // 9. nbPersonnes > 5 – calcul increment
  it("7 personnes modeste avec increment", () => {
    // plafond modeste 5 pers = 52348, increment = 6598 => plafond 7 = 52348 + 2*6598 = 65544
    const r = computeMpr({ nbPersonnes: 7, rfr: 60000, typeTravaux: "PAC Air/Eau" });
    expect(r.categorie).toBe("MODESTE");
    expect(r.mprBrut).toBe(4000);
  });

  // 10. M2 sans quantite => mprBrut = 0
  it("M2 sans quantite donne mprBrut 0", () => {
    const r = computeMpr({ nbPersonnes: 1, rfr: 15000, typeTravaux: "Isolation toiture terrasse" });
    expect(r.mprBrut).toBe(0);
    expect(r.mprFinal).toBe(0);
  });

  // 11. Écrêtement effectif (mprBrut > capEcretement)
  it("écrêtement effectif intermédiaire PAC géothermie", () => {
    // Intermédiaire: montant=6000, plafond=18000, taux=0.6, cap=10800
    // mprBrut=6000 < 10800 → pas d'écrêtement ici, ajoutons CEE
    const r = computeMpr({ nbPersonnes: 2, rfr: 40000, typeTravaux: "PAC Géothermie / Solarothermie", cee: 6000 });
    expect(r.categorie).toBe("INTERMEDIAIRE");
    expect(r.mprBrut).toBe(6000);
    expect(r.capEcretement).toBe(10800);
    expect(r.mprFinal).toBe(4800); // min(6000, 10800-6000) = 4800
  });
});
