# UC Pocket Meter

A phone light meter for the Olympus 35 UC. Live at https://meter.bluenotebook.io.

- **iPhone:** meters from the EXIF data of a photo (shutter, ISO, f-number) plus the brightness of the centre spot.
- **Android Chrome:** meters live from the camera by setting shutter time and ISO by hand.

The whole app is `public/index.html`. It is served as static assets by a Cloudflare Worker (`wrangler.jsonc`).

## Deploy

A push to `main` deploys through GitHub Actions. The workflow needs the repo secret `CLOUDFLARE_API_TOKEN`.

To deploy by hand: `npm install && npx wrangler deploy`.
