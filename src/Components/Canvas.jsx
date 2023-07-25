const Canvas = ({ width, height, canvasStyle, canvasRef, id }) => {
  let canvasHeight = height || document.body.clientHeight * 0.9;
  let canvasWidth = width || document.body.clientWidth * 0.9;

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
