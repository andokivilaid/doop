import { cn } from '@/lib/utils'

const PALETTE_ORANGE = '#FF6A00'

/* Classic artist's wooden kidney palette silhouette with tilted oval thumb hole
   and four graduated pigment wells along the upper rim (even-odd cutouts). */
const PALETTE_PATH =
  'M 16 110 C 12 52, 56 16, 112 18 C 160 20, 190 50, 188 88 C 186 112, 168 120, 150 120 C 132 120, 124 132, 132 148 C 140 164, 128 182, 98 183 C 48 185, 20 154, 16 110 Z ' +
  'M 80.4 153.4 A 17.5 11.5 -18 1 0 113.6 142.6 A 17.5 11.5 -18 1 0 80.4 153.4 Z ' +
  'M 35.5 113 a 11.5 11.5 0 1 0 23 0 a 11.5 11.5 0 1 0 -23 0 Z ' +
  'M 50 69 a 12 12 0 1 0 24 0 a 12 12 0 1 0 -24 0 Z ' +
  'M 91.5 47 a 12.5 12.5 0 1 0 25 0 a 12.5 12.5 0 1 0 -25 0 Z ' +
  'M 135.5 65 a 11.5 11.5 0 1 0 23 0 a 11.5 11.5 0 1 0 -23 0 Z'

/** Doop's artist painting palette silhouette mark in bright cadmium orange. */
export function Logo({ className = 'size-[30px]' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" aria-hidden>
      <path fill={PALETTE_ORANGE} fillRule="evenodd" d={PALETTE_PATH} />
    </svg>
  )
}

/* Tight box around the palette silhouette, plus headroom when animated. */
const MARK_BOX = { x: 14, y: 16, w: 176, h: 168 }
const HOP_HEADROOM = 10

/** The cropped palette glyph inline next to text, in menus, or as the hero mark.
 *  Defaults to the bright orange brand colour unless an explicit `color` is passed. */
export function DoopMark({
  size = 13,
  color,
  animated = false,
  className = 'mr-px inline-block align-[-2px]',
}: {
  size?: number | 'fill'
  color?: string
  animated?: boolean
  className?: string
}) {
  const top = animated ? MARK_BOX.y - HOP_HEADROOM : MARK_BOX.y
  const height = animated ? MARK_BOX.h + HOP_HEADROOM : MARK_BOX.h
  return (
    <svg
      className={cn(animated && 'overflow-visible', className)}
      /* inline so Button's descendant-svg rule (16px unless a size- class) cannot override it */
      style={
        size === 'fill'
          ? { width: '100%', height: '100%' }
          : { width: Math.round((size * MARK_BOX.w) / height), height: size }
      }
      viewBox={`${MARK_BOX.x} ${top} ${MARK_BOX.w} ${height}`}
      fill={color ?? PALETTE_ORANGE}
      aria-hidden
    >
      <path
        className={cn(
          animated &&
            'origin-center animate-[disc-hop_2.8s_ease-in-out_infinite] [transform-box:fill-box] motion-reduce:animate-none',
        )}
        fillRule="evenodd"
        d={PALETTE_PATH}
      />
    </svg>
  )
}
