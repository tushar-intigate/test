import { Handle, Position, NodeProps } from '@xyflow/react';
import {
    ClipboardList,
} from 'lucide-react';

type SurveyNodeData = {
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
};

export default function SurveyNode(
    props: NodeProps
) {
    const data = props.data as SurveyNodeData;

    return (
        <div className="relative w-[360px] overflow-hidden rounded-3xl border border-violet-200 bg-white shadow-xl">
            {/* Input */}
            <Handle
                type="target"
                position={Position.Top}
                className="!h-4 !w-4 !border-2 !border-white !bg-violet-500"
            />

            <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-4 py-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                        <ClipboardList
                            size={20}
                            className="text-white"
                        />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">
                            {data.surveyTitle || 'Customer Survey'}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Output */}
            <Handle
                type="source"
                position={Position.Bottom}
                className="!h-4 !w-4 !border-2 !border-white !bg-violet-500"
            />
        </div>
    );
}