import React from "react";
import { ActionIcon,Avatar,HoverCard,Text } from "@mantine/core";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleLikeOptimistic } from "@/store/slices/album.slice";
import { AnimatedHeart } from "./heart";
import { t } from "i18next";
interface LikeButtonProps {
  albumId: number;
}

const LikeButton: React.FC<LikeButtonProps> = ({ albumId }) => {
  const dispatch = useAppDispatch();
  const album = useAppSelector((state) =>
    state.album.albums.find((a) => a.id === albumId),
  );
  const email = useAppSelector((state) => state.auth.currentUser?.email);

  if (!album) return null;

  const isLiked = album.likesByEmail?.includes(email ?? "") ?? false;

  const handleToggleLike = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent album click
    if (!email) {
      alert("Please log in to like albums.");
      return;
    }
    dispatch(toggleLikeOptimistic({ albumId, email }));
  };

  return (
    <HoverCard withArrow openDelay={100} shadow="md" >
      <HoverCard.Target >
        <ActionIcon
          onClick={handleToggleLike}
          variant={isLiked ? "transparent" : "light"}
          color={isLiked ? "red" : "gray"}
          radius="xl"
          aria-label="Like album"
        >
          {isLiked ? <IconHeartFilled size={22} /> : <IconHeart size={18} color="red"/>}
        </ActionIcon>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        {album.likesByEmail == null || album.likesByEmail.length === 0 ? (
          <Text size="sm" c="dimmed">
            {t('no-likes-yet')}
          </Text>
        ) : (
          <Avatar.Group p={0} spacing="xs">
            {album.likesByEmail.map((email) => (
              <Avatar key={email} name={email} color="initials" />
            ))}
          </Avatar.Group>
        )}
      </HoverCard.Dropdown>
    </HoverCard>
  );
};

export default LikeButton;
