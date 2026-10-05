# amirul.dev — portfolio

React + TypeScript + Vite, Three.js for the hero scene, GSAP + ScrollTrigger + Lenis for motion,
and two components adapted from 21st.dev (Magnetic by ibelick, Scroll Velocity Text by cnippet-dev).

```bash
npm install
npm run dev      # local dev server
npm run build    # single-file build in dist/index.html (vite-plugin-singlefile)
```

Content lives in `src/data.ts`. Colours and type tokens are at the top of `src/styles.css`.
The "Download resume" row downloads `src/assets/resume/Amirul_Fahmi_Resume.pdf`; replace that file to update it.

## Private images

Project photos and screenshots in `src/assets/projects/` are **not in the repo** (see `.gitignore`),
because they show Fahmi's and his teammates' faces. Keep a copy of that folder on your own computer
(or a private drive) and put it back in `src/assets/projects/` before running `npm run build`.

Award certificates are committed only as encrypted files (`src/assets/certs/*.enc`) and are decrypted
in the browser when a visitor opens them.
