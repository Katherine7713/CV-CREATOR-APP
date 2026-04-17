import { CVPreview } from "@/components/CVPreview";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useCVContext } from "../context/CVContext";

export default function PreviewScreen() {
    const { cvData } = useCVContext();

    return (
        <View style={styles.container}>
            <CVPreview cvData={cvData} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
});