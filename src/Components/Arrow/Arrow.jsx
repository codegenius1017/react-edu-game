export const Arrow = ({onClick, direction}) => {
  return (
    <div onClick={() => onClick(direction)}>
      <img src={`${process.env.PUBLIC_URL}/images/others/${direction === "left"? "arrow_left.png" : "arrow_right.png"}`} alt={direction === "left"? "«" : "»"} />
    </div>
  )
}