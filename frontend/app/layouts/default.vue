<template>
  <div class="flex min-h-screen bg-[#FDF2F4] dark:bg-[#0B0612] text-slate-900 dark:text-slate-100 font-sans selection:bg-rose-500 selection:text-white relative overflow-x-hidden">
    <!-- Ambient Studio Lighting Glow -->
    <div class="pointer-events-none fixed top-0 right-1/4 -z-10 h-96 w-96 rounded-full bg-rose-600/10 blur-[120px] dark:bg-rose-600/15" />
    <div class="pointer-events-none fixed bottom-10 left-1/3 -z-10 h-80 w-80 rounded-full bg-fuchsia-600/10 blur-[100px] dark:bg-fuchsia-600/10" />

    <LayoutAppSidebar />

    <div class="flex min-w-0 flex-1 flex-col">
      <LayoutAppTopbar />

      <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1720px] w-full mx-auto">
        <slot />
      </main>
    </div>

    <UiToastContainer />
    <UiConfirmDialog />
  </div>
</template>
