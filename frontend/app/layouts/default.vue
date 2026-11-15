<template>
  <div class="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
    <LayoutAppSidebar />

    <div class="flex min-w-0 flex-1 flex-col">
      <LayoutAppTopbar />

      <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
        <slot />
      </main>
    </div>

    <UiToastContainer />
    <UiConfirmDialog />
  </div>
</template>
