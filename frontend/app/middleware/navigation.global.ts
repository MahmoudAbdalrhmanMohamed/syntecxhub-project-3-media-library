export default defineNuxtRouteMiddleware((to) => {
  const uiStore = useUiStore();
  if (import.meta.client) {
    uiStore.closeMobileSidebar();
  }
  uiStore.setActiveRoute(to.path);
});
