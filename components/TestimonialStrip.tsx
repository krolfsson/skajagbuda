import { pickTestimonial } from "@/lib/testimonials";

type TestimonialStripProps = {
  /** Vilket citat som visas (0–2). Olika index på olika platser ger variation utan slump. */
  index?: number;
  className?: string;
};

export function TestimonialStrip({ index = 0, className }: TestimonialStripProps) {
  const { quote, author } = pickTestimonial(index);

  return (
    <figure
      className={["testimonial-strip", className].filter(Boolean).join(" ")}
      aria-label={`Omdöme från ${author}`}
    >
      <div className="testimonial-strip__stars" aria-hidden="true">
        ★★★★★
      </div>
      <blockquote className="testimonial-strip__quote">
        <p>
          <em>&ldquo;{quote}&rdquo;</em>
          <span className="testimonial-strip__author"> — {author}</span>
        </p>
      </blockquote>
    </figure>
  );
}
