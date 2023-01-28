type LabelChipProps = {
  label: string;
};

export default function LabelChip({ label }: LabelChipProps) {
  return (
    <span
      className={
        "rounded-full bg-main-400 px-2 py-1 text-sm font-bold text-main-800"
      }
    >
      {label}
    </span>
  );
}
