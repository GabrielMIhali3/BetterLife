import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomToolbar from '../components/BottomToolbar/BottomToolbar.jsx';
import {askChatBot} from '../services/ChatBotService.js';
import DashboardIcon from '../assets/dashboardIcon.svg';

const UserMessage = ({ text }) => (
    <View style={[styles.messageBox, styles.userMessage]}>
        <Text style={styles.messageText}>{text}</Text>
    </View>
);

const BotMessage = ({ text }) => (
    <View style={[styles.messageBox, styles.botResponse]}>
        <Text style={styles.messageText}>{text}</Text>
    </View>
);

const ChatbotScreen = ({ navigation }) => {
    const [messages, setMessages] = React.useState([]);
    const [inputText, setInputText] = React.useState('');
    const [loading, setLoading] = React.useState(false);


    const [isKeyboardVisible, setKeyboardVisible] = React.useState(false);

    const sendMessage = () => {
        if (inputText.trim() === '') return;
        setMessages([...messages, {text: inputText, sender: 'user'}])
        const data = {
            'prompt': inputText
        }
        setInputText('');
        setMessages(prevMessages => [...prevMessages, { text: '...', sender: 'bot' }]);
        askChatBot(data).then((response) => {
        console.log(response.data);
        setMessages(prevMessages => {
            const newMessages = [...prevMessages];
            newMessages.pop();
            setLoading(false);
            return [...newMessages, { text: response.data['response'], sender: 'bot' }];
        });
    })
    .catch(err => {
        console.log(err.response?.data || err.message);
    });
  }

    React.useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                    <Text style={styles.header}>Chatbot</Text>
                    <TouchableOpacity style={styles.dashboardIcon} onPress={()=>{
            navigation.navigate("Dashboard");
          }}><DashboardIcon/></TouchableOpacity>

            </View>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.containerTitleChatBot}>
                    <View style={styles.chatContainer}>
                        <BotMessage text="Hey there! 😊 I'm here to help. What would you like to ask?" />
                        {messages.map((msg, index) =>
                            msg.sender === 'user' ? (
                                <UserMessage key={index} text={msg.text} />
                            ) : (
                                <BotMessage key={index} text={msg.text} />
                            )
                        )}
                    </View>
                </View>
            </ScrollView>

            <View style={[styles.inputContainer, { marginBottom: isKeyboardVisible ? -70 : 45 }]}>
                <TextInput style={styles.input} placeholder="Type your question here..." value={inputText} onChangeText={setInputText} />
                <TouchableOpacity style={styles.sendButton} onPress={()=>{ 
                    if(!loading)  {
                    setLoading(true);
                    sendMessage();
                    } else {
                        alert("Chatbot is still loading!");
                    }
                    }}>
                    <Ionicons name="send" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {!isKeyboardVisible && (
                <BottomToolbar navigation={navigation} selectedTab='Chatbot' style={styles.bottomToolbar} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 65,
        flex: 1,
        paddingBottom: 80,
    },
    scrollView: {
        flexGrow: 1,
        paddingBottom: 100,
    },
    containerTitleChatBot: {
        flex: 1,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    backButton: {
        marginRight: 10,
    },
    header: {
        fontSize: 35,
        fontWeight: 'bold',
    },
    chatContainer: {
        flex: 1,
        paddingHorizontal: 24,
    },
    messageBox: {
        backgroundColor: '#A7D397',
        padding: 12,
        borderRadius: 10,
        marginVertical: 4,
        alignSelf: 'flex-start',
    },
    botResponse: {
        alignSelf: 'flex-start',
        backgroundColor: '#68bc5c',
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#4A90E2',
    },
    messageText: {
        color: 'white',
        fontSize: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 25,
        marginHorizontal: 16,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingHorizontal: 10,
    },
    sendButton: {
        backgroundColor: '#6DBE61',
        padding: 10,
        borderRadius: 50,
        marginLeft: 8,
    },
    bottomToolbar: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    dashboardIcon: {
        position:'absolute',
        top: 0,
        right: 20,
        zIndex: 999,
      },
});

export default ChatbotScreen;
