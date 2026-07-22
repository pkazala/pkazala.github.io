Create Codex v2 pet look row 9 for `sakura` as exactly 8 full-body frames in this order: 000, 022.5, 045, 067.5, 090, 112.5, 135, 157.5.

Use the canonical base, standard contact sheet, layout guide, approved four-cardinal strip, and `qa/look-mechanics.md`. Draw the complete eight-pose row as one coherent animation family, interpolating even 22.5-degree steps between the cardinal pose families. Keep the same pet identity, face construction, materials, palette, markings, and props. Each direction must read correctly at pet size and join continuously at the 000 and 180 boundaries.

DIRECTION TARGETS — use these to shape the coherent row, not as pixel-level landmark gates:

1. `000`: vertical UP; no horizontal requirement.
2. `022.5`: horizontal SCREEN-RIGHT and vertical UP.
3. `045`: horizontal SCREEN-RIGHT and vertical UP.
4. `067.5`: horizontal SCREEN-RIGHT and vertical UP.
5. `090`: horizontal SCREEN-RIGHT; no vertical requirement.
6. `112.5`: horizontal SCREEN-RIGHT and vertical DOWN.
7. `135`: horizontal SCREEN-RIGHT and vertical DOWN.
8. `157.5`: horizontal SCREEN-RIGHT and vertical DOWN.

Cardinals must be unmistakable. Intermediate poses should broadly occupy the intended quadrant and advance naturally through the ordered loop. Minor pupil, nose, eyelid, or aiming-feature deviations are acceptable when the overall direction, continuity, identity, and motion remain coherent. Do not deform the character merely to make every intermediate axis independently obvious.

HARD LAYOUT AND CONTINUITY CONTRACT — DETERMINISTIC REGISTRATION: draw exactly eight separated pose groups in left-to-right direction order. Keep enough chroma-only space between neighboring poses that each complete pose can be detected without cutting through foreground. Approximate the guide's equal spacing, but do not distort a pose merely to hit an exact source-canvas coordinate; deterministic assembly will crop the eight ordered groups, then apply one shared scale and baseline.

Use the same body height, head size, baseline, and planted-body position across the generated family. Never overlap neighboring poses, merge two poses into one connected group, crop foreground at the outer canvas edge, or resize one pose independently.

Keep the feet, base, or lower torso planted at the same coordinates across all eight frames. Express direction through the eyes, face, head, upper body, and physically appropriate prop movement, not by moving, rotating, or rescaling the entire sprite.

ROW-BOUNDARY LOCK: 157.5 must be one even 22.5-degree step before 180. Match the approved 180 pose's body size, baseline, planted anchor, expression, and construction. Preserve the overall right-hand arc, but do not distort pupils, nose, or body geometry merely to exaggerate the subtle horizontal component.

PRE-RETURN CHECK: reject this result if it does not contain eight separated pose groups in the required order; neighboring poses overlap; foreground is cropped at the outer canvas edge; any frame changes sprite scale, body or head size, baseline, or planted-body position; the row visibly reverses into the wrong half of the loop; or 157.5 does not flow evenly into 180. Minor intermediate pupil or nose deviations are not rejection reasons. Exact cell cropping, resizing, and recentering happen deterministically after generation.

Use a flat pure magenta #FF00FF background. One complete unclipped pose per invisible slot. No whole-sprite rotation, replacement eyes, labels, guide marks, shadows, glows, scenery, detached effects, or #FF00FF colors in the pet.

REPAIR REQUIREMENT AFTER FAILED ATTEMPT: the previous row incorrectly turned the cat toward the LEFT side of the image in cells 045 through 157.5. Correct that horizontal reversal. `SCREEN-RIGHT` means the cat's nose tip, pupils, muzzle, and head turn move toward the RIGHT EDGE OF THE OUTPUT IMAGE (the viewer's right), never the cat's own right. At `090`, copy the direction meaning of the approved 090 anchor: nose tip and pupils must visibly sit to the image-right side of head center. Cells 022.5 through 157.5 must keep that same image-right horizontal sign while the vertical component progresses evenly from up to down. Preserve everything that already passed: identity, white ceramic material, head/body scale, stable seated baseline, blossom on the same physical ear, attached bell, and raised paw.

UPSTREAM CONTINUITY STRATEGY: the semantically correct repaired row later proved too extreme at `157.5`: it became visibly smaller, strongly right-offset, and deeply bowed, causing a conspicuous snap into the approved centered `180` down family. Keep the rightward semantics, but make `157.5` only ONE SUBTLE STEP before the approved `180` anchor. Use the attached approved cardinal strip's 180 pose as the boundary authority: `157.5` must nearly match its full-body/head scale, seated lower-body anchor, baseline, and centered-down silhouette, retaining only a small image-right component. Progress from 135 to 157.5 smoothly without shrinking, over-bowing, or translating the pet. Preserve the stable body anchor and practical scale from 000 through 157.5.
