<script>
  import "../app.css";
  import { page } from '$app/stores';
  import { navigation } from '$lib/navigation.js';

  let sidebarOpen = true;
  $: currentUrl = $page.url;

  // Build breadcrumbs from URL segments
  $: segments = currentUrl.pathname.split('/').filter(Boolean);
  $: breadcrumbs = segments.map((segment, i) => ({
    name: segment,
    href: '/' + segments.slice(0, i + 1).join('/')
  }));
</script>

<div class="flex h-screen bg-gray-50">
  <div class="w-14 bg-white border-r border-gray-200 flex flex-col items-center pt-4 space-y-4">
    <div class="w-6 h-6">
      <img src="/logo.png" alt="Logo" />
    </div>

    <button
      class="p-1 rounded hover:bg-gray-100"
      on:click={() => (sidebarOpen = !sidebarOpen)}
      aria-label="Toggle Sidebar"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </div>

  {#if sidebarOpen}
    <aside class="w-64 bg-white border-r border-gray-200 transition-all duration-300">
      <div class="p-4 border-b border-gray-200 text-lg font-semibold">Admin Dashboard</div>
      <nav class="mt-4 space-y-2">
        <div class="px-4 text-xs font-semibold text-gray-500 uppercase">Kelola Device</div>
        <ul class="mt-1 space-y-1">
          {#each navigation as nav}
            <li>
              <a
                href={nav.path.replace('[id]', '123')}
                class="block px-4 py-2 text-sm rounded-md
                  {nav.match(currentUrl) ? 'bg-gray-900 text-white font-medium' : 'text-gray-700 hover:bg-gray-100'}"
              >
                {nav.icon} {nav.title}
              </a>
            </li>
          {/each}
        </ul>
      </nav>
    </aside>
  {/if}

  <div class="flex-1 flex flex-col">
    <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div class="text-sm text-gray-500 flex space-x-2 items-center">
        <a href="/" class="hover:underline">Home</a>
        {#each breadcrumbs as crumb}
          <span>/</span>
          <a href={crumb.href} class="hover:underline capitalize">
            {decodeURIComponent(crumb.name)}
          </a>
        {/each}
      </div>

      <div class="text-xs text-gray-400">Versi 1.0.0</div>
    </header>

    <main class="flex-1 overflow-y-auto p-6">
      <slot />
    </main>
  </div>
</div>