import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, FlatList, SafeAreaView, StatusBar, Modal } from 'react-native';

// Mock data
const communities = [
    { id: '1', name: 'Cozy Café Spots', image: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=100&h=100&fit=crop', members: 1234 },
    { id: '2', name: 'BAR', image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=100&h=100&fit=crop', members: 567 },
    { id: '3', name: 'Photography Lovers', image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=100&h=100&fit=crop', members: 890 },
];

const members = [
    { id: '1', name: 'Jane Doe', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: '2', name: 'Samantha Smith', avatar: 'https://i.pravatar.cc/150?img=5' },
    { id: '3', name: 'Tommy Gervaz', avatar: 'https://i.pravatar.cc/150?img=12' },
    { id: '4', name: 'Mike Simone', avatar: 'https://i.pravatar.cc/150?img=13' },
    { id: '5', name: 'Jane Davis', avatar: 'https://i.pravatar.cc/150?img=9' },
];

const tags = ['Gaming', 'Coding', 'Music', 'Movies & TV', 'Animal', 'Anime', 'Workout', 'Food', 'Travel', 'Lifestyle', 'Fashion', 'Sports & Fitness', 'Film', 'Comic & Anime', 'Shop'];

// Communities List Screen
const CommunitiesScreen = ({ onNavigate }) => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <StatusBar barStyle="dark-content" />
            <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                    <Text style={{ fontSize: 28, fontWeight: 'bold', flex: 1 }}>Community</Text>
                    <TouchableOpacity>
                        <Text style={{ fontSize: 24 }}>⚙️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onNavigate={() => onNavigate('search')}>
                        <Text style={{ fontSize: 24, marginLeft: 16 }}>🔍</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={{ flex: 1 }}>
                {communities.map((community) => (
                    <TouchableOpacity
                        key={community.id}
                        onPress={() => onNavigate('communityInfo')}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingHorizontal: 16,
                            paddingVertical: 12,
                            borderBottomWidth: 1,
                            borderBottomColor: '#f0f0f0',
                        }}
                    >
                        <Image
                            source={{ uri: community.image }}
                            style={{ width: 60, height: 60, borderRadius: 12, marginRight: 12 }}
                        />
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 4 }}>
                                {community.name}
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {[1, 2, 3, 4].map((i) => (
                                    <Image
                                        key={i}
                                        source={{ uri: `https://i.pravatar.cc/150?img=${i}` }}
                                        style={{
                                            width: 24,
                                            height: 24,
                                            borderRadius: 12,
                                            marginLeft: i > 1 ? -8 : 0,
                                            borderWidth: 2,
                                            borderColor: '#fff',
                                        }}
                                    />
                                ))}
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: '#f0f0f0' }}>
                <TouchableOpacity
                    onPress={() => onNavigate('createCommunity')}
                    style={{
                        backgroundColor: '#007AFF',
                        borderRadius: 12,
                        padding: 16,
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
                        Create new community
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

// Search Screen
const SearchScreen = ({ onNavigate }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);

    const toggleTag = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter((t) => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <StatusBar barStyle="dark-content" />
            <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                    <TouchableOpacity onPress={() => onNavigate('communities')}>
                        <Text style={{ fontSize: 18 }}>←</Text>
                    </TouchableOpacity>
                    <TextInput
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="search..."
                        style={{
                            flex: 1,
                            marginLeft: 12,
                            fontSize: 16,
                            paddingVertical: 8,
                        }}
                        autoFocus
                    />
                </View>

                <View style={{ flexDirection: 'row', marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}>
                    {['Link', 'Workspace', 'Invited', 'Feed'].map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={{
                                paddingVertical: 12,
                                paddingHorizontal: 16,
                                borderBottomWidth: tab === 'Invited' ? 2 : 0,
                                borderBottomColor: '#007AFF',
                            }}
                        >
                            <Text style={{ fontSize: 14, color: tab === 'Invited' ? '#007AFF' : '#666' }}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
                    {tags.map((tag) => (
                        <TouchableOpacity
                            key={tag}
                            onPress={() => toggleTag(tag)}
                            style={{
                                paddingHorizontal: 16,
                                paddingVertical: 8,
                                borderRadius: 20,
                                backgroundColor: selectedTags.includes(tag) ? '#007AFF' : '#f0f0f0',
                                marginRight: 8,
                            }}
                        >
                            <Text style={{ color: selectedTags.includes(tag) ? '#fff' : '#333', fontSize: 14 }}>
                                {tag}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
                <View style={{ alignItems: 'center', marginBottom: 200 }}>
                    <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#f0f0f0', marginBottom: 16, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 32 }}>🔍</Text>
                    </View>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 }}>
                        Search results
                    </Text>
                    <Text style={{ fontSize: 14, color: '#666', textAlign: 'center' }}>
                        No search keyword entered
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

// Create Community Screen
const CreateCommunityScreen = ({ onNavigate }) => {
    const [communityName, setCommunityName] = useState('');
    const [description, setDescription] = useState('');
    const [visibility, setVisibility] = useState('public');
    const [selectedTags, setSelectedTags] = useState([]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <StatusBar barStyle="dark-content" />
            <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                    <TouchableOpacity onPress={() => onNavigate('communities')}>
                        <Text style={{ fontSize: 18 }}>←</Text>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, fontWeight: '600', marginLeft: 16 }}>
                        Create new community
                    </Text>
                </View>
            </View>

            <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
                <View style={{ alignItems: 'center', marginBottom: 24 }}>
                    <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 40 }}>📷</Text>
                    </View>
                    <TouchableOpacity style={{ marginTop: 12 }}>
                        <Text style={{ color: '#007AFF', fontSize: 14 }}>Upload photo</Text>
                    </TouchableOpacity>
                </View>

                <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Community name</Text>
                <TextInput
                    value={communityName}
                    onChangeText={setCommunityName}
                    placeholder="Cozy Café Spots"
                    style={{
                        borderWidth: 1,
                        borderColor: '#e0e0e0',
                        borderRadius: 8,
                        padding: 12,
                        fontSize: 16,
                        marginBottom: 20,
                    }}
                />

                <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Description</Text>
                <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder="A community of like-minded people"
                    multiline
                    numberOfLines={3}
                    style={{
                        borderWidth: 1,
                        borderColor: '#e0e0e0',
                        borderRadius: 8,
                        padding: 12,
                        fontSize: 16,
                        marginBottom: 20,
                        minHeight: 80,
                    }}
                />

                <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Visibility</Text>
                <View style={{ marginBottom: 20 }}>
                    <TouchableOpacity
                        onPress={() => setVisibility('public')}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: 12,
                            borderWidth: 1,
                            borderColor: '#e0e0e0',
                            borderRadius: 8,
                            marginBottom: 8,
                        }}
                    >
                        <View style={{
                            width: 20,
                            height: 20,
                            borderRadius: 10,
                            borderWidth: 2,
                            borderColor: '#007AFF',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 12,
                        }}>
                            {visibility === 'public' && (
                                <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#007AFF' }} />
                            )}
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 16, fontWeight: '500' }}>Public</Text>
                            <Text style={{ fontSize: 12, color: '#666' }}>Discoverable in the public feed</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setVisibility('invite')}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: 12,
                            borderWidth: 1,
                            borderColor: '#e0e0e0',
                            borderRadius: 8,
                        }}
                    >
                        <View style={{
                            width: 20,
                            height: 20,
                            borderRadius: 10,
                            borderWidth: 2,
                            borderColor: '#007AFF',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 12,
                        }}>
                            {visibility === 'invite' && (
                                <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#007AFF' }} />
                            )}
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 16, fontWeight: '500' }}>Invite-only</Text>
                            <Text style={{ fontSize: 12, color: '#666' }}>Only joinable via link, not publicly visible</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Community name</Text>
                <TextInput
                    placeholder="Cozy Café Spots"
                    style={{
                        borderWidth: 1,
                        borderColor: '#e0e0e0',
                        borderRadius: 8,
                        padding: 12,
                        fontSize: 16,
                        marginBottom: 20,
                    }}
                />
            </ScrollView>

            <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: '#f0f0f0' }}>
                <TouchableOpacity
                    onPress={() => onNavigate('communityInfo')}
                    style={{
                        backgroundColor: '#007AFF',
                        borderRadius: 12,
                        padding: 16,
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Continue</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

// Community Info Screen
const CommunityInfoScreen = ({ onNavigate }) => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <StatusBar barStyle="dark-content" />
            <View style={{ paddingHorizontal: 16, paddingTop: 16, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                <TouchableOpacity onPress={() => onNavigate('communities')}>
                    <Text style={{ fontSize: 18 }}>←</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 16, fontWeight: '600' }}>•••</Text>
            </View>

            <ScrollView style={{ flex: 1 }}>
                <View style={{ alignItems: 'center', paddingHorizontal: 16, marginBottom: 24 }}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=200&h=200&fit=crop' }}
                        style={{ width: 120, height: 120, borderRadius: 60, marginBottom: 16 }}
                    />
                    <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 4 }}>Cozy Café Spots</Text>
                    <Text style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>
                        @cozycafespots • Created by Jane Doe
                    </Text>
                    <Text style={{ fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 16 }}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus mi, ornare nec mauris sed, porta tempus dui.
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                        <Text style={{ fontSize: 14, color: '#666' }}>🔓 Invite-only</Text>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={() => onNavigate('addMembers')}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 16,
                        paddingVertical: 16,
                        borderTopWidth: 1,
                        borderBottomWidth: 1,
                        borderColor: '#f0f0f0',
                    }}
                >
                    <Text style={{ flex: 1, fontSize: 16 }}>Add members</Text>
                    <Text style={{ color: '#666' }}>→</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 16,
                        paddingVertical: 16,
                        borderBottomWidth: 1,
                        borderColor: '#f0f0f0',
                    }}
                >
                    <Text style={{ flex: 1, fontSize: 16 }}>Invite via link</Text>
                    <Text style={{ color: '#666' }}>→</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 16,
                        paddingVertical: 16,
                        borderBottomWidth: 1,
                        borderColor: '#f0f0f0',
                    }}
                >
                    <Text style={{ flex: 1, fontSize: 16 }}>Notifications</Text>
                    <Text style={{ color: '#666' }}>→</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 16,
                        paddingVertical: 16,
                        borderBottomWidth: 1,
                        borderColor: '#f0f0f0',
                    }}
                >
                    <Text style={{ flex: 1, fontSize: 16 }}>Media files</Text>
                    <Text style={{ color: '#666' }}>→</Text>
                </TouchableOpacity>

                <View style={{ paddingHorizontal: 16, paddingVertical: 20 }}>
                    <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 16 }}>GM Members</Text>
                    {members.map((member) => (
                        <View
                            key={member.id}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginBottom: 16,
                            }}
                        >
                            <Image
                                source={{ uri: member.avatar }}
                                style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }}
                            />
                            <Text style={{ flex: 1, fontSize: 16 }}>{member.name}</Text>
                            <Text style={{ color: '#666' }}>Admin</Text>
                        </View>
                    ))}
                </View>

                <TouchableOpacity style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
                    <Text style={{ color: '#FF3B30', fontSize: 16 }}>Leave community</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ paddingHorizontal: 16, paddingVertical: 16, marginBottom: 40 }}>
                    <Text style={{ color: '#FF3B30', fontSize: 16 }}>Delete community</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

