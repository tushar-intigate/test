import type { NodeTypes } from '@xyflow/react';
import KeywordNode from './KeywordNode.tsx';
import MasterComponentNode from './MasterComponentNode.tsx';

export const initialNodes = [];

export const nodeTypes = {
  keywordBox: KeywordNode,
  masterComponent: MasterComponentNode,
} satisfies NodeTypes;