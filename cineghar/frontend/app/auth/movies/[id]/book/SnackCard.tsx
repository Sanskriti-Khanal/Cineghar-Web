"use client";

import type { SnackItem } from "./snack-data";

const VegIcon = () => (
  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-green-400 bg-green-500/20 text-[10px] font-bold text-green-300" title="Veg">
    V
  </span>
);
const NonVegIcon = () => (
  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-red-400 bg-red-500/20 text-[10px] font-bold text-red-300" title="Non-Veg">
    NV
  </span>
);

interface SnackCardProps {
  item: SnackItem;
  quantity: number;
  onAdd: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}

export default function SnackCard({ item, quantity, onAdd, onIncrement, onDecrement }: SnackCardProps) {
  const isInCart = quantity > 0;

  return (
    <div
      className={`rounded-xl border p-3 transition-all duration-200 ${
        isInCart
          ? "border-[#8B0000] bg-[#8B0000]/15 shadow-[0_0_20px_rgba(139,0,0,0.25)]"
          : "border-white/10 bg-white/5 hover:border-[#8B0000]/50 hover:bg-white/10"
      }`}
    >
      <div className="flex gap-3">
        <div className="flex h-16 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/10 text-2xl text-white/30">
          {item.category === "beverage" ? "🥤" : item.category === "nonveg" ? "🍗" : "🍿"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                {item.category === "veg" && <VegIcon />}
                {item.category === "nonveg" && <NonVegIcon />}
                <h3 className="text-sm font-semibold text-white truncate">{item.name}</h3>
              </div>
              <p className="mt-0.5 text-[11px] text-gray-400 line-clamp-2">{item.description}</p>
            </div>
            <p className="text-sm font-semibold text-white whitespace-nowrap">NPR {item.price}</p>
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            {!isInCart ? (
              <button
                type="button"
                onClick={onAdd}
                className="rounded-lg bg-[#8B0000] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#a00000] transition-colors"
              >
                Add
              </button>
            ) : (
              <div className="flex items-center gap-1 rounded-lg border border-white/20 bg-black/30 p-1">
                <button
                  type="button"
                  onClick={onDecrement}
                  className="flex h-6 w-6 items-center justify-center rounded text-white hover:bg-white/10 text-sm font-medium"
                >
                  −
                </button>
                <span className="min-w-[1.25rem] text-center text-xs font-semibold text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={onIncrement}
                  className="flex h-6 w-6 items-center justify-center rounded text-white hover:bg-white/10 text-sm font-medium"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
