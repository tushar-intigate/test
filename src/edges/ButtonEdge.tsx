import { BaseEdge, EdgeLabelRenderer, getBezierPath, useReactFlow } from '@xyflow/react';

export default function ButtonEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: any) {
  const { setEdges } = useReactFlow();
  
  // Calculate the path and the label position (center of the edge)
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = (evt: React.MouseEvent) => {
    evt.stopPropagation();
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            // EdgeLabelRenderer is outside the React Flow flow layer, 
            // so we need pointerEvents: all to allow interaction.
            pointerEvents: 'all',
          }}
          className="nodrag nopan flex items-center justify-center group"
        >
          <button
            className="w-4 h-4 bg-white border border-rose-300 text-rose-500 rounded-full flex items-center justify-center text-xs shadow-sm opacity-0 group-hover:opacity-100 transition-all cursor-pointer hover:bg-rose-50 hover:scale-110"
            onClick={onEdgeClick}
            title="Remove Connection"
          >
            ×
          </button>
          {/* Invisible hit area to make hovering easier */}
          <div className="absolute inset-[-10px] z-[-1]" />
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
