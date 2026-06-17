import { Handle, Position, NodeProps } from '@xyflow/react';
import {
  ClipboardList,
} from 'lucide-react';

type FeedbackNodeData = {
  label?: string;
  surveyTitle?: string;
  question?: string;
  variable?: string;
  required?: boolean;

  questionType?:
  | 'text'
  | 'single-choice'
  | 'multi-choice';

  options?: string[];

  answers?: Record<string, string>;

  onAnswerChange?: (
    nodeId: string,
    variable: string,
    value: string
  ) => void;
};

export default function FeedbackNode(
  props: NodeProps
) {
  const data = props.data as FeedbackNodeData;

  const variable =
    data.variable || 'feedback';

  const answers =
    data.answers || {};

  const feedback =
    answers[variable] || '';

  const options = data.options || [
    'Very Satisfied',
    'Satisfied',
    'Neutral',
    'Dissatisfied',
  ];

  const handleFeedbackChange = (
    value: string
  ) => {
    data.onAnswerChange?.(
      props.id,
      variable,
      value
    );
  };

  return (
    <div className="relative w-[380px] overflow-hidden rounded-3xl border border-green-200 bg-white shadow-xl">

      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="!h-4 !w-4 !border-2 !border-white !bg-[#25D366]"
      />

      {/* WhatsApp Header */}
      <div className="bg-[#075E54] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
            <ClipboardList
              size={20}
              className="text-white"
            />
          </div>

          <div>
            <h3 className="font-semibold text-white">
              {data.surveyTitle ||
                'Customer Feedback'}
            </h3>

            <p className="text-xs text-green-100">
              online
            </p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="bg-[#ECE5DD] p-4 space-y-4">

        {/* Bot Message */}
        <div className="flex justify-start">
          <div className="max-w-[80%] rounded-2xl rounded-tl-md bg-white px-4 py-3 shadow">
            <p className="text-sm text-slate-800">
              {data.question ||
                'How satisfied are you with our service?'}
            </p>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-2">
          {options.map((option) => (
            <label
              key={option}
              className="block cursor-pointer"
            >
              <input
                type="radio"
                name={`feedback-${props.id}`}
                checked={
                  feedback === option
                }
                onChange={() =>
                  handleFeedbackChange(
                    option
                  )
                }
                className="hidden"
              />

              <div
                className={`ml-auto max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow transition
            ${feedback === option
                    ? 'bg-[#DCF8C6] border border-green-400'
                    : 'bg-white border border-slate-200'
                  }`}
              >
                {option}
              </div>
            </label>
          ))}
        </div>

        {/* Selected Response */}
        {feedback && (
          <div className="flex justify-end">
            <div className="max-w-[75%] rounded-2xl rounded-tr-md bg-[#DCF8C6] px-4 py-3 shadow">
              <p className="text-sm font-medium text-slate-800">
                {feedback}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-4 !w-4 !border-2 !border-white !bg-[#25D366]"
      />
    </div>
  );
}