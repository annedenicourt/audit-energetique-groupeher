import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { computeMpr } from "@/utils/computeMpr";
import { TYPES_TRAVAUX_MPR, type TypeTravauxMpr } from "@/types/mpr/listesMpr";
import { TRAVAUX_MPR } from "@/types/mpr/travauxMpr";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Info } from "lucide-react";

const CATEGORIES_LABELS: Record<string, string> = {
  TRES_MODESTE: "Très modeste",
  MODESTE: "Modeste",
  INTERMEDIAIRE: "Intermédiaire",
  SUPERIEUR: "Supérieur (non éligible)",
};

const SimulMpr = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const returnStep = location.state?.returnStep ?? 0;

  const [nbPersonnes, setNbPersonnes] = useState("1");
  const [rfr, setRfr] = useState("");
  const [typeTravaux, setTypeTravaux] = useState("");
  const [quantite, setQuantite] = useState("");
  const [cee, setCee] = useState("0");

  const travail = typeTravaux ? TRAVAUX_MPR[typeTravaux as TypeTravauxMpr] : null;
  const unite = travail?.unite ?? "FORFAIT";
  const needQuantite = unite === "M2" || unite === "EQ";

  const result = useMemo(() => {
    if (!typeTravaux || !rfr || !nbPersonnes) return null;
    return computeMpr({
      nbPersonnes: Math.max(1, parseInt(nbPersonnes) || 1),
      rfr: parseFloat(rfr) || 0,
      typeTravaux: typeTravaux as TypeTravauxMpr,
      quantite: needQuantite ? (parseFloat(quantite) || 0) : undefined,
      cee: parseFloat(cee) || 0,
    });
  }, [nbPersonnes, rfr, typeTravaux, quantite, cee, needQuantite]);

  const travauxOptions = TYPES_TRAVAUX_MPR.map((t) => ({ value: t, label: t }));

  const fmt = (n: number) =>
    n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

  return (
    <div className="min-h-screen bg-muted p-4 md:p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/", { replace: true, state: { step: returnStep } })}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Retour
          </button>
          <h1 className="text-xl font-semibold text-foreground">
            Simulateur MaPrimeRénov' 2026 — Monogeste Hors IDF
          </h1>
        </div>

        {/* Formulaire */}
        <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Nombre de personnes du foyer"
              name="nbPersonnes"
              type="number"
              value={nbPersonnes}
              onChange={setNbPersonnes}
              min="1"
              max="20"
              required
            />
            <FormInput
              label="Revenu fiscal de référence (€)"
              name="rfr"
              type="number"
              value={rfr}
              onChange={setRfr}
              suffix="€"
              required
            />
          </div>

          <FormSelect
            label="Type de travaux"
            name="typeTravaux"
            value={typeTravaux}
            onChange={setTypeTravaux}
            options={travauxOptions}
            required
          />

          {needQuantite && (
            <FormInput
              label={unite === "M2" ? "Surface (m²)" : "Nombre d'équipements"}
              name="quantite"
              type="number"
              value={quantite}
              onChange={setQuantite}
              suffix={unite === "M2" ? "m²" : "éq."}
              min="0"
              required
            />
          )}

          {needQuantite && !quantite && typeTravaux && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Veuillez renseigner {unite === "M2" ? "la surface" : "le nombre d'équipements"} pour obtenir un calcul précis.
              </AlertDescription>
            </Alert>
          )}

          <FormInput
            label="Montant CEE déjà perçu"
            name="cee"
            type="number"
            value={cee}
            onChange={setCee}
            suffix="€"
          />
        </div>

        {/* Résultats */}
        {result && (
          <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Résultat</h2>

            <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
              <span className="text-muted-foreground">Catégorie ménage</span>
              <span className="font-medium text-foreground">
                {CATEGORIES_LABELS[result.categorie] ?? result.categorie}
              </span>

              <span className="text-muted-foreground">Unité</span>
              <span className="font-medium text-foreground">{result.unite}</span>

              <span className="text-muted-foreground">Montant unitaire</span>
              <span className="font-medium text-foreground">{fmt(result.montantUnitaire)}</span>

              <span className="text-muted-foreground">MPR brut</span>
              <span className="font-medium text-foreground">{fmt(result.mprBrut)}</span>

              <span className="text-muted-foreground">Plafond éligible total</span>
              <span className="font-medium text-foreground">{fmt(result.plafondEligibleTotal)}</span>

              {result.tauxEcretement != null && (
                <>
                  <span className="text-muted-foreground">Taux d'écrêtement</span>
                  <span className="font-medium text-foreground">
                    {(result.tauxEcretement * 100).toFixed(0)} %
                  </span>
                </>
              )}

              {result.capEcretement != null && (
                <>
                  <span className="text-muted-foreground">Cap écrêtement</span>
                  <span className="font-medium text-foreground">{fmt(result.capEcretement)}</span>
                </>
              )}
            </div>

            <div className="border-t pt-4 flex items-center justify-between">
              <span className="text-base font-semibold text-foreground">MaPrimeRénov' finale</span>
              <span className="text-2xl font-bold text-accent">{fmt(result.mprFinal)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulMpr;
