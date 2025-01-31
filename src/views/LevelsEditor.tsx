import { LegacyRef, useRef, useState } from "react";
import LevelImageUploadForm from "@/components/levels/LevelImageUploadForm";
import { Image, Layer, Line, Stage } from "react-konva";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import ColorPicker from "@/components/ui/color-picker";
import { Button } from "@/components/ui/button";
import { KonvaEventObject } from "konva/lib/Node";
import Konva from "konva";

interface GridProps {
  cellWidth: number;
  gridWidth: number;
  gridHeight: number;
  gridColor: string;
  offset?: { x: number; y: number };
  ref?: LegacyRef<Konva.Layer>
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

function LevelsForm() {
  const levelGrid = useRef<Konva.Layer>(null)
  const [selected, setSelected] = useState("#ffffff40");
  const [bgImage, setBgImage] = useState<HTMLImageElement>();
  const [cellWidth, setCellWidth] = useState(20);
  let imgWidth = 0,
    imgHeight = 0;

  function onUploadSuccess(file: File) {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    setBgImage(img);
  }

  const MAX_IMG_HEIGHT = 800;
  const MAX_IMG_WIDTH = 900;
  if (bgImage) {
    imgHeight =
      MAX_IMG_HEIGHT < bgImage.height ? MAX_IMG_HEIGHT : bgImage.height;
    imgWidth = MAX_IMG_WIDTH < bgImage.width ? MAX_IMG_WIDTH : bgImage.width;
  }

  type konvaOffset = { x: number; y: number };
  let lastCenter: konvaOffset | null = null;
  let lastDist = 0;
  let dragStopped = false;

  function getCenter(p1: konvaOffset, p2: konvaOffset) {
    return {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2,
    };
  }

  function getDistance(p1: konvaOffset, p2: konvaOffset) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }

  function onToucheMove(e: KonvaEventObject<TouchEvent>) {
    e.evt.preventDefault();
    const stage = e.currentTarget.getStage();

    if (!stage) {
      console.log("c'est ciao");
      return;
    }

    var touch1 = e.evt.touches[0];
    var touch2 = e.evt.touches[1];

    // we need to restore dragging, if it was cancelled by multi-touch
    if (touch1 && !touch2 && !stage.isDragging() && dragStopped) {
      stage.startDrag();
      dragStopped = false;
    }

    if (!touch1 || !touch2) {
      return;
    }

    // if the stage was under Konva's drag&drop
    // we need to stop it, and implement our own pan logic with two pointers
    if (stage.isDragging()) {
      dragStopped = true;
      stage.stopDrag();
    }

    var p1 = {
      x: touch1.clientX,
      y: touch1.clientY,
    };
    var p2 = {
      x: touch2.clientX,
      y: touch2.clientY,
    };

    if (!lastCenter) {
      lastCenter = getCenter(p1, p2);
      return;
    }
    var newCenter = getCenter(p1, p2);

    var dist = getDistance(p1, p2);

    if (!lastDist) {
      lastDist = dist;
    }

    // local coordinates of center point
    var pointTo = {
      x: (newCenter.x - stage.x()) / stage.scaleX(),
      y: (newCenter.y - stage.y()) / stage.scaleX(),
    };

    var scale = stage.scaleX() * (dist / lastDist);

    stage.scaleX(scale);
    stage.scaleY(scale);

    // calculate new position of the stage
    var dx = newCenter.x - lastCenter.x;
    var dy = newCenter.y - lastCenter.y;

    var newPos = {
      x: newCenter.x - pointTo.x * scale + dx,
      y: newCenter.y - pointTo.y * scale + dy,
    };

    stage.position(newPos);

    lastDist = dist;
    lastCenter = newCenter;
  }

  function onTouchEnd() {
    lastDist = 0;
    lastCenter = null;
  }

  function onDragMove(e: KonvaEventObject<DragEvent>) {
    const imgLayer = e.currentTarget
    const stage = e.currentTarget.getStage()
    if (!levelGrid.current || !stage) {
      return
    }
    levelGrid.current.absolutePosition(imgLayer.absolutePosition())
    stage.batchDraw()
  }

  return (
    <>
      <header className="color-picker absolute left-0 top-0 z-50 flex w-full justify-between border-b bg-background p-4 pt-6">
        <h1 className="text-3xl font-extrabold">Grille de jeu</h1>
        <div className="flex gap-2">
          <Button variant={"ghost"}>Annuler</Button>
          <Button>OK</Button>
        </div>
      </header>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        className="absolute left-0 top-0 overflow-hidden"
      >
        <LevelGrid
          cellWidth={25}
          gridWidth={window.visualViewport?.width || 0}
          gridHeight={window.visualViewport?.height || 0}
          gridColor={"#ffffff12"}
        />

        {bgImage && (
          <Layer
            onTouchMove={onToucheMove}
            onTouchEnd={onTouchEnd}
            onDragMove={onDragMove}
            draggable
            offset={{
              x: -((window.innerWidth - imgWidth) / 2),
              y: -((window.innerHeight - imgHeight) / 2),
            }}
          >
            <Image image={bgImage} width={imgWidth} height={imgHeight} />
          </Layer>
        )}
        <LevelGrid
          ref={levelGrid}
          cellWidth={cellWidth}
          gridWidth={imgWidth}
          gridHeight={imgHeight}
          gridColor={selected}
          offset={{
            x: -((window.innerWidth - imgWidth) / 2),
            y: -((window.innerHeight - imgHeight) / 2),
          }}
        ></LevelGrid>
      </Stage>
      <LevelImageUploadForm onUploadSuccess={onUploadSuccess} />
      <footer className="absolute bottom-0 left-0 z-50 w-full justify-between p-6">
        <div className="flex justify-between rounded-xl border bg-background p-4">
          <div className="grid w-1/3 gap-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="grid-size">Taille de la grille</Label>
              <p className="w-12 rounded-full bg-secondary px-2 py-1 text-right text-xs opacity-65">
                {cellWidth}px
              </p>
            </div>
            <Slider
              step={1}
              id="grid-size"
              defaultValue={[cellWidth]}
              min={1}
              max={150}
              onValueChange={(value) => {
                setCellWidth(value[0]);
              }}
            />
          </div>
          <ColorPicker value={selected} onChange={setSelected} />
        </div>
      </footer>
    </>
  );
}

export default LevelsForm;
