/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#001F3F',
          light: '#3A6D8C',
          lighter: '#6A9AB0',
          lightest: '#EAD8B1'
        },
        // Aliases semánticos
        accent: '#6A9AB0',
        background: '#EAD8B1',
      }
    },
  },
  plugins: [],
}
