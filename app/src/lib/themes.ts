export const themes = {
  murekep: {
    name: "Mürekkep",
    description: "Kaligrafi mürekkebi ve fildişi kağıt",
    colors: {
      bg: "#E4E4DE",
      fg: "#1B1B1B",
      accent: "#0F2143",
      bgAlt: "#D6D6CE",
      fgMuted: "#505050",
      border: "#C8C8BE",
    },
  },
  osmanli: {
    name: "Osmanlı Kütüphanesi",
    description: "Sıcak deri, yaşlanmış sayfa, altın varak",
    colors: {
      bg: "#F5F5DC",
      fg: "#595F39",
      accent: "#8B6212",
      bgAlt: "#E8E6CD",
      fgMuted: "#787D55",
      border: "#D2D0B4",
    },
  },
  turkuaz: {
    name: "Turkuaz",
    description: "Turkuaz deniz ve beyaz köpük",
    colors: {
      bg: "#FFFFFF",
      fg: "#134E4A",
      accent: "#0D9488",
      bgAlt: "#F0FDFA",
      fgMuted: "#5B8A85",
      border: "#B2DFDB",
    },
  },
} as const;

export type ThemeKey = keyof typeof themes;
