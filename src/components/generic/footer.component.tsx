"use client";

import {
  Container,
  Group,
  Text,
  Anchor,
  Divider,
  Image,
  Stack,
  rem,
} from "@mantine/core";
import { IconBrandFacebook, IconBrandInstagram } from "@tabler/icons-react";
import { t } from "i18next";


export default function Footer() {
  return (
    <footer
      style={{
        backdropFilter: "blur(5px)", // subtle blur for background
        WebkitBackdropFilter: "blur(12px)", // Safari support
        border: "1px solid rgba(255, 255, 255, 0.05)",

        paddingTop: rem(32),
        paddingBottom: rem(32),
        borderTop: "0.5px solid #383c3f",
      }}
    >
      <Container size="lg">
        {/* Top description section */}
        <Stack gap="xs">
          <Text fw={600} fz="lg">
            Pixsabook Cloud Album - {t('memories-for-lifetime')}
          </Text>

          <Text c="gray.3" fz="sm" maw={900}>
            {t('footer-lines')}{" "}
            <Anchor
              href={`mailto:${process.env.SUPPORT_MAIL}`}
              c="blue.4"
              underline="hover"
            >
              {process.env.SUPPORT_MAIL}
            </Anchor>{" "}
            or{" "}
            <Anchor
              href="https://www.facebook.com/tamajitphotography"
              c="blue.4"
              underline="hover"
              target="_blank"
            >
              Tamajit Photography on Facebook
            </Anchor>
            . {t('footer-lines-2')}.
          </Text>
        </Stack>

        <Divider my="md" color="#383c3f" />

        {/* Bottom section */}
        <Group justify="space-between" wrap="wrap" align="center">
          {/* Left side */}
          <Image
            src="/assets/images/logo_text.png"
            alt="pixsabook logo"
            h={80}
            w={100}
            fit="contain"
          />
          <Group align="center" gap="sm">
            <Group gap="lg" visibleFrom="sm">
              <Anchor href="#"  fz="sm" underline="hover">
                {t('help')}
              </Anchor>
              <Anchor href="#"  fz="sm" underline="hover">
                {t('terms-conditions')}
              </Anchor>
              <Anchor href="#"  fz="sm" underline="hover">
                {t('contact-us')}
              </Anchor>
            </Group>
          </Group>

          {/* Right side */}
          <Group gap="md">
            <Anchor
              href="https://www.facebook.com/tamajitphotography"
              target="_blank"
            >
              <IconBrandFacebook size={22} color="blue"/>
            </Anchor>
            <Anchor
              href="https://www.facebook.com/tamajitphotography"
              target="_blank"
            >
              <IconBrandInstagram size={22} color="red" />
            </Anchor>
          </Group>
        </Group>
      </Container>
    </footer>
  );
}
