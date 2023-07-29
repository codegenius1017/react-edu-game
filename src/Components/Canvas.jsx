const Canvas = ({ width, height, canvasStyle, canvasRef, id }) => {
  let canvasHeight = height;
  let canvasWidth = width;

  return (
    <canvas
      width={canvasWidth}
      height={canvasHeight}
      style={canvasStyle}
      ref={canvasRef}
      id={id}
    >
      Navegador sem suporte ao canvas ;( tente usar o google
    </canvas>
  );
};

export default Canvas;
