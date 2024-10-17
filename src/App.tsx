// src/App.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 사용자 타입 정의
interface User {
  id: string; // 고유 ID 추가
  email: string;
  password: string;
  name: string;
  birthdate: string;
  gender: string;
}

// UUID 생성 함수
const generateId = () => {
  return Math.random().toString(36).substr(2, 9); // 임의의 ID 생성
}

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [isSignUpScreen, setIsSignUpScreen] = useState(false); // 회원가입 화면 여부

  useEffect(() => {
    const loadUsers = async () => {
      const storedUsers = await AsyncStorage.getItem('users');
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      }
    };

    loadUsers();
  }, []);

  const handleLogin = () => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setIsLoggedIn(true);
      resetForm();
    } else {
      Alert.alert('오류', '잘못된 이메일 또는 비밀번호입니다.');
    }
  };

  const handleSignUp = async () => {
    if (email && password && name && birthdate && gender) {
      const newUser: User = { id: generateId(), email, password, name, birthdate, gender }; // 고유 ID 추가
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
      Alert.alert('회원가입 성공', '회원가입이 완료되었습니다.');
      resetForm();
      setIsSignUpScreen(false); // 회원가입 후 로그인 화면으로 돌아감
    } else {
      Alert.alert('오류', '모든 필드를 입력해주세요.');
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setBirthdate('');
    setGender('');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <View style={styles.container}>
      {isLoggedIn ? (
        <View>
          <Text style={styles.title}>로그인 완료</Text>
          <FlatList
            data={users}
            keyExtractor={(item) => item.id} // 고유 ID를 키로 사용
            renderItem={({ item }) => (
              <Text>{`이름: ${item.name}, 이메일: ${item.email}, 생년월일: ${item.birthdate}, 성별: ${item.gender}`}</Text>
            )}
          />
          <Button title="로그아웃" onPress={handleLogout} />
        </View>
      ) : isSignUpScreen ? (
        <View>
          <Text style={styles.title}>회원가입</Text>
          <TextInput
            style={styles.input}
            placeholder="이메일"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="비밀번호"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="이름"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="생년월일 (YYYY-MM-DD)"
            value={birthdate}
            onChangeText={setBirthdate}
          />
          <TextInput
            style={styles.input}
            placeholder="성별"
            value={gender}
            onChangeText={setGender}
          />
          <Button title="회원가입" onPress={handleSignUp} />
          <Button title="로그인 화면으로 돌아가기" onPress={() => setIsSignUpScreen(false)} />
        </View>
      ) : (
        <View>
          <Text style={styles.title}>로그인</Text>
          <TextInput
            style={styles.input}
            placeholder="이메일"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="비밀번호"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button title="로그인" onPress={handleLogin} />
          <Button title="회원가입하러 가기" onPress={() => setIsSignUpScreen(true)} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default App;
