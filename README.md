# Gemini Watermark Remover Pro

An original, production-grade, 100% browser-local web application for losslessly removing visible watermarks from Google Gemini images and Google Veo video clips using mathematically exact **Reverse Alpha Blending**.

Inspired by `geminiwatermarkremover.io` but re-architected from the ground up with an original brand, enhanced video processing, interactive Before/After comparison controls, fine-tuning sliders, and a full suite of technical and SEO resources.

---

## 🌟 Key Features

- **100% In-Browser Privacy**: All image and video frame manipulation runs inside your local browser instance via HTML5 Canvas, WebCodecs, and Web Workers. Zero file uploads or remote server processing.
- **Mathematical Reverse Alpha Blending**: Solves $I_{orig} = (I_{watermarked} - \alpha \cdot 255) / (1 - \alpha)$ algebraically. Recovers real underlying pixels without blurry hallucinations, smudges, or generative AI distortions.
- **Dedicated Video Remover (Veo Support)**: Frame-by-frame sequential processing with synchronized audio track preservation via the Web Audio API.
- **Interactive Before & After Comparison**: Real-time draggable split-screen comparison slider with $1\times$ to $4\times$ zoom and pan inspection.
- **Fine-Tuning Controls**: Interactive Alpha Gain multiplier ($0.50\times$ to $2.00\times$), subpixel corner auto-alignment search, and custom size overrides.
- **Batch Processing & ZIP Export**: Queue multiple Gemini outputs in parallel and export all cleaned files in a single compressed ZIP archive.
- **SynthID Transparency**: Honest technical documentation clearly distinguishing between visible semi-transparent logo overlays (removable) and Google DeepMind's invisible cryptographic SynthID digital provenance (unaffected).

---

## 🏗️ Architecture & Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router, Turbopack, React 19) |
| **Language** | TypeScript 5.x (Strict Type Safety) |
| **Styling** | Vanilla Tailwind CSS v4 (Custom dark/light design system) |
| **Icons & Typography** | Lucide React + Google Fonts Plus Jakarta Sans |
| **Image Core** | Canvas 2D + `ImageData` Typed Arrays (`Uint8ClampedArray`) |
| **Video Core** | HTML5 Video + Canvas Stream + Web Audio API (`AudioContext`) + MediaRecorder (H.264 / VP9) |
| **Batch Export** | JSZip (In-memory client-side ZIP generation) |
| **Testing** | Node.js Test Runner (`node --test`) |

---

## 🚀 Quick Start & Local Development

### Prerequisites
- Node.js `v18.18.0` or higher (Tested on Node.js v24.17.0)
- npm `v9.0.0` or higher

### Installation
```bash
# Clone or navigate to the project directory
cd watermark

# Install dependencies
npm install
```

### Running Locally
```bash
# Start the development server with Turbopack
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### Running Automated Tests
```bash
# Run unit and integration tests
node --test tests/watermarkEngine.test.mjs
```

### Production Build
```bash
# Build optimized production bundle
npm run build

# Start production server
npm start
```

---

## 🧭 Page Routes & Site Structure

- `/`: Master homepage with dual Image/Video hero switcher, interactive live slider, and FAQ.
- `/image-watermark-remover`: Dedicated full-screen studio for single and batch image cleaning.
- `/video-watermark-remover`: Dedicated studio for Gemini and Veo video frame-by-frame cleaning.
- `/how-it-works`: Interactive mathematical breakdown of Reverse Alpha Blending vs AI inpainting.
- `/faq`: Comprehensive searchable knowledge base and troubleshooting guide.
- `/about`: Mission statement, open-source principles, and privacy audit disclosures.
- `/contact`: Functional feedback and issue submission form.
- `/privacy-policy`: Verified zero-upload client-side privacy assertion.
- `/terms`: Terms of service and MIT open-source license.
- `/blog`: Educational articles index.
- `/blog/[slug]`: In-depth guides covering SynthID, Reverse Alpha Blending, Veo video processing, and zero-upload browser architecture.
- `/sitemap.xml`: Search engine crawling manifest.
- `/robots.txt`: Search crawler indexing policy.

---

## 🌐 Browser Compatibility

| Browser | Image Remover | Video Remover | Audio Preservation |
| :--- | :---: | :---: | :---: |
| **Google Chrome / Chromium (v94+)** | ✅ Full Support | ✅ Full Support | ✅ Full Support |
| **Microsoft Edge (v94+)** | ✅ Full Support | ✅ Full Support | ✅ Full Support |
| **Mozilla Firefox (v100+)** | ✅ Full Support | ✅ Full Support | ✅ Full Support |
| **Apple Safari (v15.4+)** | ✅ Full Support | ✅ Full Support | ✅ Full Support |

*Note: Disable canvas fingerprint defender extensions if they interfere with pixel reads (`getImageData`).*

---

## ⚠️ Known Limitations & Future Improvements

1. **Large Video Memory Constraints**: Processing 4K videos longer than 60 seconds inside browser memory can approach tab RAM limits. For massive video pipelines, consider local CLI processing.
2. **Lossy Compression Artifacts**: On heavily compressed JPEGs or re-encoded WebM clips, color quantization around the star mark may leave faint halos. Use the built-in **Alpha Gain** slider ($1.10\times$ - $1.25\times$) to compensate.
3. **SynthID Provenance**: This tool removes visible watermark overlays. It does not alter imperceptible latent SynthID provenance signatures embedded into diffusion models.

---

## 📄 License & Attribution

- Released under the permissive **MIT License**.
- Inspired by the public web utilities of `geminiwatermarkremover.io`.
- *Disclaimer: Google Gemini, Google Veo, and DeepMind are registered trademarks of Google LLC. This project is an independent open-source utility and is not affiliated with or endorsed by Google LLC.*
