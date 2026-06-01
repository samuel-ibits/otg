import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Modal } from 'react-native';

const MessagingApp = () => {
    const [currentScreen, setCurrentScreen] = useState('chatList');
    const [selectedChat, setSelectedChat] = useState(null);
    const [showNewChat, setShowNewChat] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const contacts = [
        { id: 1, name: 'Johnathan Smith', avatar: '👤', lastSeen: 'Yesterday' },
        { id: 2, name: 'Clara Kirk', avatar: '👤', lastSeen: '2 days ago' },
        { id: 3, name: 'Oscar John', avatar: '👤', lastSeen: '1 week ago' },
        { id: 4, name: 'Mike Sonne', avatar: '👤', lastSeen: '3 days ago' },
        { id: 5, name: 'Jean Bailey', avatar: '👤', lastSeen: 'Last month' },
    ];

    const [chats, setChats] = useState([
        { id: 1, name: 'Jared', avatar: '👤', message: 'Sure, I will be there', time: '12:35 PM', unread: 0 },
        { id: 2, name: 'Jane Doe', avatar: '👤', message: 'Thanks for the update', time: '11:28 AM', unread: 2 },
        { id: 3, name: 'Smokey', avatar: '👤', message: 'See you tomorrow', time: '10:15 AM', unread: 0 },
        { id: 4, name: 'Anonymous', avatar: '👤', message: 'Got it', time: '9:42 AM', unread: 1 },
        { id: 5, name: 'Ashleigh', avatar: '👤', message: 'Perfect!', time: '8:30 AM', unread: 0 },
        { id: 6, name: 'Sarah', avatar: '👤', message: 'Thank you!', time: 'Yesterday', unread: 0 },
    ]);

    const [messages, setMessages] = useState([
        { id: 1, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque lobortis commodo nunc eget congue. Sed facilisis ligula sed ex', sender: 'them', time: '10:30 am' },
        { id: 2, text: 'Hello', sender: 'me', time: '10:35 am' },
    ]);

    const handleSendMessage = () => {
        if (messageText.trim()) {
            setMessages([...messages, {
                id: messages.length + 1,
                text: messageText,
                sender: 'me',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
            setMessageText('');
        }
    };

    const handleStartChat = (contact) => {
        setSelectedChat(contact);
        setShowNewChat(false);
        setCurrentScreen('chat');
    };

    const filteredChats = chats.filter(chat => {
        if (activeTab === 'unread') return chat.unread > 0;
        if (activeTab === 'requests') return false;
        return true;
    });

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Chat List Screen
    const ChatListScreen = () => (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ padding: 16, paddingTop: 50, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <Text style={{ fontSize: 28, fontWeight: '600' }}>Chats</Text>
                    <View style={{ flexDirection: 'row', gap: 16 }}>
                        <Text style={{ fontSize: 20 }}>🔍</Text>
                        <Text style={{ fontSize: 20 }}>⋯</Text>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity
                        onPress={() => setActiveTab('all')}
                        style={{
                            paddingVertical: 6,
                            paddingHorizontal: 16,
                            borderRadius: 16,
                            backgroundColor: activeTab === 'all' ? '#007AFF' : '#f0f0f0'
                        }}>
                        <Text style={{ color: activeTab === 'all' ? '#fff' : '#000', fontSize: 14 }}>All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab('unread')}
                        style={{
                            paddingVertical: 6,
                            paddingHorizontal: 16,
                            borderRadius: 16,
                            backgroundColor: activeTab === 'unread' ? '#007AFF' : '#f0f0f0'
                        }}>
                        <Text style={{ color: activeTab === 'unread' ? '#fff' : '#000', fontSize: 14 }}>Unread</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab('requests')}
                        style={{
                            paddingVertical: 6,
                            paddingHorizontal: 16,
                            borderRadius: 16,
                            backgroundColor: activeTab === 'requests' ? '#007AFF' : '#f0f0f0'
                        }}>
                        <Text style={{ color: activeTab === 'requests' ? '#fff' : '#000', fontSize: 14 }}>Requests</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={{ flex: 1 }}>
                {filteredChats.map(chat => (
                    <TouchableOpacity
                        key={chat.id}
                        onPress={() => {
                            setSelectedChat(chat);
                            setCurrentScreen('chat');
                        }}
                        style={{
                            flexDirection: 'row',
                            padding: 16,
                            borderBottomWidth: 1,
                            borderBottomColor: '#f0f0f0'
                        }}>
                        <View style={{
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            backgroundColor: '#e0e0e0',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: 12
                        }}>
                            <Text style={{ fontSize: 24 }}>{chat.avatar}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                                <Text style={{ fontSize: 16, fontWeight: '600' }}>{chat.name}</Text>
                                <Text style={{ fontSize: 12, color: '#666' }}>{chat.time}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontSize: 14, color: '#666' }} numberOfLines={1}>{chat.message}</Text>
                                {chat.unread > 0 && (
                                    <View style={{
                                        backgroundColor: '#007AFF',
                                        borderRadius: 10,
                                        width: 20,
                                        height: 20,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>{chat.unread}</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <TouchableOpacity
                onPress={() => setShowNewChat(true)}
                style={{
                    position: 'absolute',
                    bottom: 80,
                    right: 20,
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: '#007AFF',
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5
                }}>
                <Text style={{ color: '#fff', fontSize: 32, marginTop: -4 }}>+</Text>
            </TouchableOpacity>

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                paddingVertical: 12,
                borderTopWidth: 1,
                borderTopColor: '#e0e0e0',
                backgroundColor: '#fff'
            }}>
                <Text style={{ fontSize: 24 }}>💬</Text>
                <Text style={{ fontSize: 24 }}>📞</Text>
                <Text style={{ fontSize: 24 }}>➕</Text>
                <Text style={{ fontSize: 24 }}>👤</Text>
                <View style={{ position: 'relative' }}>
                    <Text style={{ fontSize: 24 }}>⚙️</Text>
                    <View style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#007AFF'
                    }} />
                </View>
            </View>
        </View>
    );

    // New Chat Modal
    const NewChatModal = () => (
        <Modal visible={showNewChat} animationType="slide">
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={{ padding: 16, paddingTop: 50, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                        <TouchableOpacity onPress={() => setShowNewChat(false)}>
                            <Text style={{ fontSize: 24, marginRight: 12 }}>✕</Text>
                        </TouchableOpacity>
                        <Text style={{ fontSize: 20, fontWeight: '600', flex: 1, textAlign: 'center' }}>New chat</Text>
                        <View style={{ width: 24 }} />
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#f0f0f0',
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 8
                    }}>
                        <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
                        <TextInput
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholder="Search"
                            style={{ flex: 1, fontSize: 16 }}
                        />
                    </View>
                </View>

                <Text style={{ padding: 16, fontSize: 12, color: '#666', textTransform: 'uppercase' }}>
                    People you follow
                </Text>

                <ScrollView>
                    {filteredContacts.map(contact => (
                        <TouchableOpacity
                            key={contact.id}
                            onPress={() => handleStartChat(contact)}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                padding: 16,
                                borderBottomWidth: 1,
                                borderBottomColor: '#f0f0f0'
                            }}>
                            <View style={{
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                                backgroundColor: '#e0e0e0',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 12
                            }}>
                                <Text style={{ fontSize: 24 }}>{contact.avatar}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 2 }}>{contact.name}</Text>
                                <Text style={{ fontSize: 14, color: '#666' }}>{contact.lastSeen}</Text>
                            </View>
                            <View style={{
                                width: 24,
                                height: 24,
                                borderRadius: 12,
                                borderWidth: 1,
                                borderColor: '#ccc'
                            }} />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </Modal>
    );

    // Chat Screen
    const ChatScreen = () => (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{
                padding: 16,
                paddingTop: 50,
                borderBottomWidth: 1,
                borderBottomColor: '#e0e0e0',
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <TouchableOpacity onPress={() => setCurrentScreen('chatList')}>
                    <Text style={{ fontSize: 24, marginRight: 12 }}>←</Text>
                </TouchableOpacity>
                <View style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: '#e0e0e0',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12
                }}>
                    <Text style={{ fontSize: 20 }}>👤</Text>
                </View>
                <Text style={{ fontSize: 18, fontWeight: '600', flex: 1 }}>{selectedChat?.name || 'John doe'}</Text>
                <Text style={{ fontSize: 20 }}>⋮</Text>
            </View>

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: '#e0e0e0'
            }}>
                <Text style={{ fontSize: 14, color: '#666' }}>Photos</Text>
                <Text style={{ fontSize: 14, color: '#666' }}>Videos</Text>
                <Text style={{ fontSize: 14, color: '#666' }}>Documents</Text>
                <Text style={{ fontSize: 14, color: '#666' }}>Links</Text>
            </View>

            <ScrollView style={{ flex: 1, padding: 16 }}>
                <Text style={{ textAlign: 'center', color: '#666', fontSize: 12, marginBottom: 20 }}>Today</Text>

                {messages.map(msg => (
                    <View
                        key={msg.id}
                        style={{
                            alignSelf: msg.sender === 'me' ? 'flex-end' : 'flex-start',
                            maxWidth: '75%',
                            marginBottom: 12
                        }}>
                        <View style={{
                            backgroundColor: msg.sender === 'me' ? '#007AFF' : '#f0f0f0',
                            borderRadius: 16,
                            padding: 12
                        }}>
                            <Text style={{ color: msg.sender === 'me' ? '#fff' : '#000', fontSize: 15 }}>
                                {msg.text}
                            </Text>
                        </View>
                        <Text style={{
                            fontSize: 11,
                            color: '#666',
                            marginTop: 4,
                            textAlign: msg.sender === 'me' ? 'right' : 'left'
                        }}>
                            {msg.time}
                        </Text>
                    </View>
                ))}
            </ScrollView>

            <View style={{
                flexDirection: 'row',
                padding: 12,
                alignItems: 'center',
                borderTopWidth: 1,
                borderTopColor: '#e0e0e0'
            }}>
                <TouchableOpacity style={{ marginRight: 8 }}>
                    <Text style={{ fontSize: 24 }}>😊</Text>
                </TouchableOpacity>
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    backgroundColor: '#f0f0f0',
                    borderRadius: 20,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    alignItems: 'center'
                }}>
                    <TextInput
                        value={messageText}
                        onChangeText={setMessageText}
                        placeholder='"The"'
                        style={{ flex: 1, fontSize: 16 }}
                    />
                    <Text style={{ fontSize: 16, color: '#666', marginLeft: 8 }}>the</Text>
                    <Text style={{ fontSize: 16, color: '#666', marginLeft: 8 }}>to</Text>
                </View>
                <TouchableOpacity onPress={handleSendMessage} style={{ marginLeft: 8 }}>
                    <View style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: '#007AFF',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{ color: '#fff', fontSize: 18 }}>↑</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            {currentScreen === 'chatList' ? <ChatListScreen /> : <ChatScreen />}
            <NewChatModal />
        </View>
    );
};

export default MessagingApp;