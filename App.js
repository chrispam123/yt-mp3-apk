// =============================================================================
// App.js
// Punto de entrada de la app. Renderiza la pantalla principal.
// =============================================================================

import { StatusBar } from "expo-status-bar";
import DownloadScreen from "./src/components/DownloadScreen";

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <DownloadScreen />
    </>
  );
}
