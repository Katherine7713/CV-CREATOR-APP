import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { InputField } from "../components/InputField";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "../context/CVContext";
import { Experience } from "../types/cv.types";

const EPN_BLUE = "#003366";
const EPN_RED = "#CC0000";

export default function ExperienceScreen() {
  const router = useRouter();
  const { cvData, addExperience, deleteExperience } = useCVContext();

  const { control, handleSubmit, reset, formState: { errors } } = useForm<Omit<Experience, "id">>({
    defaultValues: {
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  });

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const onSubmit = (data: Omit<Experience, "id">) => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      ...data,
    };
    addExperience(newExperience);
    reset();
    Alert.alert("Éxito", "Experiencia agregada correctamente");
  };

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar", "¿Estás seguro de eliminar esta experiencia?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: () => deleteExperience(id) },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Experiencia Profesional</Text>

        <Controller
          control={control}
          name="company"
          rules={{ 
            required: "La empresa es obligatoria",
            pattern: { value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, message: "Solo letras" }
          }}
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Empresa *"
              placeholder="Nombre de la empresa"
              value={value}
              onChangeText={onChange}
              error={errors.company?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="position"
          rules={{ 
            required: "El cargo es obligatorio",
            pattern: { value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, message: "Solo letras" }
          }}
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Cargo *"
              placeholder="Tu posición"
              value={value}
              onChangeText={onChange}
              error={errors.position?.message}
            />
          )}
        />

        <Text style={styles.labelP}>Fecha de Inicio *</Text>
        <Controller
          control={control}
          name="startDate"
          rules={{ required: "Selecciona una fecha" }}
          render={({ field: { onChange, value } }) => (
            <View>
              <TouchableOpacity 
                style={[styles.dateButton, errors.startDate && styles.errorBorder]} 
                onPress={() => setShowStartPicker(true)}
              >
                <Text style={styles.dateText}>{value || "Seleccionar Fecha"}</Text>
              </TouchableOpacity>
              {showStartPicker && (
                <DateTimePicker
                  value={value ? new Date(value) : new Date()}
                  mode="date"
                  display="spinner"
                  onChange={(event, date) => {
                    setShowStartPicker(false);
                    if (date) onChange(date.toISOString().split('T')[0]);
                  }}
                />
              )}
              {errors.startDate && <Text style={styles.errorLabel}>{errors.startDate.message}</Text>}
            </View>
          )}
        />

        <Text style={styles.labelP}>Fecha de Fin</Text>
        <Controller
          control={control}
          name="endDate"
          render={({ field: { onChange, value } }) => (
            <View>
              <TouchableOpacity style={styles.dateButton} onPress={() => setShowEndPicker(true)}>
                <Text style={styles.dateText}>{value || "Seleccionar Fecha (o vacío)"}</Text>
              </TouchableOpacity>
              {showEndPicker && (
                <DateTimePicker
                  value={value ? new Date(value) : new Date()}
                  mode="date"
                  display="spinner"
                  onChange={(event, date) => {
                    setShowEndPicker(false);
                    if (date) onChange(date.toISOString().split('T')[0]);
                  }}
                />
              )}
            </View>
          )}
        />

        <NavigationButton title="Agregar Experiencia" onPress={handleSubmit(onSubmit)} />

        {cvData.experiences.map((exp) => (
          <View key={exp.id} style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{exp.position}</Text>
              <Text style={styles.cardSubtitle}>{exp.company}</Text>
              <Text style={styles.cardDate}>{exp.startDate} / {exp.endDate || "Actual"}</Text>
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(exp.id)}>
              <Text style={styles.deleteButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}

        <NavigationButton title="Volver" onPress={() => router.back()} variant="secondary" style={{ marginTop: 10 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },

  content: {
    padding: 20,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#003366",
    marginBottom: 16,
  },

  labelP: {
    fontSize: 16,
    fontWeight: "600",
    color: "#003366",
    marginTop: 10,
    marginBottom: 5,
  },

  dateButton: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D5D8DC",
    marginBottom: 5,
  },

  dateText: {
    color: "#1B2631",
  },

  errorBorder: {
    borderColor: EPN_RED,
  },

  errorLabel: {
    color: EPN_RED,
    fontSize: 12,
    marginBottom: 10,
  },

  listTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: EPN_BLUE,
    marginTop: 24,
    marginBottom: 12,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    borderLeftWidth: 4,
    borderLeftColor: EPN_BLUE,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: EPN_BLUE,
    marginBottom: 4,
  },

  cardSubtitle: {
    fontSize: 14,
    color: "#566573",
    marginBottom: 4,
  },

  cardDate: {
    fontSize: 12,
    color: "#566573",
  },

  deleteButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: EPN_RED,
    justifyContent: "center",
    alignItems: "center",
  },

  deleteButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});