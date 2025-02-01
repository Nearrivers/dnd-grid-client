import { Layer as KonvaLayer } from "konva/lib/Layer";
import { LegacyRef } from "react";
import { Layer, Line } from "react-konva";

interface GridProps {
  cellWidth: number;
  gridWidth: number;
  gridHeight: number;
  gridColor: string;
  offset?: { x: number; y: number };
  ref?: LegacyRef<KonvaLayer>;
}

function LevelGrid(props: GridProps) {
  const verticalLines = [];
  const horizontalLines = [];

  for (let i = 0; i < props.gridWidth / props.cellWidth; i++) {
    verticalLines.push(
      <Line
        key={i}
        strokeWidth={2}
        stroke={props.gridColor}
        points={[i * props.cellWidth, 0, i * props.cellWidth, props.gridHeight]}
        offset={props.offset}
      />,
    );
  }

  for (let i = 0; i < props.gridHeight / props.cellWidth; i++) {
    horizontalLines.push(
      <Line
        key={i}
        strokeWidth={2}
        stroke={props.gridColor}
        points={[0, i * props.cellWidth, props.gridWidth, i * props.cellWidth]}
        offset={props.offset}
      />,
    );
  }

  return (
    <Layer ref={props.ref}>
      {verticalLines}
      {horizontalLines}
    </Layer>
  );
}

export default LevelGrid