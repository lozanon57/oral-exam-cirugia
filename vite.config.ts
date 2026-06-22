import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: `base` must match the GitHub Pages repo name so asset paths resolve.
// Repo: github.com/lozanon57/oral-exam-cirugia  ->  https://lozanon57.github.io/oral-exam-cirugia/
export default defineConfig({
  base: '/oral-exam-cirugia/',
  plugins: [react()],
})
