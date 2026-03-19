// =============================================================================
// DownloadScreen.js
// Pantalla principal con tres estados:
// 1. idle     → campo de URL + botón de descarga
// 2. loading  → indicador de progreso + polling activo
// 3. done     → botón de descarga del MP3 o mensaje de error
// =============================================================================

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Linking,
} from "react-native";
import { startDownload, pollTaskStatus } from "../services/api";

export default function DownloadScreen() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | completed | error
  const [message, setMessage] = useState("");
  const [mp3Url, setMp3Url] = useState(null);
  const pollingRef = useRef(null);

  // Limpiamos el polling si el componente se desmonta
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const handleDownload = async () => {
    if (!url.trim()) {
      Alert.alert("Error", "Por favor introduce una URL de YouTube");
      return;
    }

    if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
      Alert.alert("Error", "La URL debe ser de YouTube");
      return;
    }

    try {
      setStatus("loading");
      setMessage("Iniciando descarga...");
      setMp3Url(null);

      const { task_id } = await startDownload(url);

      setMessage("Procesando audio...");

      // Iniciamos el polling y guardamos la referencia para poder cancelarlo
      pollingRef.current = pollTaskStatus(task_id, (data) => {
        if (data.status === "completed") {
          setStatus("completed");
          setMessage("¡MP3 listo para descargar!");
          setMp3Url(data.url);
        } else if (data.status === "error") {
          setStatus("error");
         setMessage(data.message || "Error desconocido");
        } else if (data.status === "not_found") {
          setMessage("Iniciando servidor de descarga...\nEsto puede tardar hasta 2 minutos la primera vez.");
        } else {
          setMessage("Procesando audio...");
        }
      });
    } catch (_error) {
      setStatus("error");
      setMessage("Error al conectar con el servidor");
    }
  };

  const handleOpenMp3 = async () => {
    if (mp3Url) {
      await Linking.openURL(mp3Url);
    }
  };

  const handleReset = () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    setUrl("");
    setStatus("idle");
    setMessage("");
    setMp3Url(null);
  };

  return (
    <View style={styles.container}>

      {/* Título */}
      <Text style={styles.title}>YT MP3 Downloader</Text>
      <Text style={styles.subtitle}>Convierte YouTube a MP3</Text>
      <Text style={styles.welcome}>¡Bienvenido! Pega una URL de YouTube y descarga tu MP3 gratis.</Text>

      {/* Estado: idle */}
      {status === "idle" && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Pega aquí la URL de YouTube"
            placeholderTextColor="#888"
            value={url}
            onChangeText={setUrl}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity style={styles.button} onPress={handleDownload}>
            <Text style={styles.buttonText}>Descargar MP3</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Estado: loading */}
      {status === "loading" && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF0000" />
          <Text style={styles.loadingText}>{message}</Text>
          <TouchableOpacity style={styles.cancelButton} onPress={handleReset}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Estado: completed */}
      {status === "completed" && (
        <View style={styles.resultContainer}>
          <Text style={styles.successText}>✓ {message}</Text>
          <TouchableOpacity style={styles.button} onPress={handleOpenMp3}>
            <Text style={styles.buttonText}>Abrir MP3</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Nueva descarga</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Estado: error */}
      {status === "error" && (
        <View style={styles.resultContainer}>
          <Text style={styles.errorText}>✗ {message}</Text>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Intentar de nuevo</Text>
          </TouchableOpacity>
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 48,
  },
  inputContainer: {
    width: "100%",
  },
  input: {
    backgroundColor: "#1a1a1a",
    color: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#333",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#007BFF",
    borderRadius: 8,
    padding: 16,

    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    color: "#888",
    fontSize: 14,
  },
  cancelButton: {
    marginTop: 8,
  },
  cancelButtonText: {
    color: "#FF0000",
    fontSize: 14,
  },
  resultContainer: {
    width: "100%",
    alignItems: "center",
    gap: 16,
  },
  successText: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  errorText: {
    color: "#FF0000",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  resetButton: {
    marginTop: 8,
  },
  resetButtonText: {
    color: "#888",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  welcome: {
    fontSize: 12,
    color: "#555",
    textAlign: "center",
    marginBottom: 32,
  },
});
