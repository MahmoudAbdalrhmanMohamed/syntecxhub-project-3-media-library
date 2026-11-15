import { defineStore } from 'pinia';

export const useUiStore = defineStore('syntecxhub-ui', () => {
  const sidebarCollapsed = ref(false);
  const mobileSidebarOpen = ref(false);
  const activeRoute = ref('/');
  const globalSearchQuery = ref('');

  const currentOperator = reactive({
    name: 'Mahmoud Abdalrahman',
    email: 'mahmoud.abdalrahman@syntecxhub.io',
    role: 'Principal Full-Stack Architect',
    avatar:
      'https://ui-avatars.com/api/?name=Mahmoud+Abdalrahman&background=0F172A&color=38BDF8&bold=true',
  });

  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value;
  };

  const openMobileSidebar = () => {
    mobileSidebarOpen.value = true;
  };

  const closeMobileSidebar = () => {
    mobileSidebarOpen.value = false;
  };

  const setActiveRoute = (path: string) => {
    activeRoute.value = path;
  };

  return {
    sidebarCollapsed,
    mobileSidebarOpen,
    activeRoute,
    globalSearchQuery,
    currentOperator,
    toggleSidebar,
    openMobileSidebar,
    closeMobileSidebar,
    setActiveRoute,
  };
});
