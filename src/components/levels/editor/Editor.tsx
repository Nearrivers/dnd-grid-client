import { Image, Layer, Stage } from "react-konva";
import LevelGrid from "./LevelGrid";
import { KonvaEventObject } from "konva/lib/Node";
import { useRef } from "react";
import { Layer as KonvaLayer } from "konva/lib/Layer";
import { onWheel } from "@/functions/konva/onWheel";

interface EditorProps {
  bgImage: HTMLImageElement | undefined;
  cellWidth: number;
  selected: string;
}

function Editor({ bgImage, cellWidth, selected }: EditorProps) {
  const levelGrid = useRef<KonvaLayer>(null);

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

  const centerOffset = bgImage
    ? {
        x: -((window.innerWidth - bgImage?.width) / 2),
        y: -((window.innerHeight - bgImage?.height) / 2),
      }
    : {
        x: -(window.innerWidth / 2),
        y: -(window.innerHeight / 2),
      };

  function onTouchMove(e: KonvaEventObject<TouchEvent>) {
    e.evt.preventDefault();
    const stage = e.currentTarget.getStage();

    if (!stage) {
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
    if (!levelGrid.current || !stage) {
      return;
    }

    const imgLayer = e.currentTarget;
    levelGrid.current.absolutePosition(imgLayer.absolutePosition());

    lastDist = dist;
    lastCenter = newCenter;
    stage.batchDraw();
  }

  function onTouchEnd() {
    lastDist = 0;
    lastCenter = null;
  }

  function onDragMove(e: KonvaEventObject<DragEvent>) {
    const imgLayer = e.currentTarget;
    const stage = e.currentTarget.getStage();
    if (!levelGrid.current || !stage) {
      return;
    }
    levelGrid.current.absolutePosition(imgLayer.absolutePosition());
    stage.batchDraw();
  }

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      className="absolute left-0 top-0 overflow-hidden"
    >
      <Layer
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onDragMove={onDragMove}
        onWheel={onWheel}
        draggable
        offset={centerOffset}
      >
        {bgImage && (
          <Image
            image={bgImage}
            width={bgImage?.width}
            height={bgImage?.height}
          />
        )}
      </Layer>
      <LevelGrid
        ref={levelGrid}
        cellWidth={cellWidth}
        gridWidth={bgImage?.width || 0}
        gridHeight={bgImage?.height || 0}
        gridColor={selected}
        offset={centerOffset}
      />
    </Stage>
  );
}

export default Editor;
