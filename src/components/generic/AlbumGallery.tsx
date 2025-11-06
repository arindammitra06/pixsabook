import { useEffect, useRef, useState } from "react";
import {
  Card,
  Image,
  Text,
  Group,
  ActionIcon,
  SimpleGrid,
  Skeleton,
  Center,
  Stack,
  Box,
  Menu,
} from "@mantine/core";
import {
  IconBolt,
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconUsersPlus,
} from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  getAlbumsByUserId,
  updateAlbumByField,
} from "@/store/slices/album.slice";
import { TimeAgo } from "@n1ru4l/react-time-ago";
import { AlbumFlipbookModal } from "./AlbumFlipbook";
import LikeButton from "./AlbumLikeButton";
import { t } from "i18next";
import { Album } from "@/model/album.model";
import UpdateInviteesModalComponent from "../update-invitees.popup.component";
import { CanShowConfirmModal } from "./confirmation.component";
import { successAlert, errorAlert } from "@/utils/alert.util";
import { nprogress } from "@mantine/nprogress";
import CornerRibbon from "./CornerRibbon";
import { isWithinLast7Days } from "@/utils/utils";
import EmptyState from "./empty-state.component";
import { modals } from "@mantine/modals";
import { fetchUserById } from "@/store/slices/authenticate.slice";

