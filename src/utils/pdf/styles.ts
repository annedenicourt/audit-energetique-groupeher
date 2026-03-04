import { StyleSheet } from "@react-pdf/renderer";

export const colors = {
  orange: "#f97316",
  slate800: "#1e293b",
  gray100: "#f3f4f6",
  gray400: "#9ca3af",
  gray600: "#4b5563",
  gray900: "#111827",
  white: "#ffffff",
  border: "#e5e7eb",
};

export const styles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingBottom: 50,
    paddingHorizontal: 30,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: colors.gray900,
  },
  coverPage: {
    backgroundColor: colors.slate800,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  coverTitle: {
    fontSize: 28,
    color: colors.white,
    fontFamily: "Helvetica-Bold",
    marginBottom: 10,
  },
  coverSubtitle: {
    fontSize: 16,
    color: colors.white,
    marginBottom: 20,
  },
  coverNote: {
    fontSize: 10,
    color: colors.gray400,
  },
  sectionTitle: {
    backgroundColor: colors.orange,
    color: colors.white,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 2,
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  rowAlt: {
    backgroundColor: colors.gray100,
  },
  label: {
    color: colors.gray600,
    flex: 1,
  },
  value: {
    color: colors.gray900,
    fontFamily: "Helvetica-Bold",
    flex: 1,
    textAlign: "right",
  },
  iconBoolean: {
    width: 10,
  },
  legend: {
    margin: 6,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 8,
    color: colors.gray400,
  },
});
