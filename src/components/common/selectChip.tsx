type SelectChipProps = {
  label: string;
  initiallySelected?: boolean;
  onClick: () => void;
  selected?: boolean;
};

export default function SelectChip({
  label,
  onClick,
  selected,
}: SelectChipProps) {
  return (
    <span
      onClick={() => {
        onClick();
      }}
      className={
        "cursor-pointer rounded-full bg-main-400 px-2 py-1 text-sm font-bold text-main-800 hover:bg-main-500" +
        (selected ? " bg-main-500" : "")
      }
    >
      {label}
    </span>
  );
}
