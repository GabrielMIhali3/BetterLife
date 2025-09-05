import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Checkbox from 'expo-checkbox';
import { AppUserContext } from '../contexts/AppUserContext';
import { createUser } from '../services/UserService';

const options = {
    allergies: ['Peanut allergy', 'Tree nut allergy', 'Milk allergy', 'Egg allergy', 'Soy allergy', 'Wheat allergy', 'Sesame allergy'],
    intolerances: ['Lactose intolerance', 'Gluten intolerance', 'Fructose intolerance'],
    diseases: ['Diabetes', 'Hypertension', 'High cholesterol', 'Kidney disease', 'Gout', 'Gastroesophageal reflux disease']
};

const HealthPreferencesScreen = ({ navigation }) => {
    const {appUser, setAppUser} = useContext(AppUserContext);
    const [selected, setSelected] = useState({ allergies: [], intolerances: [], diseases: [] });

    const toggleSelection = (category, item) => {
        setSelected(prevState => {
            const updatedList = prevState[category].includes(item)
                ? prevState[category].filter(i => i !== item)
                : [...prevState[category], item];
            return { ...prevState, [category]: updatedList };
        });
    };

    console.log("This is the user data currently stored in the health screen:");
    console.log(appUser);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={{top:50}}>
            <Text style={styles.title}>Personalize Your Experience</Text>
            <Text style={styles.subtitle}>To help us provide better recommendations, please select any that apply to you.</Text>

            {Object.entries(options).map(([category, items]) => (
                <View key={category} style={styles.section}>
                    <Text style={styles.sectionTitle}>Do you have any {category}?</Text>
                    <View style={styles.optionsContainer}>
                        {items.map(item => (
                            <TouchableOpacity key={item} style={styles.option} onPress={() => toggleSelection(category, item)}>
                                <Checkbox
                                    value={selected[category].includes(item)}
                                    onValueChange={() => toggleSelection(category, item)}
                                    color="#6DBE61"
                                />
                                <Text style={styles.optionText}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            ))}

            </View>
            <TouchableOpacity style={styles.button} onPress={() => {
                console.log(selected);
                var user = appUser;
                user["allergies"] = selected["allergies"];
                user["intolerances"] = selected["intolerances"];
                user["diseases"] = selected["diseases"];
                setAppUser(user);
                const result = createUser(user).catch(err => { console.log(err.response.data)});
                console.log(result.data);
                navigation.navigate("Login");
                }}>
                <Text style={styles.buttonText}>SignUp</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#F8F8F8',
        alignItems: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    section: {
        width: '100%',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        backgroundColor: '#A7D397',
        padding: 10,
        borderRadius: 8,
        textAlign: 'center',
        marginBottom: 10,
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 20,
        margin: 5,
        borderWidth: 1,
        borderColor: '#6DBE61',
    },
    optionText: {
        marginLeft: 8,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#6DBE61',
        padding: 12,
        borderRadius: 8,
        width: '80%',
        alignItems: 'center',
        marginTop: 60,
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
});

export default HealthPreferencesScreen;
