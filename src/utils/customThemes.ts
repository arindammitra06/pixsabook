import { MantineThemeOverride } from "@mantine/core";

export const defaultLight: any = {
  colorScheme: "dark",
  theme: {
    fontFamily: "VarelaRound-Regular",
    primaryShade: { light: 7, dark: 5 },

    colors: {
      primary: [
        "#ffeaee",
        "#fdd4d9",
        "#f5a6b0",
        "#ee7585",
        "#e84d60",
        "#e53349",
        "#e4253d",
        "#c5172e",
        "#b61029",
        "#a00021",
      ],

      // ↓ here is the dark override
      dark: [
        "#d5d7e0",
        "#acaebf",
        "#8c8fa3",
        "#666980",
        "#4d4f66",
        "#34354a",
        "#2b2c3d",
        "#0a0a0c", // <--- MAIN BG
        "#09090b",
        "#050505",
      ],
    },
    variables: {
      "--mantine-color-body": "#34354a",
    },
    primaryColor: "primary",
  } as MantineThemeOverride,
};
