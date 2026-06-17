import type { Node, BuiltInNode } from '@xyflow/react';

export type PositionLoggerNode = Node<{ label: string }, 'position-logger'>;
export type WhatsAppChatNode = Node<{ label: string }, 'whatsapp-chat'>;
export type FollowUpNode = Node<{ label: string }, 'followup'>;
export type AppNode = BuiltInNode | PositionLoggerNode | WhatsAppChatNode | FollowUpNode;
