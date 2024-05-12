// Function to set dark mode preference
function setDarkModePreference(isDarkMode) {
    localStorage.setItem("darkMode", isDarkMode);
  }
  
  // Function to get dark mode preference
  function getDarkModePreference() {
    return JSON.parse(localStorage.getItem("darkMode"));
  }
  
  // Function to toggle dark mode
  function toggleDarkMode() {
    const isDarkMode = getDarkModePreference();
    const html = document.documentElement;
    const darkModeToggle = document.getElementById("darkModeToggle");
  
    if (isDarkMode) {
      html.setAttribute("data-theme", "dark");
      darkModeToggle.querySelector("span").classList.add("translate-x-full");
    } else {
      html.removeAttribute("data-theme");
      darkModeToggle.querySelector("span").classList.remove("translate-x-full");
    }
  }
  
  // On page load, apply dark mode preference
  window.addEventListener("load", () => {
    toggleDarkMode();
  });
  
  // Event listener for dark mode toggle button
  const darkModeToggle = document.getElementById("darkModeToggle");
  darkModeToggle.addEventListener("click", () => {
    const isDarkMode = getDarkModePreference();
    setDarkModePreference(!isDarkMode);
    toggleDarkMode();
  });