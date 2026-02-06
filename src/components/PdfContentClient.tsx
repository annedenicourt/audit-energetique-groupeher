import React, { useState } from "react";
import { FileCheck, User, Home, Receipt, BarChart3, TrendingUp, Wallet, Banknote } from "lucide-react";
import SectionCard from "./SectionCard";
import { FormData } from "@/types/formData";
import html2pdf from "html2pdf.js";

interface PdfContentClientProps {
  data: FormData;
}

// Composant pour afficher une ligne de résumé
const SummaryRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b border-border/50 last:border-0">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium text-foreground">{value || "—"}</span>
  </div>
);

const PdfContentClient: React.FC<PdfContentClientProps> = ({ data }) => {
  return (
    <div>
      <div className="a4-page">
        {/* Client */}
        <SectionCard title="Client" icon={User}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <SummaryRow label="Accompagnateur" value={data.client.accompagnateur} />
            <SummaryRow label="Département" value={data.client.departement} />
            <SummaryRow label="Nom" value={data.client.nom} />
            <SummaryRow label="Téléphone" value={data.client.telephone} />
            <SummaryRow label="Adresse" value={`${data.client.adresse}, ${data.client.codePostal} ${data.client.ville}`} />
            <SummaryRow label="Conjoint 1" value={`${data.client.situationConjoint1}—${data.client.ageConjoint1}`} />
            <SummaryRow label="Conjoint 2" value={`${data.client.situationConjoint2}—${data.client.ageConjoint2}`} />
            <SummaryRow label="Année de construction" value={data.client.anneeConstruction} />
            <SummaryRow label="Surface habitable" value={data.client.surfaceHabitable ? `${data.client.surfaceHabitable} m²` : ""} />
            <SummaryRow label="Propriétaire depuis" value={data.client.proprietaireDepuis} />
            <SummaryRow label="Nombre de pièces chauffées" value={data.client.nbrePiecesChaufees} />
            <SummaryRow label="Nombre de personnes" value={data.client.nbrePersonnes} />
            <SummaryRow label="Dont enfants" value={data.client.dontEnfants} />
            <SummaryRow label="Type de chauffage" value={data.client.typeChauffage} />
            <SummaryRow label="Eau chaude" value={data.client.typeEauChaude} />
            <SummaryRow label="Ventilation" value={data.client.typeAeration} />
            <SummaryRow label="Facture électricité annuelle" value={data.client.factureElecAnnuelle ? `${data.client.factureElecAnnuelle} €` : ""} />
            <SummaryRow label="Facture énergie annuelle" value={data.client.factureEnergieAnnuelle ? `${data.client.factureEnergieAnnuelle} €` : ""} />
            <SummaryRow label="Travaux réalisés" value={data.client.travauxRealises} />
            <SummaryRow label="Aides perçues" value={data.client.montantAides ? `${data.client.montantAides} €` : ""} />
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default PdfContentClient;