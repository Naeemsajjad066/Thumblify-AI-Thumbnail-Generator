import {
  ChevronDownIcon,
  CpuIcon,
  ImageIcon,
  PenToolIcon,
  SquareIcon,
} from "lucide-react";
import { thumbnailStyles } from "../assets/assets";

const StyleSelector = ({
  value,
  onChange,
  isOpen,
  setIsOpen,
}) => {
  const styleDescriptions = {
    "Bold & Graphic": "High contrast, bold typography, striking visuals",
    "Minimalist": "Clean, simple, lots of white space",
    "Photorealistic": "Realistic photos, natural lighting, lifelike details",
    "Illustrated": "Hand-drawn, artistic, creative illustrations",
    "Tech/Futuristic": "Modern, sleek, tech-inspired",
  };

  const styleIcons = {
    "Bold & Graphic": <SquareIcon className="h-4 w-4" />,
    "Minimalist": <ImageIcon className="h-4 w-4" />,
    "Photorealistic": <ImageIcon className="h-4 w-4" />,
    "Illustrated": <PenToolIcon className="h-4 w-4" />,
    "Tech/Futuristic": <CpuIcon className="h-4 w-4" />,
  };

  return (
    <div className="relative space-y-3 dark">
      <label className="block text-sm font-medium text-zinc-200">
        Thumbnail Style
      </label>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-md border border-white/10 bg-white/8 px-4 py-3 text-left text-zinc-200 transition hover:bg-white/12"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-medium">
            {styleIcons[value]}
            <span>{value}</span>
          </div>
          <p className="text-xs text-zinc-400">
            {styleDescriptions[value]}
          </p>
        </div>

        <ChevronDownIcon
          className={`h-5 w-5 text-zinc-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown (opens UP) */}
      {isOpen && (
        <div className="absolute bottom-full z-50 mb-1 w-full rounded-md border border-white/12 bg-black/30 backdrop-blur-3xl shadow-lg">
          {thumbnailStyles.map((style) => (
            <button
              key={style}
              type="button"
              onClick={() => {
                onChange(style);
                setIsOpen(false);
              }}
              className="flex w-full items-start gap-3 px-4 py-3 text-left text-zinc-200 transition hover:bg-black/40"
            >
              <div className="mt-0.5">{styleIcons[style]}</div>
              <div>
                <p className="font-medium">{style}</p>
                <p className="text-xs text-zinc-400">
                  {styleDescriptions[style]}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StyleSelector;
