import { IconAt, IconPhoneCall } from "@tabler/icons-react";
import { Avatar, Paper, Group, Text, Box, useMantineTheme } from "@mantine/core";
import classes from "./user-info.module.css";
import { t } from "i18next";
import CornerRibbon from "./CornerRibbon";

interface UserInfoProps {
  user: any;
}

export function UserInfo({ user }: UserInfoProps) {
   const theme = useMantineTheme();

  return (
    <Box pos="relative">
      {user.UserSubscription?.[0] && (
        <CornerRibbon
          position="top-right" // OPTIONAL, default as "top-right"
          fontColor="WHITE" // OPTIONAL, default as "#f0f0f0"
          backgroundColor={user.UserSubscription?.[0].Plan.colorCode} // OPTIONAL, default as "#2c7"
          containerStyle={{}} // OPTIONAL, style of the ribbon
          style={{ fontWeight: 900, fontSize: "9px" }} // OPTIONAL, style of ribbon content
          className="" // OPTIONAL, css class of ribbon
        >
          {user.UserSubscription?.[0].Plan.name.toUpperCase()}
        </CornerRibbon>
      )}
      <Paper shadow="xs" p="sm" withBorder style={{ height: "100%" }}>
        <Group wrap="nowrap">
          {user !== null &&
          user !== undefined &&
          user.thumbnailUrl !== null &&
          user.thumbnailUrl !== undefined ? (
            <Avatar key={user!.email} src={user!.thumbnailUrl} size={'xl'}/>
          ) : (
            <Avatar key={user!.email} name={user!.email} color="initials" size={'xl'} />
          )}
          <div>
            <Text fz="sm" tt="uppercase" fw={700} c="dimmed">
              {user!.userType.toUpperCase()}
            </Text>

            <Text fz="lg" fw={500} className={classes.name}>
              {user.name}
            </Text>

            <Group wrap="nowrap" gap={10} mt={3}>
              <IconAt stroke={1.5} size={16} className={classes.icon} />
              <Text fz="xs" c="dimmed">
                {user!.email}
              </Text>
            </Group>

            <Group wrap="nowrap" gap={10} mt={5}>
              <IconPhoneCall stroke={1.5} size={16} className={classes.icon} />
              <Text fz="xs" c="dimmed">
                {user!.mobile}
              </Text>
            </Group>
          </div>
        </Group>
      </Paper>
    </Box>
  );
}
