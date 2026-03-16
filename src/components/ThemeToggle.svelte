<script lang="ts">
  function setTheme(theme: string) {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }

  // Initialize theme on mount
  import { onMount } from 'svelte'

  onMount(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)')

    if (savedTheme) {
      // Apply saved theme from localStorage
      setTheme(savedTheme)
    } else {
      // Apply system preference
      const systemTheme = prefersDarkScheme.matches ? 'dark' : 'light'
      setTheme(systemTheme)
    }
  })

  const handleClick = () => {
    const theme = localStorage.getItem('theme')
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
  }

  const handleSetLight = () => {
    setTheme('light')
  }

  const handleSetDark = () => {
    setTheme('dark')
  }

  const handleSetSystem = () => {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)')
    const systemTheme = prefersDarkScheme.matches ? 'dark' : 'light'
    setTheme(systemTheme)
  }
</script>

<button on:click={handleSetSystem}>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20px">
    <!-- Macintosh Body (All-in-one design) -->
    <rect
      x="4"
      y="2"
      width="16"
      height="16"
      rx="2"
      ry="2"
      fill="#e8e8e8"
      stroke="#999"
      stroke-width="0.5"
    />

    <!-- Screen Area (inset) -->
    <rect x="6" y="4" width="12" height="9" rx="1" ry="1" fill="#333" />

    <!-- Disk Drive Slot -->
    <rect x="10" y="14" width="4" height="0.8" rx="0.3" ry="0.3" fill="#555" />

    <!-- Apple Logo (simplified) -->
    <circle cx="12" cy="3.3" r="0.4" fill="#999" />

    <!-- Keyboard (detached, below) -->
    <rect
      x="7"
      y="19"
      width="10"
      height="3"
      rx="0.5"
      ry="0.5"
      fill="#000"
      stroke="#000"
      stroke-width="0.5"
    />
  </svg>
</button>

<button on:click={handleSetLight}>
  <svg width="20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path
      class="sun"
      fill-rule="evenodd"
      d="M12 17.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zm0 1.5a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm12-7a.8.8 0 0 1-.8.8h-2.4a.8.8 0 0 1 0-1.6h2.4a.8.8 0 0 1 .8.8zM4 12a.8.8 0 0 1-.8.8H.8a.8.8 0 0 1 0-1.6h2.5a.8.8 0 0 1 .8.8zm16.5-8.5a.8.8 0 0 1 0 1l-1.8 1.8a.8.8 0 0 1-1-1l1.7-1.8a.8.8 0 0 1 1 0zM6.3 17.7a.8.8 0 0 1 0 1l-1.7 1.8a.8.8 0 1 1-1-1l1.7-1.8a.8.8 0 0 1 1 0zM12 0a.8.8 0 0 1 .8.8v2.5a.8.8 0 0 1-1.6 0V.8A.8.8 0 0 1 12 0zm0 20a.8.8 0 0 1 .8.8v2.4a.8.8 0 0 1-1.6 0v-2.4a.8.8 0 0 1 .8-.8zM3.5 3.5a.8.8 0 0 1 1 0l1.8 1.8a.8.8 0 1 1-1 1L3.5 4.6a.8.8 0 0 1 0-1zm14.2 14.2a.8.8 0 0 1 1 0l1.8 1.7a.8.8 0 0 1-1 1l-1.8-1.7a.8.8 0 0 1 0-1z"
    />
  </svg>
</button>

<button on:click={handleSetDark}>
  <svg width="20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path
      class="moon"
      fill-rule="evenodd"
      d="M16.5 6A10.5 10.5 0 0 1 4.7 16.4 8.5 8.5 0 1 0 16.4 4.7l.1 1.3zm-1.7-2a9 9 0 0 1 .2 2 9 9 0 0 1-11 8.8 9.4 9.4 0 0 1-.8-.3c-.4 0-.8.3-.7.7a10 10 0 0 0 .3.8 10 10 0 0 0 9.2 6 10 10 0 0 0 4-19.2 9.7 9.7 0 0 0-.9-.3c-.3-.1-.7.3-.6.7a9 9 0 0 1 .3.8z"
    />
  </svg>
</button>

<style>
  button {
    border: 0;
    background: none;
    cursor: pointer;
  }

  button:hover {
    opacity: 0.75;
  }

  .sun {
    fill: black;
  }

  .moon {
    /* fill: transparent; */
    fill: black;
  }

  :global(.dark) .sun {
    fill: transparent;
  }
  :global(.dark) .moon {
    fill: white;
  }
</style>
