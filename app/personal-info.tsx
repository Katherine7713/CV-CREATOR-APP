import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { InputField } from '../components/InputField';
import { NavigationButton } from '../components/NavigationButton';
import { useCVContext } from '../context/CVContext';
import { PersonalInfo } from "../types/cv.types";

const EPN_BLUE = "#003366";

export default function PersonalInfoScreen() {
    const router = useRouter();
    const { cvData, updatePersonalInfo } = useCVContext();
    const { control, handleSubmit, reset, formState: { errors } } = useForm<PersonalInfo>({
        defaultValues: cvData.personalInfo,
        mode: 'onChange',
    });

    useEffect(() => {
        reset(cvData.personalInfo);
    }, [cvData.personalInfo]);

    const onSubmit = (data: PersonalInfo) => {
        updatePersonalInfo(data);
        Alert.alert("Éxito", "Información guardada correctamente.", [
            { text: "OK", onPress: () => router.back() },
        ]);
    };


    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.headerTitle}>Datos Personales</Text>
                
                <Controller
                    control={control}
                    name="fullName"
                    rules={{ 
                        required: "La institución es obligatoria",
                        pattern: {
                        value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                        message: "Solo se permiten letras (sin números)"
                        }
                    }}
                    render={({ field: { onChange, value } }) => (
                        <InputField
                            label="Nombre Completo *"
                            placeholder="Ej: Juan Pérez"
                            value={value}
                            onChangeText={onChange}
                            error={errors.fullName?.message}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="email"
                    rules={{ required: "El email es obligatorio",
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "El email no es válido",
                        }
                    }}
                    render={({ field: { onChange, value } }) => (
                        <InputField
                            label="Email *"
                            placeholder="juan@email.com"
                            value={value}
                            onChangeText={onChange}
                            error={errors.email?.message}
                            keyboardType="email-address"
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="phone"
                    rules={{ required: "El teléfono es obligatorio",
                        pattern: {
                            value: /^[0-9]+$/,
                            message: "Solo se permiten números"
                        }
                    }}
                    render={({ field: { onChange, value } }) => (
                        <InputField
                            label="Teléfono *"
                            placeholder="+593 ..."
                            value={value}
                            onChangeText={onChange}
                            error={errors.phone?.message}
                            keyboardType="phone-pad"
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="location"
                    rules={{ 
                        required: "La ubicación es obligatoria",
                        pattern: {
                            value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                            message: "Solo se permiten letras (sin números)"
                        }
                    }}
                    render={({ field: { onChange, value } }) => (
                        <InputField
                            label="Ubicación *"
                            placeholder="Quito, Ecuador"
                            value={value}
                            onChangeText={onChange}
                            error={errors.location?.message}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="summary"
                    rules={{
                       pattern: {
                            value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                            message: "Solo se permiten letras (sin números)"
                        }
                    }}
                    render={({ field: { onChange, value } }) => (
                        <InputField
                            label="Resumen Profesional"
                            placeholder="Breve descripción..."
                            value={value}
                            onChangeText={onChange}
                            multiline
                            numberOfLines={4}
                            style={{ height: 100, textAlignVertical: 'top' }}
                        />
                    )}
                />

                <NavigationButton title="Guardar Cambios" onPress={handleSubmit(onSubmit)} />
                <NavigationButton title="Cancelar" onPress={() => router.back()} variant="secondary" />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        padding: 20,
    },
    headerTitle: { 
        fontSize: 22, 
        fontWeight: "bold", 
        color: EPN_BLUE, 
        marginBottom: 20, 
        textAlign: 'center',
        borderBottomWidth: 1,
        borderBottomColor: EPN_BLUE + "30",
        paddingBottom: 10
    },
});