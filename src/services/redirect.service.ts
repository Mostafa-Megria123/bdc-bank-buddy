// Service to manage last visited page for redirect after login

const LAST_VISITED_PAGE_KEY = "lastVisitedPage";

export const redirectService = {
  /**
   * Store the current page URL before navigating away
   * (should be called before logout or when navigating to auth pages)
   */
  storeLastPage: (url: string = window.location.pathname) => {
    // Don't store auth pages
    if (
      url.includes("/login") ||
      url.includes("/register") ||
      url.includes("/verification") ||
      url === "/"
    ) {
      return;
    }
    sessionStorage.setItem(LAST_VISITED_PAGE_KEY, url);
  },

  /**
   * Get the last visited page
   * Returns null if no page was stored or if it was an auth page
   */
  getLastPage: (): string | null => {
    const lastPage = sessionStorage.getItem(LAST_VISITED_PAGE_KEY);
    if (!lastPage) {
      return null;
    }
    // Validate the page exists and is safe
    if (
      lastPage.includes("/login") ||
      lastPage.includes("/register") ||
      lastPage.includes("/verification")
    ) {
      return null;
    }
    return lastPage;
  },

  /**
   * Clear the stored page
   */
  clearLastPage: () => {
    sessionStorage.removeItem(LAST_VISITED_PAGE_KEY);
  },

  /**
   * Get redirect URL after login
   * Returns the last visited page if available, otherwise returns default
   */
  getPostLoginRedirect: (defaultPath: string = "/projects"): string => {
    const lastPage = redirectService.getLastPage();
    if (lastPage) {
      redirectService.clearLastPage();
      return lastPage;
    }
    return defaultPath;
  },
};
