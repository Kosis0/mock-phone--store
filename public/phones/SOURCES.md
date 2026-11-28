# Phone Imagery Sources

All local device renders (`<stem>.png`, `<stem>-front.png`, `<stem>-back.png`) cover all 34 models (127 finishes, 381 transparent `640×800` RGBA PNG assets):

- **Catalog & Front Views**: Normalized from official Apple Compare (`https://www.apple.com/iphone/compare/`) straight-on retina assets with anti-aliased flood-fill background transparency.
- **Rear Views**: Extracted from unobstructed official Apple Store (`store.storeimages.cdn-apple.com` `fmt=png-alpha`) foreground-back assets for `iPhone Duo`, `iPhone 18 Pro Max`, `iPhone 18 Pro`, `iPhone 17 Pro Max`, and `iPhone 17 Pro`, and reconstructed seamlessly for straight-on lineup models.
- **Fallback Vector Hardware (`IPhoneStudioSvg.tsx`)**: Hardware-accurate silhouette geometry covering `dual-fold` (`iPhone Duo` horizontal camera plateau & book fold), `plateau-triple`, `plateau-single`, `triple-square` (with/without LiDAR), `dual-vertical`, `dual-diagonal`, and classic Touch ID chassis.
