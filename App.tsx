// App.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 사용자 정보 타입 정의
interface User {
  phone: string;
  name: string;
  birthdate: string;
  gender: string;
}

const App = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState('');
  const [users, setUsers] = useState<User[]>([]); // 여기에서 User[] 타입 지정
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      const storedUsers = await AsyncStorage.getItem('users');
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      }
    };
    loadUsers();
  }, []);

  const handleSignUp = async () => {
    if (!/^\d{10}$/.test(phone)) {
      Alert.alert('유효하지 않은 전화번호입니다.');
      return;
    }
    if (password.length < 8 || !/[!@#$%^&*]/.test(password)) {
      Alert.alert('비밀번호는 8자 이상이어야 하며 기호를 포함해야 합니다.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthdate)) {
      Alert.alert('생년월일은 YYYY-MM-DD 형식이어야 합니다.');
      return;
    }

    const newUser: User = { phone, name, birthdate, gender }; // User 타입 지정
    const updatedUsers = [...users, newUser];
    await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    Alert.alert('회원가입이 완료되었습니다.');
    resetForm();
  };

  const handleLogin = () => {
    const user = users.find((u) => u.phone === phone);
    if (user) {
      setIsLoggedIn(true);
    } else {
      Alert.alert('로그인 실패: 전화번호가 일치하지 않습니다.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const resetForm = () => {
    setPhone('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setBirthdate('');
    setGender('');
  };

  return (
    <View style={{ padding: 20 }}>
      {!isLoggedIn ? (
        <View>
          <TextInput
            placeholder="전화번호 (기호 없이 10자리)"
            value={phone}
            onChangeText={setPhone}
            keyboardType="numeric"
          />
          <TextInput
            placeholder="비밀번호"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <TextInput
            placeholder="이름"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            placeholder="생년월일 (YYYY-MM-DD)"
            value={birthdate}
            onChangeText={setBirthdate}
          />
          <TextInput
            placeholder="성별"
            value={gender}
            onChangeText={setGender}
          />
          <Button title="회원가입" onPress={handleSignUp} />
          <Button title="로그인" onPress={handleLogin} />
        </View>
      ) : (
        <View>
          <FlatList
            data={users}
            keyExtractor={(item) => item.phone}
            renderItem={({ item }) => (
              <Text>{`${item.name}, ${item.birthdate}, ${item.gender}`}</Text>
            )}
          />
          <Button title="로그아웃" onPress={handleLogout} />
        </View>
      )}
    </View>
  );
};

export default App;
