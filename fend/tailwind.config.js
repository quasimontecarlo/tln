// color-schema definition //
// darks
const db100 = "#2e3440"; //blue//
const db80 = "#3b4252";
const db60 = "#434c5e";
const db40 = "#4c566a";
const db20 = "#727f8f";
// whites
const w100 = "#eceff4"; //white//
const w80 = "#e5e9f0";
const w60 = "#d8dee9";
const w40 = "#b2bed2";
const b100 = "#c4cedd"; //beige//
// cold colors
const lg = "#8fbcbb"; //light green//
const cy = "#88c0d0"; //cyan//
const db = "#81a1c1"; //dark blue//
const lb = "#5e81ac"; //light blue//
// warm colors
const pr = "#bf616a";
const po = "#d08770";
const py = "#ebcb8b";
const pg = "#a3be8c";
const pp = "#b48ead"; //pastel pink//
// custom dark
const dr = "#78575b"; //dark red//
const dg = "#556968"; //dark greeny//

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],

  daisyui: {
    themes: [
      {
        "crltt": {
          "primary": db80,
          "primary-content": w40,
          "secondary": db60,
          "secondary-content": w60,
          "accent": cy,
          "accent-content": db100,
          "neutral": w40,
          "neutral-content": db100,
          "base-100": db100,
          "base-content": db20,
          "info": pp,
          "info-content": db100,
          "success": pg,
          "success-content": db100,
          "warning": py,
          "warning-content": db100,
          "error": pr,
          "error-content": db100,

          "--rounded-box": "1rem", // border radius rounded-box utility class, used in card and other large boxes
          "--rounded-btn": "0.5rem", // border radius rounded-btn utility class, used in buttons and similar element
          "--rounded-badge": "1.9rem", // border radius rounded-badge utility class, used in badges and similar
          "--animation-btn": "0.25s", // duration of animation when you click on button
          "--animation-input": "0.2s", // duration of animation for inputs like checkbox, toggle, radio, etc
          "--btn-focus-scale": "0.95", // scale transform of button when you focus on it
          "--border-btn": "1px", // border width of buttons
          "--tab-border": "1px", // border width of tabs
          "--tab-radius": "0.5rem", // border radius of tabs
        },
      },
      "nord",
    ],
  },
}