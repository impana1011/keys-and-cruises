import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number; // 0 to 5
  count?: number | undefined;
  size?: number | undefined;
  interactive?: boolean | undefined;
  onRatingChange?: ((rating: number) => void) | undefined;
  showText?: boolean | undefined;
}

export function StarRating({
  rating,
  count,
  size = 14,
  interactive = false,
  onRatingChange,
  showText = true,
}: StarRatingProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = rating >= star;
          const isHalf = !isFilled && rating >= star - 0.5;

          return (
            <button
              key={star}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onRatingChange?.(star)}
              className={`${interactive ? "cursor-pointer hover:scale-110 transition-transform p-0.5" : "cursor-default p-0"}`}
              title={`${star} stars`}
            >
              <Star
                size={size}
                className={`${
                  isFilled
                    ? "fill-amber-400 text-amber-400"
                    : isHalf
                    ? "fill-amber-200 text-amber-400"
                    : "fill-muted/40 text-muted-foreground/40"
                }`}
              />
            </button>
          );
        })}
      </div>
      {showText && (
        <span className="text-xs font-semibold text-foreground">
          {rating.toFixed(1)}
          {typeof count === "number" && (
            <span className="font-normal text-muted-foreground ml-1">({count})</span>
          )}
        </span>
      )}
    </div>
  );
}
