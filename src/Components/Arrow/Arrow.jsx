export const Arrow = ({ onClick, direction, style }) => {
  return (
    <div onClick={() => onClick(direction)} style={style}>
      <img
        src={`${process.env.PUBLIC_URL}/images/others/${
          direction === "left" ? "arrow_left.png" : "arrow_right.png"
        }`}
        alt={direction === "left" ? "«" : "»"}
        style={{ maxHeight: "100%" }}
      />
    </div>
  );
};
