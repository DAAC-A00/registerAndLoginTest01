// src/App.tsx

import React, { useState, useEffect } from 'react'; // React와 상태 관리 훅(useState, useEffect)을 임포트
import { View, Text, TextInput, Button, StyleSheet, Alert, FlatList } from 'react-native'; // React Native의 UI 컴포넌트를 임포트
import AsyncStorage from '@react-native-async-storage/async-storage'; // 로컬 스토리지에 데이터를 저장하기 위한 라이브러리 임포트

// 사용자 타입 정의
interface User {
  id: string; // 고유 ID 추가
  email: string; // 사용자 이메일
  password: string; // 사용자 비밀번호
  name: string; // 사용자 이름
  birthdate: string; // 사용자 생년월일
  gender: string; // 사용자 성별
}

// UUID 생성 함수
const generateId = () => {
  return Math.random().toString(36).substr(2, 9); // 임의의 ID를 생성하여 반환
}

const App = () => {
  // 로그인 상태를 관리하는 상태 변수
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // 사용자 입력을 관리하는 상태 변수들
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState('');
  // 사용자 목록을 관리하는 상태 변수
  const [users, setUsers] = useState<User[]>([]);
  // 회원가입 화면 여부를 관리하는 상태 변수
  const [isSignUpScreen, setIsSignUpScreen] = useState(false); 

  // 컴포넌트가 처음 렌더링될 때 사용자 데이터를 로드하는 useEffect 훅
  useEffect(() => {
    const loadUsers = async () => {
      // 로컬 스토리지에서 'users' 키로 저장된 데이터 가져오기
      const storedUsers = await AsyncStorage.getItem('users');
      if (storedUsers) {
        // 가져온 데이터가 있으면 JSON 형식으로 파싱하여 상태에 설정
        setUsers(JSON.parse(storedUsers));
      }
    };

    loadUsers(); // 사용자 데이터 로드 함수 호출
  }, []); // 빈 배열을 전달하여 컴포넌트가 처음 렌더링될 때만 실행

  // 로그인 처리 함수
  const handleLogin = () => {
    // 입력한 이메일과 비밀번호로 사용자 찾기
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      // 사용자가 존재하면 로그인 상태를 true로 변경
      setIsLoggedIn(true);
      resetForm(); // 입력 필드 초기화
    } else {
      // 사용자가 없으면 오류 메시지 표시
      Alert.alert('오류', '잘못된 이메일 또는 비밀번호입니다.');
    }
  };

  // 회원가입 처리 함수
  const handleSignUp = async () => {
    // 모든 입력 필드가 채워졌는지 확인
    if (email && password && name && birthdate && gender) {
      // 새로운 사용자 객체 생성
      const newUser: User = { id: generateId(), email, password, name, birthdate, gender };
      const updatedUsers = [...users, newUser]; // 기존 사용자 목록에 새 사용자 추가
      setUsers(updatedUsers); // 사용자 상태 업데이트
      await AsyncStorage.setItem('users', JSON.stringify(updatedUsers)); // 로컬 스토리지에 저장
      Alert.alert('회원가입 성공', '회원가입이 완료되었습니다.'); // 성공 메시지 표시
      resetForm(); // 입력 필드 초기화
      setIsSignUpScreen(false); // 회원가입 후 로그인 화면으로 돌아감
    } else {
      // 모든 필드가 채워지지 않았으면 오류 메시지 표시
      Alert.alert('오류', '모든 필드를 입력해주세요.');
    }
  };

  // 입력 필드 초기화 함수
  const resetForm = () => {
    setEmail(''); // 이메일 필드 초기화
    setPassword(''); // 비밀번호 필드 초기화
    setName(''); // 이름 필드 초기화
    setBirthdate(''); // 생년월일 필드 초기화
    setGender(''); // 성별 필드 초기화
  };

  // 로그아웃 처리 함수
  const handleLogout = () => {
    setIsLoggedIn(false); // 로그인 상태를 false로 변경
  };

  return (
    <View style={styles.container}>
      {isLoggedIn ? (
        // 로그인 후 화면
        <View>
          <Text style={styles.title}>로그인 완료</Text>
          <FlatList
            data={users} // 사용자 목록 데이터
            keyExtractor={(item) => item.id} // 고유 ID를 키로 사용
            renderItem={({ item }) => (
              // 각 사용자 정보를 텍스트로 표시
              <Text>{`이름: ${item.name}, 이메일: ${item.email}, 생년월일: ${item.birthdate}, 성별: ${item.gender}`}</Text>
            )}
          />
          <Button title="로그아웃" onPress={handleLogout} /> // 로그아웃 버튼
        </View>
      ) : isSignUpScreen ? (
        // 회원가입 화면
        <View>
          <Text style={styles.title}>회원가입</Text>
          <TextInput
            style={styles.input}
            placeholder="이메일" // 입력 필드 설명
            value={email} // 이메일 입력 필드의 값
            onChangeText={setEmail} // 이메일 입력 변경 시 상태 업데이트
            keyboardType="email-address" // 이메일 키패드 표시
          />
          <TextInput
            style={styles.input}
            placeholder="비밀번호"
            value={password} // 비밀번호 입력 필드의 값
            onChangeText={setPassword} // 비밀번호 입력 변경 시 상태 업데이트
            secureTextEntry // 비밀번호 보안 입력
          />
          <TextInput
            style={styles.input}
            placeholder="이름"
            value={name} // 이름 입력 필드의 값
            onChangeText={setName} // 이름 입력 변경 시 상태 업데이트
          />
          <TextInput
            style={styles.input}
            placeholder="생년월일 (YYYY-MM-DD)"
            value={birthdate} // 생년월일 입력 필드의 값
            onChangeText={setBirthdate} // 생년월일 입력 변경 시 상태 업데이트
          />
          <TextInput
            style={styles.input}
            placeholder="성별"
            value={gender} // 성별

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
