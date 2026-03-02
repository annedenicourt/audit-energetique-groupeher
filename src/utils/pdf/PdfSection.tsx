import React from "react";
import { View, Text, Svg, Path, Image } from "@react-pdf/renderer";
import { styles } from "./styles";
import { Check } from "lucide-react";

export interface PdfRow {
  label: string;
  value: React.ReactNode;
}


export interface PdfSectionProps {
  title: string;
  rows: PdfRow[];
}



// Icône check pour @react-pdf/renderer (reprend le path de Lucide Check)
const PdfCheck = () => (
  <Svg viewBox="0 0 24 24" width={12} height={12}>
    <Path
      d="M20 6L9 17l-5-5"
      stroke="#16a34a"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

const getIcon = (isTrue) => {
  return isTrue ? "/images/checkmark.png" : "/images/false.png"
}

export const val = (v: unknown, suffix = ""): string => {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "boolean") {
    return v ? "✓" : "—";
  }

  return `${v}${suffix}`;
};

const PdfSection: React.FC<PdfSectionProps> = ({ title, rows }) => {
  return (
    <View wrap={false}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {rows.map((r, i) => {
        return (
          <View key={i} style={[styles.row, i % 2 === 0 ? styles.rowAlt : {}]}>
            <Text style={styles.label}>{r.label}</Text>
            {/* <Text style={styles.value}>{r.value}</Text> */}
            {typeof r.value === "boolean" ? <Image style={styles.iconBoolean} src={getIcon(r.value)} /> : <Text style={styles.value}>{r.value}</Text>}
          </View>
        )
      })}
    </View>
  );
}

export default PdfSection;
