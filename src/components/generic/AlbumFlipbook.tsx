import React, { forwardRef, useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import {
  ActionIcon,
  Box,
  Image,
  Modal,
  ScrollArea,
  Transition,
} from "@mantine/core";
import {
  IconMinimize,
  IconMaximize,
  IconArrowLeft,
  IconArrowRight,
  IconX
} from "@tabler/icons-react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

interface AlbumFlipbookModalProps {
  opened: boolean;
  onClose: () => void;
  message?: string;
  coverImage: string;
  imageUrls: string[];
  backImage?: string;
}

const Page = forwardRef<
  HTMLDivElement,
  { src: string; side: "left" | "right" }
>(({ src }, ref) => (
  <Box
    ref={ref}
    style={{
      width: "100%",
      height: "100%",
      backgroundColor: "#011627",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
    }}
  >
    <Image
      src={src}
      alt="album page"
      radius={0}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
        objectPosition: "center center",
      }}
    />
  </Box>
));
Page.displayName = "Page";

export const AlbumFlipbookModal: React.FC<AlbumFlipbookModalProps> = ({
  opened,
  onClose,
  message = "Album Flipbook",
  coverImage,
  imageUrls,
  backImage,
}) => {
  const [bookSize, setBookSize] = useState({ width: 500, height: 600 });
  const flipbookRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showHeader, setShowHeader] = useState(false);
  const handle = useFullScreenHandle();

  // ✅ Responsive sizing logic
  useEffect(() => {
    const updateSize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Base width = 90% of viewport width
      let width = vw * 0.50;
      let height = width * (3 / 4); // maintain aspect ratio

      // Limit max width for huge screens
      if (width > 1000) width = 1000;
      height = width * (3 / 4);

      // Ensure it fits within viewport height
      if (height > vh * 0.85) {
        height = vh * 0.85;
        width = height * (4 / 3);
      }

      setBookSize({ width, height });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const flipNext = () => flipbookRef.current?.pageFlip()?.flipNext();
  const flipPrev = () => flipbookRef.current?.pageFlip()?.flipPrev();
  const flipTo = (index: number) => {
    flipbookRef.current?.pageFlip()?.flip(index);
  };
  
  // Toggle header only when clicking blank area
  const handleBodyClick = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    // Ignore clicks inside flipbook
    if ((e.target as HTMLElement).closest(".album-flipbook")) return;
    // Ignore clicks inside header
    if ((e.target as HTMLElement).closest(".header-controls")) return;

    setShowHeader((prev) => !prev);
  };

  const pages: string[] = [coverImage, ...imageUrls];
  if (backImage) pages.push(backImage);

  return (
    <Modal.Root
      opened={opened}
      onClose={onClose}
      centered
      styles={{
        content: {
          backgroundColor: "#011627",
          padding: 0,
          margin: 0,
        },
        header: {
          backgroundColor: "#011627",
          color: "white",
        },
        title: {
          color: "white",
        },
        body: {
          padding: 0,
          margin: 0,
          backgroundColor: "#011627",
          height: "85vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        },
      }}
      fullScreen
      radius={0}
      onClick={handleBodyClick}
    >
      <Modal.Overlay />
      <FullScreen handle={handle}>
      <Modal.Content>
        <Modal.Header>
          <Transition mounted={showHeader} transition="fade" duration={200}>
            {(styles) => (
              <Box
                className="header-controls"
                style={{
                  ...styles,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 65,
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#011627",
                  zIndex: 0,
                  padding: "4px 4px",
                  gap: 4,
                }}
              >
                <ActionIcon variant="filled" color="#2b43574f" size="md" radius="lg">
                  {handle.active ? (
                    <IconMinimize color="white" onClick={handle.exit}/>
                  ) : (
                    <IconMaximize color="white" onClick={handle.enter}/>
                  )}
                </ActionIcon>

                <ActionIcon onClick={flipPrev} variant="filled" color="#2b43574f" size="md" radius="lg">
                  <IconArrowLeft color="white" />
                </ActionIcon>

                <ScrollArea style={{ flex: 1 }} type="auto" offsetScrollbars 
                overscrollBehavior="contain" scrollbarSize={8} scrollHideDelay={3000}>
                  <Box
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                      padding: "0 4px",
                    }}
                  >
                    {pages.map((p, idx) => (
                      <Box
                        key={idx}
                        onClick={() => flipTo(idx)}
                        style={{
                          width: 80,
                          height: 50,
                          cursor: "pointer",
                          flexShrink: 0,
                        }}
                      >
                        <Image
                          src={p}
                          alt={`thumb-${idx}`}
                          width={80}
                          height={50}
                          fit="cover"
                          radius="sm"
                        />
                      </Box>
                    ))}
                  </Box>
                </ScrollArea>

                <ActionIcon onClick={flipNext} variant="filled" color="#2b43574f" size="md" radius="lg">
                  <IconArrowRight color="white" />
                </ActionIcon>

                <ActionIcon onClick={onClose} variant="filled" color="#2b43574f" size="md" radius="lg">
                  <IconX color="white" />
                </ActionIcon>
              </Box>
            )}
          </Transition>
        </Modal.Header>
        <Modal.Body>
          <Box
            ref={containerRef}
            style={{
              width: "100vw",
              height: "calc(100vh - 60px)", // leaves room for header
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#011627",
              overflow: "hidden",
            }}
          >
            <HTMLFlipBook
              ref={flipbookRef}
              width={bookSize.width}
              height={bookSize.height}
              showCover
              className="album-flipbook"
              style={{
                margin: "auto",
                backgroundColor: "#011627",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              flippingTime={600}
              usePortrait={false}
              autoSize
              clickEventForward={false}
              useMouseEvents
              swipeDistance={10}
              showPageCorners
              disableFlipByClick={false}
              size="fixed"
              drawShadow={false}
              startZIndex={0}
              maxShadowOpacity={0}
              mobileScrollSupport={true}
              startPage={0}
              minWidth={0}
              maxWidth={0}
              minHeight={0}
              maxHeight={0}
            >
              {pages.map((src, i) => (
                <Page key={i} src={src} side={i % 2 === 0 ? "right" : "left"} />
              ))}
            </HTMLFlipBook>
          </Box>
        </Modal.Body>
      </Modal.Content>
      </FullScreen>
    </Modal.Root>
    // <Modal
    //   opened={opened}
    //   onClose={onClose}
    //   title={message}
    //   centered
    //   fullScreen
    //   radius={0}
    //   onClick={handleBodyClick}
    //   styles={{
    //     content: {
    //       backgroundColor: "black",
    //       padding: 0,
    //       margin: 0,
    //     },
    //     header: {
    //       backgroundColor: "black",
    //       color: "white",
    //       borderBottom: "1px solid #222",
    //     },
    //     title: {
    //       color: "white",
    //     },
    //     body: {
    //       padding: 0,
    //       margin: 0,
    //       backgroundColor: "black",
    //       height: "90vh",
    //       display: "flex",
    //       alignItems: "center",
    //       justifyContent: "center",
    //       overflow: "hidden",
    //     },
    //   }}
    // >

    // </Modal>
  );
};
