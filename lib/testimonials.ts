export type Testimonial = {
  quote: string;
  author: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Gav mig mycket bättre känsla inför budgivningen och hjälpte mig tänka klart.",
    author: "Kristoffer",
  },
  {
    quote: "Enkelt att använda och väldigt skönt att få riskerna förklarade på ett tydligt sätt.",
    author: "Louise",
  },
  {
    quote:
      "Bra överblick, tydliga slutsatser och faktiskt användbart när man ska fatta ett snabbt beslut.",
    author: "Peter",
  },
];

export function pickTestimonial(index: number): Testimonial {
  return TESTIMONIALS[((index % TESTIMONIALS.length) + TESTIMONIALS.length) % TESTIMONIALS.length];
}
