import { useState } from "react";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function StarReview() {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleRate = (r: number) => {
    setRating(r);
    setSubmitted(true);
    toast({ title: "Thanks for your rating!", description: `You gave ${r} star${r > 1 ? "s" : ""}.` });
  };

  return (
    <div className="text-center py-10 border-t border-border">
      <h3 className="text-lg font-bold text-foreground mb-2">Rate ChurnSense AI</h3>
      <p className="text-sm text-muted-foreground mb-4">
        {submitted ? "Thank you for your feedback!" : "How would you rate your experience?"}
      </p>
      <div className="flex items-center justify-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRate(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="p-1 transition-transform duration-200 hover:scale-125"
          >
            <Star
              className={`h-8 w-8 transition-colors duration-200 ${
                star <= (hoveredRating || rating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-muted-foreground/30"
              }`}
            />
          </button>
        ))}
      </div>
      {submitted && (
        <p className="text-xs text-primary mt-2 animate-fade-in">
          {rating >= 4 ? "Glad you enjoyed it! ⭐" : rating >= 2 ? "Thanks! We'll keep improving." : "Sorry to hear that. We'll do better!"}
        </p>
      )}
    </div>
  );
}
