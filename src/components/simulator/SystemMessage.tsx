export default function SystemMessage({ text }: { text: string }) {
  return (
    <div className="flex justify-center my-1">
      <div className="bg-[#ffffffbb] text-[#5f6368] rounded-lg px-3 py-1 text-[10px] font-medium shadow-sm max-w-[85%] text-center">
        {text}
      </div>
    </div>
  );
}
