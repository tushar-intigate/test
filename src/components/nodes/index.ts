import type { NodeTypes } from '@xyflow/react';
import StartNode from './StartNode.tsx';
import QuestionNode from './QuestionNode.tsx';
import EndNode from './EndNode.tsx';
import KeywordNode from './KeywordNode.tsx';
import MasterComponentNode from './MasterComponentNode.tsx';

export const initialNodes = [
  {
    id: '1',
    type: 'startNode',
    position: { x: 0, y: 50 },
    data: {
      label: 'Start Flow',
      question:"Welcome to the survey! Please click 'Next' to begin.",
    },
  },

  {
    id: '2',
    type: 'questionNode',
    position: { x: 500, y: 50 },
    data: {
      "answers": {}
    },
  },

  {
    id: '3',
    type: 'endNode',
    position: { x: 1000, y: 50 },
    data: {
      label: 'End Flow',
      answers: {},
    },
  },
];

export const nodeTypes = {
  startNode: StartNode,
  questionNode: QuestionNode,
  endNode: EndNode,
  keywordBox: KeywordNode,
  masterComponent: MasterComponentNode,
} satisfies NodeTypes;