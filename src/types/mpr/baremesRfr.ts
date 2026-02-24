/** Plafonds de ressources 2026 – Hors Île-de-France (source : feuille 4 du xlsx) */
export const BAREMES_RFR_HORS_IDF = {
  TRES_MODESTE: {
    plafonds_1a5: [17363, 25393, 30540, 35676, 40835],
    increment: 5151,
  },
  MODESTE: {
    plafonds_1a5: [22259, 32553, 39148, 45735, 52348],
    increment: 6598,
  },
  INTERMEDIAIRE: {
    plafonds_1a5: [31185, 45842, 55196, 64550, 73907],
    increment: 9357,
  },
} as const;

export type CategorieMenage = keyof typeof BAREMES_RFR_HORS_IDF | "SUPERIEUR";