// Chat Screen
const ChatScreen = ({ onNavigate }) => {
    const [message, setMessage] = useState('');

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <StatusBar barStyle="dark-content" />
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}>
                <TouchableOpacity onPress={() => onNavigate('communities')}>
                    <Text style={{ fontSize: 18 }}>←</Text>
                </TouchableOpacity>
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=100&h=100&fit=crop' }}
                    style={{ width: 40, height: 40, borderRadius: 20, marginLeft: 12, marginRight: 12 }}
                />
                <Text style={{ flex: 1, fontSize: 16, fontWeight: '600' }}>Cozy Café Spots</Text>
                <TouchableOpacity>
                    <Text style={{ fontSize: 18 }}>⋮</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 20 }}>
                <View style={{ alignItems: 'center', marginBottom: 20 }}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=100&h=100&fit=crop' }}
                        style={{ width: 80, height: 80, borderRadius: 40, marginBottom: 12 }}
                    />
                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 4 }}>Welcome to Cozy Café Spots</Text>
                    <Text style={{ fontSize: 14, color: '#666', textAlign: 'center' }}>
                        An messages both will disappear when leaving, leaving server, or request from both and it won't be stored.
                    </Text>
                </View>

                <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 12, color: '#666', textAlign: 'center', marginBottom: 12 }}>9 Nov</Text>

                    <View style={{ alignItems: 'flex-end', marginBottom: 12 }}>
                        <View style={{ backgroundColor: '#007AFF', borderRadius: 16, padding: 12, maxWidth: '80%' }}>
                            <Text style={{ color: '#fff', fontSize: 16 }}>
                                Lorem ipsum dolor sit amet consectetur, adipiscing elit. Sapien nec mauris, porta molestie justo, sagittis mauris
                            </Text>
                        </View>
                    </View>

                    <View style={{ alignItems: 'flex-end', marginBottom: 12 }}>
                        <View style={{ backgroundColor: '#007AFF', borderRadius: 16, padding: 12, maxWidth: '80%' }}>
                            <Text style={{ color: '#fff', fontSize: 16 }}>
                                Lorem ipsum dolor sit amet consectetur, adipiscing elit. Sapien nec mauris, porta molestie justo, sagittis mauris
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#f0f0f0' }}>
                <TouchableOpacity style={{ marginRight: 12 }}>
                    <Text style={{ fontSize: 24 }}>+</Text>
                </TouchableOpacity>
                <TextInput
                    value={message}
                    onChangeText={setMessage}
                    placeholder="What's on your mind"
                    style={{
                        flex: 1,
                        backgroundColor: '#f5f5f5',
                        borderRadius: 20,
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        fontSize: 16,
                    }}
                />
                <TouchableOpacity style={{ marginLeft: 12 }}>
                    <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#007AFF', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#fff', fontSize: 18 }}>→</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

