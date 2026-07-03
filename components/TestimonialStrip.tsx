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
      <div className="testimonial-strip__stars" aria-hidden="true">
        ★★★★★
      </div>
      <blockquote className="testimonial-strip__quote">
        <p>
          <em>&ldquo;{quote}&rdquo;</em>
        </p>
        <cite className="testimonial-strip__author">— {author}</cite>
      </blockquote>
    </figure>
  );
}
