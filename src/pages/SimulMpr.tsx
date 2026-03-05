import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { computeMpr } from "@/utils/computeMpr";
import { TYPES_TRAVAUX_MPR, type TypeTravauxMpr } from "@/types/mpr/listesMpr";
import { TRAVAUX_MPR } from "@/types/mpr/travauxMpr";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Info } from "lucide-react";
import { CATEGORIES_LABELS } from "@/utils/handleForm";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";


const SimulMpr = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const returnStep = location.state?.returnStep ?? 0;
  const { user, loading } = useAuth();

  const [nbPersonnes, setNbPersonnes] = useState("1");
  const [rfr, setRfr] = useState("");
  const [ageLogement, setAgeLogement] = useState("");
  const [typeTravaux, setTypeTravaux] = useState("");
  const [quantite, setQuantite] = useState("");
  const [cee, setCee] = useState("0");
  const [mpr, setMpr] = useState("0");

  const travail = typeTravaux ? TRAVAUX_MPR[typeTravaux as TypeTravauxMpr] : null;
  const unite = travail?.unite ?? "FORFAIT";
  const needQuantite = unite === "M2" || unite === "EQ";

  const result = useMemo(() => {
    if (!typeTravaux || !rfr || !nbPersonnes) return null;
    return computeMpr({
      nbPersonnes: Math.max(1, parseInt(nbPersonnes) || 1),
      rfr: parseFloat(rfr) || 0,
      ageLogement: parseFloat(ageLogement) || 0,
      typeTravaux: typeTravaux as TypeTravauxMpr,
      quantite: needQuantite ? (parseFloat(quantite) || 0) : undefined,
      cee: parseFloat(cee) || 0,
      mpr: parseFloat(mpr) || 0,
    });
  }, [typeTravaux, rfr, nbPersonnes, ageLogement, needQuantite, quantite, cee, mpr]);

  useEffect(() => setQuantite(""), [typeTravaux]);

  const travauxOptions = TYPES_TRAVAUX_MPR.map((t) => ({ value: t, label: t }));

  const fmt = (n: number) =>
    n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

  if (loading) return null;

  return (
    <div className="simulateur min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-2xl space-y-3">
        {/* Header */}
        <div>
          {user && (
            <button
              onClick={() => navigate("/", { replace: true, state: { step: returnStep } })}
              className=" absolute top-4 left-4 mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Retour
            </button>
          )}
          <div className="mt-8 md:mt-0 flex flex-col items-center justify-center">
            <img className="w-28 md:w-36 mb-4" src="/images/logo-HER-seul.png" alt="logo HER" />
            <h1 className="text-center text-base md:text-xl font-semibold text-foreground">
              Simulateur MaPrimeRénov' 2026 — Monogeste Hors IDF
            </h1>
          </div>
        </div>

        {/* Formulaire */}
        <div className="p-6 border ring-2 ring-orange-300 ring-offset-2 bg-card rounded-xl shadow-sm space-y-4">
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
              min="0"
            />
          </div>
          <FormInput
            label="Âge du logement (années)"
            name="ageLogement"
            type="number"
            value={ageLogement}
            onChange={setAgeLogement}
            min="0"
            required
          />

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
            label="Montant CEE"
            name="cee"
            type="number"
            value={cee}
            onChange={setCee}
            suffix="€"
            min="0"
          />
          <FormInput
            label="Montant MPR reçu sur les 5 dernières années"
            name="mpr"
            type="number"
            value={mpr}
            onChange={setMpr}
            suffix="€"
            min="0"
          />
        </div>

        {/* Résultats */}
        {result && (
          <div className="p-6 border ring-2 ring-cyan-500 ring-offset-2 bg-card rounded-xl shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Résultat</h2>
            {result.isEligible === false && result.reasons?.length ? (
              <Alert variant="destructive">
                <AlertDescription>{result.reasons.join(" ")}</AlertDescription>
              </Alert>
            ) : null}

            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="text-muted-foreground">Catégorie ménage</TableCell>
                  <TableCell>{CATEGORIES_LABELS[result.categorie] ?? result.categorie}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground">Unité</TableCell>
                  <TableCell>{result.unite === "M2" ? "m2" : result.unite}</TableCell>
                </TableRow><TableRow>
                  <TableCell className="text-muted-foreground">Montant unitaire</TableCell>
                  <TableCell>
                    {result.unite === "M2"
                      ? `${result.montantUnitaire.toLocaleString("fr-FR")} €/m²`
                      : result.unite === "EQ"
                        ? `${result.montantUnitaire.toLocaleString("fr-FR")} €/éq.`
                        : fmt(result.montantUnitaire)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground">MPR brut</TableCell>
                  <TableCell>{fmt(result.mprBrut)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground">Plafond éligible total</TableCell>
                  <TableCell>{fmt(result.plafondEligibleTotal)}</TableCell>
                </TableRow>
                {result.tauxEcretement != null && (
                  <TableRow>
                    <TableCell className="text-muted-foreground">Taux d'écrêtement</TableCell>
                    <TableCell>{(result.tauxEcretement * 100).toFixed(0)} %</TableCell>
                  </TableRow>
                )}
                {result.capEcretement != null && (
                  <TableRow>
                    <TableCell className="text-muted-foreground">Cap écrêtement</TableCell>
                    <TableCell>{fmt(result.capEcretement)}</TableCell>
                  </TableRow>
                )}
                <TableRow>
                  <TableCell className="text-muted-foreground">MPR après écrètement</TableCell>
                  <TableCell>{fmt(result.mprFinal)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground">Plafond MaPrimeRénov' sur 5 ans</TableCell>
                  <TableCell>20 000€</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground">Montant MPR reçu sur les 5 dernières années</TableCell>
                  <TableCell>{fmt(result.mpr)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            {/* <div className="px-4 pt-4 flex items-center justify-between border-t ">
              <span className="text-base font-semibold text-foreground">MPR après écrètement</span>
              <span className={`${result.mprFinal === 0 ? "text-red-500" : "text-green-500"} text-2xl font-bold`}>{fmt(result.mprFinal)}</span>
            </div> */}
            <div className="px-4 pt-4 flex items-center justify-between border-t ">
              <span className="text-base font-semibold text-foreground">MaPrimeRénov' finale après plafond</span>
              <span className={`${result.mprApresPlafond === 0 ? "text-red-500" : "text-green-500"} text-2xl font-bold`}>{fmt(result.mprApresPlafond)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulMpr;
