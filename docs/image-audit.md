# Supplied image placement audit

Source: `Images-20261113T094800Z-1-001.zip`, supplied 13 November 2026. Paths below are relative to `Images/` inside the ZIP. Existing website copy remains unchanged.

## Grey placeholders replaced

| Website location | Supplied image |
| --- | --- |
| Home — About On Site Building Construction | `HOME page/ABOUT ON SITE BUILDING CONSTRUCTION.png` |
| About — Built From the Ground Up | `About us/BUILT FROM THE GROUND UP.png` |
| Whitford Heights — hero and Whitford project cards | `Whitford/HERO.png` |
| Whitford Heights — project overview | `Whitford/Modern Glass Atrium Lounge.png` |
| New Lynn — hero | `New Lynn/Modern Charcoal and White Suburban Home.png` |
| New Lynn — project overview | `New Lynn/Clean Modern Charcoal Kitchen.png` |
| Manukau Heights — hero | `Manukau Heights/Modern Stone Home with Driveway and No. 12.png` |
| Manukau Heights — project overview | `Manukau Heights/Modern Stone Home with Glass Balcony.png` |
| Botany — hero | `Botany/Upscale Suburban Home with Red-Tiled Roof.png` |
| Botany — project overview | `Botany/Elegant Burgundy and Cream Living Room.png` |

Explicit section names take priority. For project folders without a named hero or overview, an exterior was selected for the hero and a second photo from the same project for the overview. WebP copies preserve the full source composition; responsive cropping happens in CSS. Static photos have no hover zoom.

## Folder assignments now applied

The supplied folder takes priority over the earlier Figma image choices. All of the following mismatches have now been corrected locally.

| Location | Previous image | Supplied assignment now used |
| --- | --- | --- |
| Home hero | Brown brick house also represented in the Manukau Heights folder | `HOME page/HERO.png` specifies the white house with green glass balconies |
| Residential New Builds hero | Unfinished white/green-balcony house with construction equipment | `Residential New Builds/HERO.png` specifies the completed charcoal-and-white house |
| Renovations & Alterations card and introduction | White/cream kitchen, reused from the hero | `RENOVATIONS & ALTERATIONS/RENOVATIONS & ALTERATIONS.png` specifies the charcoal kitchen |
| Renovations — Why Renovate | Same white/cream kitchen | `RENOVATIONS & ALTERATIONS/WHY RENOVATE.png` specifies the bathroom with twin basins |
| Additions & Extensions hero | Outdoor timber sink/kitchen | `ADDITIONS & EXTENSIONS/HERO.png` specifies the timber terrace and house |
| Extensions — Why Extend | Outdoor timber sink/kitchen | `ADDITIONS & EXTENSIONS/WHY EXTEND.png` specifies the house-side walkway and lawn |
| Design & Build introduction | Timber wall framing | `DESIGN & BUILD/DESIGN & BUILD.png` specifies floor framing |
| Design & Build — Why Design & Build | Same timber wall framing | `DESIGN & BUILD/WHY DESIGN & BUILD.png` specifies the overhead view of pink wall framing |

The About and Blogs heroes now use the newer, cleaned files from their respective `HERO.png` assignments. The New Builds service card also uses `Residential New Builds/HERO.png`. Design & Build and Renovations service cards use the images explicitly named for those services.

## Gallery replacements

Gallery counts follow the supplied folders without a three-image limit. Every explicitly named `Gallery` file is included, in numeric order. Project galleries include every current photo in their own named folder, with an explicitly named `HERO` file reserved for the hero. Files under `Old/` are excluded.

| Gallery | Supplied source paths |
| --- | --- |
| Home | `Whitford/Modern Glass-Balcony House.png`; `DESIGN & BUILD/WHY DESIGN & BUILD.png`; `Manukau Heights/Modern Stone-Clad Home with Terraced Landscaping.png` |
| Residential New Builds | All 7: `Gallery.png`, `Gallery1.png`, and `Gallery 2.png` through `Gallery 6.png` |
| Renovations & Alterations | All 4: `Gallery 1.png`; `Gallery 2.png.png`; `Gallery 3.png.png`; `Gallery 4.png` |
| Additions & Extensions | `ADDITIONS & EXTENSIONS/HERO.png`; `ADDITIONS & EXTENSIONS/ADDITIONS & EXTENSIONS.png`; `ADDITIONS & EXTENSIONS/Sunlit Polished Wooden Deck Corner.png` |
| Design & Build | Both images in its own folder: `DESIGN & BUILD/DESIGN & BUILD.png`; `DESIGN & BUILD/WHY DESIGN & BUILD.png` |
| Whitford project | All 10 current non-hero photos in `Whitford/` |
| New Lynn project | All 6 current photos in `New Lynn/` |
| Manukau Heights project | All 6 current photos in `Manukau Heights/` |
| Botany project | All 7 current photos in `Botany/` |

Identical supplied files shared between folders reuse the same optimized asset where possible. Gallery photo choices without explicit `Gallery` filenames are taken from the corresponding service folder.

`app/gallery-images.json` records the original ZIP path for every gallery photo. `scripts/sync-gallery-images.mjs` discovers every matching gallery file and prepares the assets. The carousel computes its scrolling range from the rendered images; dots, arrows, autoplay, keyboard controls and swipe navigation use the actual count.

The archive has no explicitly named hero for Design & Build, no Light Commercial folder, and no dedicated Contact or Projects hero folder. Existing images are retained for those unspecified placements. The New Builds introduction and benefits images are also retained because that folder does not specify corresponding introduction or benefits files.

## Remaining unidentified project cards

The master copy lists **Papakura**, **Takanini Complex**, **Bruce Pulman**, **South Auckland**, and **Hamilton**. No folder or named image in the ZIP identifies those projects. Their cards retain their grey placeholders. Unnamed root images and the generic `Website image` folder were not assigned to specific projects without supporting names.

Images inside `Old/` were not used where newer images are available in the same project folder.