export default function AlbumGallery(props) {
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const { isLoading, albums } = useAppSelector((state) => state.album);
  const dispatch = useAppDispatch();
  const [opened, setOpened] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<any | null>(null);
  const editInvitees = useRef<CanShowConfirmModal>(null);
  function editInviteesOnButtonClick(event) {
    event.stopPropagation();
    if (editInvitees.current !== null && editInvitees.current !== undefined) {
      editInvitees.current.openConfirmPopup();
    }
  }
  const openAlbum = (album: any) => {
    setSelectedAlbum(album);
    setOpened(true);
  };
  console.log("Albums in Home Page:", albums);
  useEffect(() => {
    if (currentUser !== null && currentUser !== undefined) {
      getAlbums();
    }
  }, [currentUser, dispatch]);

  const getAlbums = () => {
    dispatch(
      getAlbumsByUserId({ userId: currentUser!.id!, pageType: props.pageType }),
    );
  };

  const openPublishModal = (
    id: number,
    fieldName: string,
    fieldValue: string,
  ) =>
    modals.openConfirmModal({
      title: t("warning"),
      centered: true,
      children: <Text size="sm">{t("are-you-sure-publish")}</Text>,
      labels: { confirm: t("confirm"), cancel: t("cancel") },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => publishOrDeleteAlbum(id, fieldName, fieldValue),
    });

  const publishOrDeleteAlbum = (
    albumId: number,
    fieldName: string,
    action: string,
  ) => {
    // Dispatch updateAlbumByField action to publish the album
    // You may need to pass currentUserId as well
    nprogress.reset();
    nprogress.start();
    dispatch(
      updateAlbumByField({
        albumId: albumId,
        fieldname: fieldName,
        fieldValue: action,
        currentUserId: currentUser!.id!,
      }),
    ).then((res: any) => {
      dispatch(fetchUserById({ id: currentUser!.id! })).then((res: any) => {
        console.log(res);
        nprogress.complete();
      });
      if (res.payload.status) {
        successAlert(res.payload.message);
      } else {
        errorAlert(res.payload.message);
      }
      getAlbums();
    });
  };

  return (
    <>
      {isLoading ? (
        <SimpleGrid cols={{ base: 1, xs: 2, sm: 3, md: 3, lg: 3 }} spacing="xs">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} shadow="sm" radius="md" withBorder>
              <Skeleton height={180} radius="md" />
              <Stack gap="xs" mt="sm">
                <Skeleton height={12} width="60%" />
                <Skeleton height={12} width="40%" />
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      ) : albums !== null && albums !== undefined && albums.length > 0 ? (
        <SimpleGrid cols={{ base: 1, xs: 2, sm: 3, md: 3, lg: 3 }} spacing="xs">
          {albums.map((album: Album) => (
            <Card
              key={album.id}
              shadow="md"
              radius="md"
              withBorder
              onClick={() => openAlbum(album)}
              style={{ overflow: "hidden" }}
            >
              <Card.Section>
                <UpdateInviteesModalComponent
                  ref={editInvitees}
                  header={t("update-invitation-list")}
                  message={""}
                  onNoClick={() => {}}
                  onYesClick={() => getAlbums()}
                  formProps={{
                    albumId: album.id,
                    inviteeList: album.viewers
                      ? album.viewers.map((user) => user.email)
                      : [],
                  }}
                />
                <Box pos="relative">
                  {album.active.toString() === "No" ? (
                    <CornerRibbon
                      position="top-left" // OPTIONAL, default as "top-right"
                      fontColor="red" // OPTIONAL, default as "#f0f0f0"
                      backgroundColor="yellow" // OPTIONAL, default as "#2c7"
                      containerStyle={{}} // OPTIONAL, style of the ribbon
                      style={{ fontWeight: 900, fontSize: "9px" }} // OPTIONAL, style of ribbon content
                      className="" // OPTIONAL, css class of ribbon
                    >
                      DELETED
                    </CornerRibbon>
                  ) : (
                    isWithinLast7Days(album.createdAt) && (
                      <CornerRibbon
                        position="top-left" // OPTIONAL, default as "top-right"
                        fontColor="#f0f0f0" // OPTIONAL, default as "#f0f0f0"
                        backgroundColor="red" // OPTIONAL, default as "#2c7"
                        containerStyle={{}} // OPTIONAL, style of the ribbon
                        style={{ fontWeight: 900, fontSize: "9px" }} // OPTIONAL, style of ribbon content
                        className="" // OPTIONAL, css class of ribbon
                      >
                        NEW
                      </CornerRibbon>
                    )
                  )}
                  <Image
                    src={album.coverImage || "/placeholder.jpg"}
                    alt={album.albumName}
                    height={180}
                    radius={0}
                    fit="cover"
                  />

                  {/* Overlay icon */}
                  {currentUser !== null &&
                    currentUser !== undefined &&
                    (currentUser.userType.toString() === "Admin" ||
                      currentUser.userType.toString() === "Editor") &&
                    album.active.toString() === "Yes" && (
                      <Menu shadow="md" width={150}>
                        <Menu.Target>
                          <ActionIcon
                            variant="filled"
                            color="gray"
                            radius="xl"
                            size="xs"
                            style={{
                              position: "absolute",
                              top: 5,
                              right: 5,
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <IconDotsVertical size={14} />
                          </ActionIcon>
                        </Menu.Target>

                        <Menu.Dropdown>
                          <Menu.Item
                            leftSection={<IconBolt size={14} />}
                            onClick={(e) => {
                              e.stopPropagation();
                              openPublishModal(
                                album.id!,
                                "isPublished",
                                album.isPublished.toString() === "No"
                                  ? "Yes"
                                  : "No",
                              );
                            }}
                          >
                            {album.isPublished.toString() === "No"
                              ? t("publish")
                              : t("unpublish")}
                          </Menu.Item>
                          <Menu.Item leftSection={<IconEdit size={14} />}>
                            {t("edit")}
                          </Menu.Item>
                          <Menu.Item
                            color="red"
                            leftSection={<IconTrash size={14} />}
                            onClick={(e) => {
                              e.stopPropagation();
                              openPublishModal(album.id!, "active", "No");
                            }}
                          >
                            {t("delete")}
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    )}
                </Box>
              </Card.Section>

              <Group justify="space-between" mt="sm" mb={4}>
                <Text
                  fw={700}
                  size="xl"
                  lineClamp={1}
                  style={{ fontFamily: "BerkshireSwash-Regular" }}
                >
                  {album.albumName}
                </Text>
              </Group>

              <Text size="xs" c="dimmed" mb="sm" lineClamp={1}>
                {album.albumDesc || "No description"}
              </Text>

              <Group justify="space-between">
                <Group gap="xs">
                  <LikeButton albumId={album.id} />

                  <ActionIcon
                    variant="light"
                    color="gray"
                    radius="xl"
                    onClick={(e) => editInviteesOnButtonClick(e)}
                  >
                    <IconUsersPlus size={18} color="teal" />
                  </ActionIcon>
                </Group>
                <TimeAgo
                  date={new Date(album.createdAt)}
                  render={({ error, value }) => (
                    <Text size="xs" c="dimmed">
                      {value}
                    </Text>
                  )}
                />
              </Group>
            </Card>
          ))}
        </SimpleGrid>
      ) : (
        <Center>
          <EmptyState title={t("no_albums")} message={t("no_albums_sub")} />
        </Center>
      )}

      {selectedAlbum && (
        <AlbumFlipbookModal
          opened={opened}
          onClose={() => setOpened(false)}
          message="Ayon weds Noopur"
          coverImage={selectedAlbum.coverImage}
          imageUrls={selectedAlbum.imageUrls}
          backImage={selectedAlbum.backImage}
        />
      )}
    </>
  );
}
