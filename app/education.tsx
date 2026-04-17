import { Picker } from '@react-native-picker/picker';
import { useRouter } from "expo-router";
import React from "react";
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
import { Education } from "../types/cv.types";

const EPN_BLUE = "#003366";
const EPN_RED = "#CC0000";

export default function EducationScreen() {
  const router = useRouter();
  const { cvData, addEducation, deleteEducation } = useCVContext();

  const { control, handleSubmit, reset, formState: { errors } } = useForm<Omit<Education, "id">>({
    defaultValues: {
      institution: "",
      degree: "",
      field: "",
      graduationYear: "",
    },
  });

  const years = Array.from({ length: 2030 - 1970 + 1 }, (_, i) => (2030 - i).toString());

  const onSubmit = (data: Omit<Education, "id">) => {
    const newEducation: Education = {
      id: Date.now().toString(),
      ...data,
    };
    addEducation(newEducation);
    reset();
    Alert.alert("Éxito", "Educación agregada correctamente");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Formación Académica</Text>

        <Controller
          control={control}
          name="institution"
          rules={{ 
            required: "La institución es obligatoria",
            pattern: {
              value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
              message: "Solo se permiten letras (sin números)"
            }
          }}
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Institución *"
              placeholder="Nombre de la universidad"
              value={value}
              onChangeText={onChange}
              error={errors.institution?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="degree"
          rules={{ 
            required: "El título/grado es obligatorio",
            pattern: {
              value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
              message: "El título no debe contener números"
            }
          }}
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Título/Grado *"
              placeholder="Ej: Ingeniero en Sistemas"
              value={value}
              onChangeText={onChange}
              error={errors.degree?.message}
            />
          )}
        />

        <Text style={styles.labelP}>Año de Graduación *</Text>
        <Controller
          control={control}
          name="graduationYear"
          rules={{ required: "Selecciona un año" }}
          render={({ field: { onChange, value } }) => (
            <View>
              <View style={[styles.pickerW, errors.graduationYear && styles.errorBorder]}>
                <Picker
                  selectedValue={value}
                  onValueChange={(itemValue) => onChange(itemValue)}
                >
                  <Picker.Item label="Seleccionar Año" value="" color="#999" />
                  {years.map((year) => <Picker.Item key={year} label={year} value={year} />)}
                </Picker>
              </View>
              {errors.graduationYear && <Text style={styles.errorText}>{errors.graduationYear.message}</Text>}
            </View>
          )}
        />

        <NavigationButton title="Guardar Educación" onPress={handleSubmit(onSubmit)} />
        
        {/* Listado con estilo EPN */}
        {cvData.education.map((edu) => (
          <View key={edu.id} style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{edu.degree}</Text>
              <Text style={styles.cardInstitution}>{edu.institution}</Text>
              <Text style={styles.cardDate}>{edu.graduationYear}</Text>
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteEducation(edu.id)}>
              <Text style={styles.deleteButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}

        <NavigationButton title="Volver" onPress={() => router.back()} variant="secondary" />
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
    color: EPN_BLUE,
    marginBottom: 16,
  },

  labelP: {
    fontSize: 16,
    fontWeight: "600",
    color: EPN_BLUE,
    marginTop: 10,
    marginBottom: 5,
  },

  pickerW: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D5D8DC",
    borderRadius: 8,
    marginBottom: 5,
    overflow: "hidden",
  },

  errorBorder: {
    borderColor: EPN_RED,
  },

  errorText: {
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

  cardInstitution: {
    fontSize: 14,
    color: "#566573",
    marginBottom: 2,
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
