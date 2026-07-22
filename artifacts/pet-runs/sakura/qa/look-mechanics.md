# Sakura look mechanics

Sakura is a compact ceramic-toy maneki-neko with a separate rounded head on a stable seated torso. Looking should feel like attention, not whole-sprite rotation. Her pupils and eyelids lead, followed by a restrained head pitch or yaw; the ears, tucked sakura blossom, cheek markings, and muzzle turn with the head as one rigid identity-preserving unit. The torso, feet/base, raised beckoning paw, collar center, and overall baseline stay anchored. The small attached bell may lag by only a few pixels and must remain connected to the collar. No skull stretching, affine tilt, whole-body rotation, or pupil-only sliding across fixed eye whites.

Motion budget: each 22.5-degree step moves pupils, eyelids, muzzle, and head angle by an even small increment. Head scale and body scale remain constant. Adjacent steps keep the flower on the same physical ear and change its visibility continuously. The raised paw never swaps sides or teleports.

Cardinal pose families:

- `000 up`: chin lifts slightly; pupils and eye globes aim upward; upper eyelids open toward the top; more lower muzzle/chin is visible; both ears remain readable; the blossom stays attached behind its canonical ear and tips back subtly.
- `090 screen-right`: nose tip and pupils move clearly to screen-right of head center; Sakura's screen-right-facing cheek/muzzle becomes more prominent while the far cheek and far ear are slightly occluded; blossom visibility changes naturally with the canonical ear; torso and raised paw remain anchored.
- `180 down`: chin lowers; pupils and eye globes aim down; upper eyelids lower slightly; more forehead/top of head is visible and the muzzle compresses downward; bell may settle forward but remains attached.
- `270 screen-left`: nose tip and pupils move clearly to screen-left of head center; Sakura's screen-left-facing cheek/muzzle becomes more prominent while the far cheek and far ear are slightly occluded; the blossom stays on the same physical ear with continuous occlusion; torso and raised paw remain anchored.

Diagonals interpolate both axes evenly. Row 9 advances `000 -> 090 -> 180`; row 10 advances `180 -> 270 -> 000`. `157.5 -> 180` and `337.5 -> 000` must each be one ordinary step with no registration, scale, accessory, or expression snap.
