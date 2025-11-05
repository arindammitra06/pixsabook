import {
  IconCircleDotted,
  IconFileCode,
  IconFlame,
  IconReceiptOff,
} from "@tabler/icons-react";
import {
  Paper,
  useMantineTheme,
  Grid,
  SimpleGrid,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import classes from "./feature-title.module.css";
import { t } from "i18next";
import { useStaticOptions } from "@/utils/useStaticOptions";

export function FeaturesTitle() {
  const theme = useMantineTheme();
  const { features } = useStaticOptions();
  const items = features.map((feature) => (
    <div key={feature.value}>
      <ThemeIcon
        size={44}
        radius="md"
        variant="gradient"
        gradient={{ deg: 133, from: `${feature.color!}.3`, to: `${feature.color!}.8` }}
      >
        <feature.icon size={26} stroke={1.5} />
      </ThemeIcon>
      <Text fz="lg" mt="sm" fw={500}>
        {feature.value}
      </Text>
      <Text c="dimmed" fz="sm">
        {feature.label}
      </Text>
    </div>
  ));

  return (
    <Paper shadow="xs" p="sm" mb={'sm'} withBorder>
      <div className={classes.wrapper}>
        <Grid gutter={80}>
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Title className={classes.title} order={2} c={theme.primaryColor}>
              {t("pixsabook-title")}
            </Title>
            <Text c="dimmed" fz='md'>{t("pixsabook-description")}</Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 7 }}>
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing={30}>
              {items}
            </SimpleGrid>
          </Grid.Col>
        </Grid>
      </div>
    </Paper>
  );
}
