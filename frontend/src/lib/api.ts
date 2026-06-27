// API configuration utility for PHP backend APIs

const BASE_URL = "https://kpl.devkayy.in/api";

export const apiFetch = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  
  // Map standard routing endpoints to their corresponding PHP filenames
  let url = `${BASE_URL}${cleanEndpoint}`;
  if (cleanEndpoint.startsWith("/home")) {
    url = `${BASE_URL}/home.php`;
  } else if (cleanEndpoint.startsWith("/teams")) {
    url = `${BASE_URL}/teams.php`;
  } else if (cleanEndpoint.startsWith("/register")) {
    url = `${BASE_URL}/register.php`;
  } else if (cleanEndpoint.startsWith("/announcements")) {
    url = `${BASE_URL}/announcements.php`;
  } else if (cleanEndpoint.startsWith("/gallery")) {
    url = `${BASE_URL}/gallery.php`;
  } else if (cleanEndpoint.startsWith("/sponsors")) {
    url = `${BASE_URL}/sponsors.php`;
  } else if (cleanEndpoint.startsWith("/matches")) {
    url = `${BASE_URL}/matches.php`;
  } else if (cleanEndpoint.startsWith("/auth")) {
    url = `${BASE_URL}/auth.php`;
  } else if (cleanEndpoint.startsWith("/admin")) {
    // e.g. /admin/stats -> admin.php?action=stats
    const action = cleanEndpoint.split("/").pop();
    url = `${BASE_URL}/admin.php?action=${action}`;
  }

  // Inject Bearer token if available
  const token = localStorage.getItem("kpl_admin_token");
  if (token) {
    options.headers = {
      ...options.headers,
      "Authorization": `Bearer ${token}`,
      "X-Authorization": `Bearer ${token}`,
    };
  }

  const response = await fetch(url, options);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  
  const result = await response.json();
  if (result && result.error) {
    throw new Error(result.error);
  }
  return result;
};
