import { Handle, Position, NodeProps } from '@xyflow/react';
import {
    ClipboardList, BadgeCheck,
} from 'lucide-react';

type QuestionItem = {
    label: string;
    variable: string;
};

type SurveyNodeData = {
    surveyTitle?: string;
    questions?: QuestionItem[];
    answers?: Record<string, string>;

    onAnswerChange?: (
        nodeId: string,
        question: string,
        value: string
    ) => void;
};

export default function SurveyNode(
    props: NodeProps
) {
    const data = props.data as SurveyNodeData;

    const questions: QuestionItem[] =
        data.questions || [
            {
                label: 'What is your name?',
                variable: 'name',
            },
            {
                label: 'What is your email?',
                variable: 'email',
            },
            {
                label: 'What is your phone number?',
                variable: 'phone',
            },
            {
                label: 'What city are you from?',
                variable: 'city',
            },
        ];

    const answers = data.answers || {};

    const handleAnswerChange = (variable: string, value: string) => {
        data.onAnswerChange?.(props.id, variable, value);
    };

    return (
        <div className="relative w-[420px] overflow-hidden rounded-3xl border border-green-200 bg-white shadow-xl">
            {/* Input Handle */}
            <Handle
                type="target"
                position={Position.Top}
                className="!h-4 !w-4 !border-2 !border-white !bg-green-500"
            />

            {/* Header */}
            <div className="bg-[#075E54] px-4 py-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                        <ClipboardList
                            size={20}
                            className="text-white"
                        />
                    </div>

                    <div>
                        <h3 className="font-semibold text-white">
                            Customer Survey
                        </h3>

                        <div className="flex items-center gap-1 text-xs text-green-100">
                            <BadgeCheck size={12} />
                            WhatsApp Survey
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="max-h-[500px] overflow-y-auto bg-[#ECE5DD] p-4 space-y-4">
                {questions.map((question) => (
                    <div
                        key={question.variable}
                        className="space-y-2"
                    >
                        {/* Question Bubble */}
                        <div className="flex justify-start">
                            <div className="max-w-[80%] rounded-2xl rounded-tl-md bg-white px-4 py-3 shadow">
                                <p className="text-sm text-slate-800">
                                    {question.label}
                                </p>
                            </div>
                        </div>

                        {/* Answer Input */}
                        <div className="flex justify-end">
                            <input
                                type="text"
                                placeholder={`Enter ${question.variable}`}
                                value={
                                    answers[
                                    question.variable
                                    ] || ''
                                }
                                onChange={(e) =>
                                    handleAnswerChange(
                                        question.variable,
                                        e.target.value
                                    )
                                }
                                className="w-[260px] rounded-2xl rounded-tr-md border border-green-200 bg-[#DCF8C6] px-4 py-3 text-sm outline-none focus:border-green-500"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Output Handle */}
            <Handle
                type="source"
                position={Position.Bottom}
                className="!h-4 !w-4 !border-2 !border-white !bg-green-500"
            />
        </div>
    );
}