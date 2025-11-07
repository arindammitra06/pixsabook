import React from "react";
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import {
  SimpleGrid,
  Stack,
  Text,
  rem,
  ActionIcon,
  Image,
  Badge,
  Center,
} from "@mantine/core";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconTrash, IconPhoto } from "@tabler/icons-react";

interface MultiImageDropzoneProps {
  photos: File[];
  setPhotos: React.Dispatch<React.SetStateAction<File[]>>;
}

function SortableImage({
  file,
  index,
  onDelete,
}: {
  file: File;
  index: number;
  onDelete: (i: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: index.toString(),
    });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    borderRadius: rem(4),
    border: "1px solid var(--mantine-color-gray-4)",
    cursor: "grab",
    position: "relative",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Image
        src={URL.createObjectURL(file)}
        alt={`photo-${index}`}
        radius="sm"
        fit="contain"
        w="100%"
        h={200}
      />
      <ActionIcon
        color="red"
        variant="filled"
        size="sm"
        style={{ position: "absolute", top: 6, right: 6, zIndex: 10 }}
        onPointerDown={(e) => e.stopPropagation()} // prevent DnD kit from blocking click
        onClick={() => onDelete(index)}
      >
        <IconTrash size={16} />
      </ActionIcon>
      <Center style={{ position: "absolute", bottom: 4, left:4, zIndex: 10 }}>
        <Badge color="green" size="xs" radius={'sm'}>
          {file.name}
        </Badge>
      </Center>
    </div>
  );
}

export default function MultiImageDropzone({
  photos,
  setPhotos,
}: MultiImageDropzoneProps) {
  const handleDrop = (files: FileWithPath[]) => {
    setPhotos((prev) => [...prev, ...files]);
  };

  const handleDelete = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = parseInt(active.id as string, 10);
    const newIndex = parseInt(over.id as string, 10);
    setPhotos(arrayMove(photos, oldIndex, newIndex));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: rem(16) }}>
      <Dropzone
        onDrop={handleDrop}
        accept={IMAGE_MIME_TYPE}
        multiple
        radius="md"
        style={{
          border: "2px dashed var(--mantine-color-gray-7)",
          height: rem(150),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack align="center" gap="xs" style={{ pointerEvents: "none" }}>
          <IconPhoto size={40} color="gray" />
          <Text size="sm" c="dimmed">
            Drag images here or click to upload
          </Text>
          <Text size="xs" c="dimmed">
            Multiple images supported
          </Text>
        </Stack>
      </Dropzone>

      {photos.length > 0 && (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={photos.map((_, i) => i.toString())}
            strategy={rectSortingStrategy}
          >
            <SimpleGrid cols={2} spacing="md">
              {photos.map((file, index) => (
                <SortableImage
                  key={index}
                  file={file}
                  index={index}
                  onDelete={handleDelete}
                />
              ))}
            </SimpleGrid>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