// Main App Component
export default function App() {
    const [currentScreen, setCurrentScreen] = useState('communities');

    const renderScreen = () => {
        switch (currentScreen) {
            case 'communities':
                return <CommunitiesScreen onNavigate={setCurrentScreen} />;
            case 'search':
                return <SearchScreen onNavigate={setCurrentScreen} />;
            case 'createCommunity':
                return <CreateCommunityScreen onNavigate={setCurrentScreen} />;
            case 'communityInfo':
                return <CommunityInfoScreen onNavigate={setCurrentScreen} />;
            case 'chat':
                return <ChatScreen onNavigate={setCurrentScreen} />;
            default:
                return <CommunitiesScreen onNavigate={setCurrentScreen} />;
        }
    };

    return (
        <View style={{ flex: 1 }}>
            {renderScreen()}

            {/* Navigation Bar */}
            <View style={{
                flexDirection: 'row',
                backgroundColor: '#fff',
                borderTopWidth: 1,
                borderTopColor: '#f0f0f0',
                paddingBottom: 20,
            }}>
                <TouchableOpacity
                    onPress={() => setCurrentScreen('communities')}
                    style={{ flex: 1, alignItems: 'center', paddingVertical: 12 }}
                >
                    <Text style={{ fontSize: 24, marginBottom: 4 }}>👥</Text>
                    <Text style={{ fontSize: 12, color: currentScreen === 'communities' ? '#007AFF' : '#666' }}>
                        Communities
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setCurrentScreen('chat')}
                    style={{ flex: 1, alignItems: 'center', paddingVertical: 12 }}
                >
                    <Text style={{ fontSize: 24, marginBottom: 4 }}>💬</Text>
                    <Text style={{ fontSize: 12, color: currentScreen === 'chat' ? '#007AFF' : '#666' }}>
                        Messages
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ flex: 1, alignItems: 'center', paddingVertical: 12 }}>
                    <Text style={{ fontSize: 24, marginBottom: 4 }}>🔔</Text>
                    <Text style={{ fontSize: 12, color: '#666' }}>Notifications</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ flex: 1, alignItems: 'center', paddingVertical: 12 }}>
                    <Text style={{ fontSize: 24, marginBottom: 4 }}>👤</Text>
                    <Text style={{ fontSize: 12, color: '#666' }}>Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}