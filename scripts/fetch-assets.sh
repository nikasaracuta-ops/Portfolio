#!/usr/bin/env bash
# Downloads the design's images from the Figma MCP asset server into assets/.
# The URLs are temporary (about 7 days); regenerate them from the Figma file
# (frame "Main", node 315:133) if they have expired.
set -euo pipefail
cd "$(dirname "$0")/../assets"
base="https://www.figma.com/api/mcp/asset"
while read -r name id; do
  [ -z "$name" ] && continue
  curl -fsSL -o "$name" "$base/$id" && echo "ok   $name" || echo "FAIL $name"
done <<'LIST'
bird.png 9311c984-b3ab-4ad2-bf60-513f0532c0c7.png
texture.png 7e987884-0749-401f-b469-77fbe6e13c0f.png
mask-leaf-1.png b8a4cfed-ed45-4cf4-b28e-99f4a3654ca6.png
mask-leaf-2.png d4e03601-3dcc-452c-9121-d07b851769d5.png
mask-leaf-3.png 74ad20a1-8023-4753-b2b0-4dd10bc78eeb.png
mask-leaf-4.png 0b9eeeca-61d5-4525-86d3-0b0a6fe6ed96.png
mask-chameleon.png 1430c167-bb4c-489f-9f32-171c5a85a45e.png
mask-silhouette.png a22fe45b-9596-4e3c-912b-c5117b0bc001.png
sun.svg 6ebd00e1-49d5-4498-9d0a-92a8f41d9290.svg
cloud-276.svg 0e386479-d31a-4532-b53b-5d05299007b3.svg
cloud-277.svg 5b810abb-9c17-489b-ba85-8a9c4f5a4830.svg
cloud-278.svg 5e90cec6-b89b-4f38-90b4-e488e22f85c5.svg
cloud-279.svg 95b49ef2-21ec-4555-ad9b-adc32bfe8724.svg
cloud-280.svg ed6e82eb-44d4-4bc8-b57e-73b1a9479abb.svg
cloud-281.svg 9f43f65f-4909-4fdc-8069-0dd96215ff32.svg
cloud-285.svg fe9a7779-393e-4787-bfc7-1757f98d99e3.svg
waves.svg 788eb8c6-17ef-4f2a-bf75-ed03ff8a6f78.svg
icon-linkedin.svg 844208cc-d084-4da5-baad-b26dad8089a5.svg
icon-behance.svg 5409458e-6ab4-4171-95c1-b43156efe663.svg
coral-small.svg 4057cb5d-8f88-4312-a5a5-19db43141ca5.svg
coral.svg d1c2f64b-1d8e-421b-a48e-233ef1ebf5ba.svg
seabed.svg 8b334097-547b-4701-afa7-7d44491143f2.svg
chameleon-1.svg bc506abb-623e-4ad4-99e6-ea655f50c6e0.svg
chameleon-2.svg 00e6b1a9-add1-4582-a898-7578edfc79e7.svg
chameleon-3.svg d6fa6e94-a08b-498f-b5d1-f067fdfaa12b.svg
chameleon-4.svg b5ce0d3d-30c3-4aa1-b3b4-3dd652e30821.svg
silhouette.svg 8ecf5259-5093-4c0d-8b4f-00282daa82b9.svg
LIST
