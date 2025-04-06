
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { AuthProvider } from "./contexts/AuthContext";
import { SettingsProvider } from "./contexts/SettingsContext";

// Wrapper that provides settings and auth context to the app
function AppWithSettings() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <Router>
          <App />
        </Router>
      </AuthProvider>
    </SettingsProvider>
  );
}

export default AppWithSettings;
