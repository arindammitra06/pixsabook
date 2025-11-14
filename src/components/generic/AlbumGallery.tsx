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
import { successAlert, errorAlert } from "@/utils/alert.util";
import { nprogress } from "@mantine/nprogress";
import CornerRibbon from "./CornerRibbon";
import { isWithinLast7Days } from "@/utils/utils";
import EmptyState from "./empty-state.component";
import { modals } from "@mantine/modals";
import { fetchUserById } from "@/store/slices/authenticate.slice";
import { useRouter } from "next/navigation";

export default function AlbumGallery(props) {
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const { isLoading, albums } = useAppSelector((state) => state.album);
  const dispatch = useAppDispatch();
 const router = useRouter();
  const [opened, setOpened] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<any | null>(null);
  const [inviteeModalOpened, setInviteeModalOpened] = useState(false);
  const [inviteeAlbum, setInviteeAlbum] = useState<any | null>(null);

  const getAlbums = () => {
    dispatch(
      getAlbumsByUserId({ userId: currentUser!.id!, pageType: props.pageType }),
    );
  };

  useEffect(() => {
    if (currentUser) {
      getAlbums();
    }
  }, [currentUser, dispatch]);

  const openAlbum = (album: any) => {
    setSelectedAlbum(album);
    setOpened(true);
  };

  const openInviteeModal = (album: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setInviteeAlbum(album);
    setInviteeModalOpened(true);
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

  function onEditClick(album) {
    router.push(`/home/create?albumId=${album.id}`);
  }

  const publishOrDeleteAlbum = (
    albumId: number,
    fieldName: string,
    action: string,
  ) => {
    nprogress.reset();
    nprogress.start();
    dispatch(
      updateAlbumByField({
        albumId,
        fieldname: fieldName,
        fieldValue: action,
        currentUserId: currentUser!.id!,
      }),
    ).then((res: any) => {
      dispatch(fetchUserById({ id: currentUser!.id! })).then(() => {
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
      ) : albums && albums.length > 0 ? (
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
                <Box pos="relative">
                  {album.active.toString() === "No" ? (
                    <CornerRibbon
                      position="top-left"
                      fontColor="red"
                      backgroundColor="yellow"
                      style={{ fontWeight: 900, fontSize: "9px" }}
                    >
                      {t("deleted")}
                    </CornerRibbon>
                  ) : (
                    isWithinLast7Days(album.createdAt) && (
                      <CornerRibbon
                        position="top-left"
                        fontColor="#f0f0f0"
                        backgroundColor="red"
                        style={{ fontWeight: 900, fontSize: "9px" }}
                      >
                        {t("new")}
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

                  {currentUser &&
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

                          <Menu.Item 
                          onClick={(e) => {
                              e.stopPropagation();
                              onEditClick(album);
                            }}
                          leftSection={<IconEdit size={14} />}>
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

                 {(currentUser!.id! === album.clientId 
                 || currentUser?.userType.toString()==='Admin' || currentUser?.userType.toString()==='Editor')
                    && <ActionIcon
                    variant="light"
                    color="gray"
                    radius="xl"
                    onClick={(e) => openInviteeModal(album, e)}
                  >
                    <IconUsersPlus size={18} color="teal" />
                  </ActionIcon>
                  }
                  
                </Group>
                <TimeAgo
                  date={new Date(album.createdAt)}
                  render={({ value }) => (
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

      {inviteeAlbum && (
        <UpdateInviteesModalComponent
          header={t("update-invitation-list")}
          message=""
          onNoClick={() => setInviteeModalOpened(false)}
          onYesClick={() => {
            setInviteeModalOpened(false);
            getAlbums();
          }}
          formProps={{
            albumId: inviteeAlbum.id,
            inviteeList: inviteeAlbum.viewers
              ? inviteeAlbum.viewers.map((u) => u.email)
              : [],
          }}
          opened={inviteeModalOpened}
          onClose={() => setInviteeModalOpened(false)}
        />
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
