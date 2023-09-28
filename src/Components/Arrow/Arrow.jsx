

export const Arrow = ({onClick, direction}) => {
  return (
    <div onClick={() => onClick(direction)}>
      <img src={`images/others/${direction === "left"? "arrow_left" : "arrow_right"}`} alt={direction === "left"? "«" : "»"} />
    </div>
  )
}