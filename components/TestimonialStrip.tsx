import { HOME_TESTIMONIAL } from "@/lib/testimonials";

type TestimonialStripProps = {
  className?: string;
};

export function TestimonialStrip({ className }: TestimonialStripProps) {
  const { quote, author } = HOME_TESTIMONIAL;

  return (
    <figure
      className={["testimonial-strip", className].filter(Boolean).join(" ")}
      aria-label={`Omdöme från ${author}`}
    >
      <blockquote className="testimonial-strip__quote">
        <span className="testimonial-strip__stars" aria-hidden="true">
          ★★★★★
        </span>
        <span className="testimonial-strip__body">
          <em>&ldquo;{quote}&rdquo;</em>
          <cite className="testimonial-strip__author"> — {author}</cite>
        </span>
      </blockquote>
    </figure>
  );
}
