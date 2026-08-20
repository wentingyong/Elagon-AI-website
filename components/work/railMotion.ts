/** Rail motion model for the homepage "Selected work" section.
 *
 *  Each card's scale is a pure function of its own X position, so cards
 *  animate at different scroll depths simply by sitting at different places
 *  in the track — the stagger is emergent, never scheduled. Every tunable
 *  lives in RAIL; the functions below are pure so they can be unit-checked
 *  against measured DOM values. */

export const RAIL = {
  /** cards framed inside the stage at scroll progress 0 (rest queue off-screen right) */
  VISIBLE_AT_START: 2.6,
  /** at progress 1, the trailing item stops this far from the stage's right edge */
  RIGHT_INSET: 0.26,
  /** a card entering from the right starts here and grows to 1 */
  SCALE_MIN: 0.7,
  /** the scale ramp completes when a card's centre reaches this fraction of the stage width */
  FOCUS_X: 0.22,
  /** a card's storyboard fires when its centre crosses this fraction of the stage width */
  FIRE_X: 0.53,
  /** pin length = this many vh per card */
  RUNWAY_VH_PER_CARD: 50,
  /** vertical offset cycle, as a fraction of stage height (4-beat, repeating) */
  Y_PATTERN: [0, 0.11, 0, -0.13],
  /** GSAP numeric scrub: the inertial catch-up that makes the track feel dragged */
  SCRUB: 0.4,
} as const;

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

/** SCALE_MIN → 1 as the card travels from off the right edge to the focus zone. */
export function cardScale(centreX: number, cardWidth: number, stageWidth: number) {
  const fromX = stageWidth + cardWidth * 0.5;
  const toX = Math.max(120, stageWidth * RAIL.FOCUS_X);
  const t = clamp((fromX - centreX) / (fromX - toX), 0, 1);
  return RAIL.SCALE_MIN + (1 - RAIL.SCALE_MIN) * t;
}

/** Vertical offset for card `index`, in px, from the 4-beat cycle. */
export function cardOffsetY(index: number, stageHeight: number) {
  return RAIL.Y_PATTERN[index % RAIL.Y_PATTERN.length] * stageHeight;
}

/** Track x at progress 0 and 1.
 *  start: only VISIBLE_AT_START cards are framed, the rest queue off the right.
 *  end:   the trailing item rests RIGHT_INSET in from the stage's right edge. */
export function railBounds(items: HTMLElement[], stageWidth: number, gap: number) {
  const first = items[0];
  const last = items[items.length - 1];
  if (!first || !last) return { startX: 0, endX: 0 };

  const pitch = first.offsetWidth + gap;
  const framed = first.offsetLeft + RAIL.VISIBLE_AT_START * pitch - gap / 2;
  const startX = Math.max(0, stageWidth - framed);
  const endX = stageWidth - stageWidth * RAIL.RIGHT_INSET - (last.offsetLeft + last.offsetWidth);

  // never scroll backwards: a track that already fits needs no travel
  return { startX, endX: Math.min(endX, startX) };
}
