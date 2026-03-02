import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { styles } from "./styles";

export interface PdfRow {
  label: string;
  value: string;
}

export interface PdfSectionProps {
  title: string;
  rows: PdfRow[];
}

export const val = (v: unknown, suffix = ""): string => {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "boolean") return v ? "✓" : "—";
  return `${v}${suffix}`;
};

const PdfSection: React.FC<PdfSectionProps> = ({ title, rows }) => (
  <View wrap={false}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {rows.map((r, i) => (
      <View key={i} style={[styles.row, i % 2 === 0 ? styles.rowAlt : {}]}>
        <Text style={styles.label}>{r.label}</Text>
        <Text style={styles.value}>{r.value}</Text>
      </View>
    ))}
  </View>
);

export default PdfSection;
