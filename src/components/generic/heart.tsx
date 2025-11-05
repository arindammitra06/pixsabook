import { ActionIcon } from "@mantine/core";
import { IconHeartFilled, IconHeart } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

interface AnimatedHeartProps {
  isLiked?: boolean;
  onToggle?: () => void;
  size?: number;
}

export function AnimatedHeart({ isLiked = false, onToggle, size = 28 }: AnimatedHeartProps) {
  const [animating, setAnimating] = useState(false);

  return (
    <ActionIcon
      variant="subtle"
      color={isLiked ? "red" : "gray"}
      radius="xl"
      onClick={(e) => {
        e.stopPropagation();
        setAnimating(true);
        onToggle?.();
        setTimeout(() => setAnimating(false), 400); // reset animation after 0.4s
      }}
      style={{ position: "relative", width: size + 10, height: size + 10 }}
    >
      <AnimatePresence>
        {animating && (
          <motion.div
            key="burst"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.6, opacity: 0.8 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconHeartFilled color="red" size={size + 10} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        key={isLiked ? "filled" : "outline"}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {isLiked ? (
          <IconHeartFilled size={size} color="red" />
        ) : (
          <IconHeart size={size} color="gray" />
        )}
      </motion.div>
    </ActionIcon>
  );
}