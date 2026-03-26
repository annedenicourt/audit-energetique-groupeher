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
