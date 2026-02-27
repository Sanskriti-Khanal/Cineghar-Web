"use client";

import type { SnackCombo } from "./snack-data";

interface ComboCardProps {
  combo: SnackCombo;
  quantity: number;
  onAdd: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}

export default function ComboCard({ combo, quantity, onAdd, onIncrement, onDecrement }: ComboCardProps) {
  const isInCart = quantity > 0;

  return (
    <div
      className={`rounded-2xl border p-4 transition-all duration-200 ${
        isInCart
          ? "border-[#8B0000] bg-[#8B0000]/15 shadow-[0_0_24px_rgba(139,0,0,0.3)]"
          : "border-white/15 bg-gradient-to-br from-white/5 to-black/40 hover:border-[#8B0000]/50"
      }`}
    >
      <div className="flex gap-4">
        <div className="flex h-24 w-28 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#8B0000]/30 to-black/50 text-3xl text-white/40">
          🎬
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {combo.discountLabel && (
              <span className="rounded-full bg-[#8B0000] px-2 py-0.5 text-[10px] font-semibold text-white">
                {combo.discountLabel}
              </span>
            )}
          </div>
          <h3 className="mt-1 text-base font-semibold text-white">{combo.name}</h3>
          <p className="mt-0.5 text-xs text-gray-400">{combo.itemsPreview}</p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-white">NPR {combo.price}</span>
              {combo.originalPrice != null && (
                <span className="text-xs text-gray-500 line-through">NPR {combo.originalPrice}</span>
              )}
            </div>
            {!isInCart ? (
              <button
                type="button"
                onClick={onAdd}
                className="rounded-xl bg-gradient-to-r from-[#8B0000] to-[#A00000] px-4 py-2 text-xs font-semibold text-white shadow-lg hover:opacity-90 transition-opacity"
              >
                Add combo
              </button>
            ) : (
              <div className="flex items-center gap-1 rounded-lg border border-white/20 bg-black/30 px-2 py-1.5">
                <button
                  type="button"
                  onClick={onDecrement}
                  className="flex h-7 w-7 items-center justify-center rounded text-white hover:bg-white/10 text-sm font-medium"
                >
                  −
                </button>
                <span className="min-w-[1.5rem] text-center text-sm font-semibold text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={onIncrement}
                  className="flex h-7 w-7 items-center justify-center rounded text-white hover:bg-white/10 text-sm font-medium"
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
