import { MantineThemeOverride } from "@mantine/core";

export const defaultLight: any = {
  colorScheme: "dark",
  theme: {
    fontFamily: "VarelaRound-Regular",
    primaryShade: { light: 7, dark: 9 },

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
    },
    primaryColor: "primary",
  } as MantineThemeOverride,
};
