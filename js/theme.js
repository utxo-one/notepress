// Function to set theme preference
function setThemePreference(theme) {
    localStorage.setItem("theme", theme);
  }
  
  // Function to get theme preference
  function getThemePreference() {
    return localStorage.getItem("theme") || "light";
  }
  
  // Function to apply theme
  function applyTheme(theme) {
    const html = document.documentElement;
    html.setAttribute("data-theme", theme);
  }
  
  // On page load, apply theme preference
  window.addEventListener("load", () => {
    const preferredTheme = getThemePreference();
    applyTheme(preferredTheme);
    document.getElementById("themeSelect").value = preferredTheme;
  });
  
  // Event listener for theme selection dropdown
  const themeSelect = document.getElementById("themeSelect");
  themeSelect.addEventListener("change", (event) => {
    const selectedTheme = event.target.value;
    setThemePreference(selectedTheme);
    applyTheme(selectedTheme);
  });