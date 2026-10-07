# LaunchFlow

Clean React + Vite structure for LaunchFlow.

```text
LaunchFlow/
├── .github/workflows/build-apk.yml
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   └── style.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

The duplicate root-level `main.jsx` and `style.css` files are intentionally removed. The entry point is `src/main.jsx`, which imports `App.jsx` and `style.css` from `src`.
