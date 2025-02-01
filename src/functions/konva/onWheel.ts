import { KonvaEventObject } from "konva/lib/Node";

export function onWheel(e: KonvaEventObject<WheelEvent>) {
  const scaleBy = 1.5;
  e.evt.preventDefault();
  const stage = e.currentTarget.getStage()

  if (!stage) {
    return;
  }

  var oldScale = stage.scaleX();

  var center = {
    x: stage.width() / 2,
    y: stage.height() / 2,
  };

  var relatedTo = {
    x: (center.x - stage.x()) / oldScale,
    y: (center.y - stage.y()) / oldScale,
  };

  var newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

  stage.scale({
    x: newScale,
    y: newScale,
  });

  var newPos = {
    x: center.x - relatedTo.x * newScale,
    y: center.y - relatedTo.y * newScale,
  };

  stage.position(newPos);
  stage.batchDraw();
}