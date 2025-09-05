import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const TypingPlaceholder = ({ messageAI }) => {
  const [dots, setDots] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.textAreaContainer}>
      <LinearGradient
        colors={['#7D2AE8', '#3F9FFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.textAreaBorder}
      >
        <View style={styles.textArea}>
          {messageAI ? (
            <Animated.Text style={[styles.textAreaInput, { opacity: fadeAnim }]}>
              {messageAI}
            </Animated.Text>
          ) : (
            <Animated.Text style={[styles.textAreaInput, { opacity: fadeAnim }]}>
              {`AI is typing${dots}`}
            </Animated.Text>
          )}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  textAreaContainer: {
    marginTop: 10,
  },
  textAreaBorder: {
    borderRadius: 12,
    padding: 2,
  },
  textArea: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    minHeight: 100,
    justifyContent: 'flex-start',
  },
  textAreaInput: {
    fontSize: 15,
    color: '#7A5EB5',
    fontWeight: '500',
  },
});

export default TypingPlaceholder;
