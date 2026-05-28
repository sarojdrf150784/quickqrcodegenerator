export interface DesignPreset {
  id: string;
  label: string;
  fg: string;
  bg: string;
}

export const DESIGN_PRESETS: DesignPreset[] = [
  { id: "classic", label: "Classic", fg: "#000000", bg: "#FFFFFF" },
  { id: "midnight", label: "Midnight", fg: "#FFFFFF", bg: "#0F172A" },
  { id: "sunset", label: "Sunset", fg: "#E63946", bg: "#FFF4E6" },
  { id: "forest", label: "Forest", fg: "#1B4332", bg: "#D8F3DC" },
  { id: "ocean", label: "Ocean", fg: "#0C4A6E", bg: "#E0F2FE" },
  { id: "mono", label: "Mono Dark", fg: "#E5E7EB", bg: "#1F2937" },
  { id: "royal", label: "Royal", fg: "#FBBF24", bg: "#3B0764" },
  { id: "candy", label: "Candy", fg: "#DB2777", bg: "#FCE7F3" },
];

export interface BorderStyle {
  id: string;
  label: string;
}

export const BORDER_STYLES: BorderStyle[] = [
  { id: "none", label: "None" },
  { id: "simple", label: "Simple" },
  { id: "thick", label: "Thick" },
  { id: "rounded", label: "Card" },
  { id: "dashed", label: "Dashed" },
  { id: "double", label: "Double" },
  { id: "scanme", label: "Scan Me" },
  { id: "corners", label: "Corners" },
];
