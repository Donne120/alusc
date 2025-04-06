
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./contexts/AuthContext";
import { SettingsProvider } from "./contexts/SettingsContext";

// Wrapper that provides settings and auth context to the app
function AppWithSettings() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <Router>
            <App />
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}

export default AppWithSettings;
