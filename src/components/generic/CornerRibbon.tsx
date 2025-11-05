import React from "react";

interface CornerRibbonProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  fontColor?: string;
  backgroundColor?: string;
  containerStyle?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
}

const CornerRibbon: React.FC<CornerRibbonProps> = ({
  children,
  style,
  backgroundColor = "#2c7",
  fontColor = "#f0f0f0",
  position = "top-right",
  containerStyle: userContainerStyle,
  className,
  ...rest
}) => {
  let positionStyle: React.CSSProperties = {};

  switch (position) {
    case "top-left":
      positionStyle = {
        top: 0,
        left: 0,
        transform:
          "translateY(-100%) rotate(-90deg) translateX(-70.71%) rotate(45deg)",
        transformOrigin: "bottom left",
      };
      break;
    case "top-right":
      positionStyle = {
        top: 0,
        right: 0,
        transform:
          "translateY(-100%) rotate(90deg) translateX(70.71%) rotate(-45deg)",
        transformOrigin: "bottom right",
      };
      break;
    case "bottom-left":
      positionStyle = {
        bottom: 0,
        left: 0,
        transform:
          "translateY(100%) rotate(90deg) translateX(-70.71%) rotate(-45deg)",
        transformOrigin: "top left",
      };
      break;
    case "bottom-right":
      positionStyle = {
        bottom: 0,
        right: 0,
        transform:
          "translateY(100%) rotate(-90deg) translateX(70.71%) rotate(45deg)",
        transformOrigin: "top right",
      };
      break;
  }

  const computedStyle: React.CSSProperties = {
    position: "absolute",
    padding: "0.1em 2em",
    zIndex: 99,
    textAlign: "center",
    letterSpacing: "2px",
    fontSize: "14px",
    boxShadow: "0 0 3px rgba(0,0,0,.3)",
    backgroundColor,
    color: fontColor,
    pointerEvents: "auto",
    ...positionStyle,
    ...style,
  };

  const containerStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    overflow: "hidden",
    backgroundColor: "transparent",
    pointerEvents: "none",
    ...userContainerStyle,
  };

  return (
    <div style={containerStyle} className={className} {...rest}>
      <div style={computedStyle}>{children}</div>
    </div>
  );
};

export default CornerRibbon;
