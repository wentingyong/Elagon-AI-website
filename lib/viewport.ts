/**
 * One height for the pinned stages to agree on.
 *
 * `window.innerHeight` is the *visual* viewport: on iOS Safari it grows and shrinks as the
 * toolbar collapses, so a pin measured against it drifts out of step with a stage sized in CSS,
 * and the page background shows through at the bottom of the stage.
 *
 * `document.documentElement.clientHeight` is the *layout* viewport, which is what `100lvh`
 * resolves to and which the toolbar does not move. Every full-bleed stage is `100lvh` and every
 * pin length is a multiple of this, so the two can never disagree — which is also what makes
 * `ScrollTrigger.config({ ignoreMobileResize: true })` safe (MotionProvider).
 */
export const stageHeight = () => document.documentElement.clientHeight;
