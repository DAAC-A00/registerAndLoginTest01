// src/App.tsx

import React, { useState, useEffect } from 'react'; // React와 상태 관리 훅(useState, useEffect)을 임포트합니다.
import { View, Text, TextInput, Button, StyleSheet, Alert, FlatList, TouchableOpacity } from 'react-native'; // React Native의 UI 컴포넌트를 임포트합니다.
import AsyncStorage from '@react-native-async-storage/async-storage'; // 로컬 스토리지에 데이터를 저장하기 위한 라이브러리를 임포트합니다.

// User 인터페이스를 정의합니다. 사용자 데이터의 구조를 설정합니다.
interface User {
  id: string; // 고유 ID
  email: string; // 사용자 이메일
  password: string; // 사용자 비밀번호
  name: string; // 사용자 이름
  birthdate: string; // 사용자 생년월일
  gender: string; // 사용자 성별
}

// 고유 ID를 생성하는 함수입니다. 임의의 문자열을 반환합니다.
const generateId = () => {
  return Math.random().toString(36).substr(2, 9); // 랜덤한 문자열을 생성하여 반환합니다.
};

// App 컴포넌트를 정의합니다.
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태를 관리하는 상태 변수입니다.
  const [email, setEmail] = useState(''); // 이메일 입력을 관리하는 상태 변수입니다.
  const [password, setPassword] = useState(''); // 비밀번호 입력을 관리하는 상태 변수입니다.
  const [name, setName] = useState(''); // 이름 입력을 관리하는 상태 변수입니다.
  const [birthdate, setBirthdate] = useState(''); // 생년월일 입력을 관리하는 상태 변수입니다.
  const [gender, setGender] = useState(''); // 성별 입력을 관리하는 상태 변수입니다.
  const [users, setUsers] = useState<User[]>([]); // 사용자 목록을 관리하는 상태 변수입니다.
  const [isSignUpScreen, setIsSignUpScreen] = useState(false); // 회원가입 화면 여부를 관리하는 상태 변수입니다.

  // 컴포넌트가 처음 렌더링될 때 사용자 데이터를 로드합니다.
  useEffect(() => {
    const loadUsers = async () => { // 비동기 함수로 사용자 데이터를 로드하는 함수를 정의합니다.
      const storedUsers = await AsyncStorage.getItem('users'); // 로컬 스토리지에서 'users' 키로 저장된 데이터 가져오기
      if (storedUsers) { // 데이터가 존재하면
        setUsers(JSON.parse(storedUsers)); // 가져온 데이터를 JSON 형식으로 파싱하여 상태에 설정합니다.
      }
    };

    loadUsers(); // 사용자 데이터 로드 함수 호출
  }, []); // 빈 배열을 전달하여 컴포넌트가 처음 렌더링될 때만 실행합니다.

  // 로그인 처리 함수입니다.
  const handleLogin = () => {
    // 입력한 이메일과 비밀번호로 사용자 찾기
    const user = users.find(u => u.email === email && u.password === password); // 사용자 목록에서 입력한 이메일과 비밀번호가 일치하는 사용자 찾기
    if (user) { // 사용자가 존재하면
      setIsLoggedIn(true); // 로그인 상태를 true로 변경합니다.
      resetForm(); // 입력 필드 초기화
    } else { // 사용자가 존재하지 않으면
      Alert.alert('로그인 실패', '잘못된 이메일 또는 비밀번호입니다.'); // 오류 메시지 표시
    }
  };

  // 회원가입 처리 함수입니다.
  const handleSignUp = async () => {
    // 모든 입력 필드가 채워졌는지 확인
    if (email && password && name && birthdate && gender) { // 모든 필드가 입력되었는지 확인합니다.
      const newUser: User = { id: generateId(), email, password, name, birthdate, gender }; // 새로운 사용자 객체 생성
      const updatedUsers = [...users, newUser]; // 기존 사용자 목록에 새 사용자 추가
      setUsers(updatedUsers); // 사용자 상태 업데이트
      await AsyncStorage.setItem('users', JSON.stringify(updatedUsers)); // 로컬 스토리지에 저장
      Alert.alert('회원가입 성공', '회원가입이 완료되었습니다.'); // 성공 메시지 표시
      resetForm(); // 입력 필드 초기화
      setIsSignUpScreen(false); // 회원가입 후 로그인 화면으로 돌아감
    } else { // 모든 필드가 채워지지 않았으면
      Alert.alert('회원가입 실패', '모든 필드를 입력해주세요.'); // 오류 메시지 표시
    }
  };

  // 입력 필드 초기화 함수입니다.
  const resetForm = () => {
    setEmail(''); // 이메일 필드 초기화
    setPassword(''); // 비밀번호 필드 초기화
    setName(''); // 이름 필드 초기화
    setBirthdate(''); // 생년월일 필드 초기화
    setGender(''); // 성별 필드 초기화
  };

  // 로그아웃 처리 함수입니다.
  const handleLogout = () => {
    setIsLoggedIn(false); // 로그인 상태를 false로 변경
  };

  // FlatList의 각 항목을 렌더링하는 함수입니다.
  const renderItem = ({ item }: { item: User }) => (
    <TouchableOpacity style={styles.listTile} key={item.id}>
      <View style={styles.leftColumn}>
        <Text style={styles.listTileText}>{item.email}</Text>
        <Text style={styles.listTileText}>{item.password}</Text>
      </View>
      <View style={styles.rightColumn}>
        <Text style={styles.listTileText}>{item.name} ({item.gender})</Text>
        <Text style={styles.listTileText}>{item.birthdate}</Text>
      </View>
    </TouchableOpacity>
  );

    // App 컴포넌트의 반환 부분입니다.
    return (
      <View style={styles.container}>
        {isLoggedIn ? ( // 로그인 상태에 따라 화면을 다르게 표시합니다.
          <View>
            <Text style={styles.title}>로그인 완료</Text>
            <FlatList
              data={users} // 사용자 목록 데이터
              keyExtractor={(item) => item.id} // 고유 ID를 키로 사용하여 각 항목을 식별합니다.
              renderItem={renderItem} // 각 항목을 렌더링하는 함수
            />
            <Button title="로그아웃" onPress={handleLogout} />
          </View>
        ) : isSignUpScreen ? ( // 회원가입 화면 여부에 따라 다르게 표시합니다.
          <View>
            <Text style={styles.title}>회원가입</Text>
            <TextInput
              style={styles.input} // 입력 필드 스타일
              placeholder="이메일" // 이메일 입력 필드에 대한 설명
              value={email} // 이메일 상태 변수의 값
              onChangeText={setEmail} // 이메일 입력 변경 시 상태 업데이트
              keyboardType="email-address" // 이메일 입력 시 이메일 키패드 표시
            />
            <TextInput
              style={styles.input} // 입력 필드 스타일
              placeholder="비밀번호" // 비밀번호 입력 필드에 대한 설명
              value={password} // 비밀번호 상태 변수의 값
              onChangeText={setPassword} // 비밀번호 입력 변경 시 상태 업데이트
              secureTextEntry // 비밀번호 보안 입력
            />
            <TextInput
              style={styles.input} // 입력 필드 스타일
              placeholder="이름" // 이름 입력 필드에 대한 설명
              value={name} // 이름 상태 변수의 값
              onChangeText={setName} // 이름 입력 변경 시 상태 업데이트
            />
            <TextInput
              style={styles.input} // 입력 필드 스타일
              placeholder="생년월일 (YYYY-MM-DD)" // 생년월일 입력 필드에 대한 설명
              value={birthdate} // 생년월일 상태 변수의 값
              onChangeText={setBirthdate} // 생년월일 입력 변경 시 상태 업데이트
            />
            <TextInput
              style={styles.input} // 입력 필드 스타일
              placeholder="성별" // 성별 입력 필드에 대한 설명
              value={gender} // 성별 상태 변수의 값
              onChangeText={setGender} // 성별 입력 변경 시 상태 업데이트
            />
            <Button title="회원가입" onPress={handleSignUp} />
            <Button title="로그인 화면으로 돌아가기" onPress={() => setIsSignUpScreen(false)} />
          </View>
        ) : ( // 로그인 화면인 경우
          <View>
            <Text style={styles.title}>로그인</Text>
            <TextInput
              style={styles.input} // 입력 필드 스타일
              placeholder="이메일" // 이메일 입력 필드에 대한 설명
              value={email} // 이메일 상태 변수의 값
              onChangeText={setEmail} // 이메일 입력 변경 시 상태 업데이트
              keyboardType="email-address" // 이메일 입력 시 이메일 키패드 표시
            />
            <TextInput
              style={styles.input} // 입력 필드 스타일
              placeholder="비밀번호" // 비밀번호 입력 필드에 대한 설명
              value={password} // 비밀번호 상태 변수의 값
              onChangeText={setPassword} // 비밀번호 입력 변경 시 상태 업데이트
              secureTextEntry // 비밀번호 보안 입력
            />
            <Button title="로그인" onPress={handleLogin} />
            <Button title="회원가입하러 가기" onPress={() => setIsSignUpScreen(true)} />
          </View>
        )}
      </View>
    );
  };
  
  // 스타일을 정의하는 부분입니다.
  const styles = StyleSheet.create({
    container: {
      flex: 1, // 화면 전체를 차지하도록 설정
      justifyContent: 'center', // 세로 방향 가운데 정렬
      padding: 16, // 주위 여백 설정
    },
    title: {
      fontSize: 24, // 제목 글자 크기
      marginBottom: 24, // 제목 아래 여백
      textAlign: 'center', // 제목 가운데 정렬
    },
    input: {
      height: 40, // 입력 필드 높이
      borderColor: 'gray', // 입력 필드 테두리 색상
      borderWidth: 1, // 입력 필드 테두리 두께
      marginBottom: 16, // 입력 필드 아래 여백
      paddingHorizontal: 8, // 입력 필드 안쪽 좌우 여백
    },
    listTile: {
      flexDirection: 'row', // 항목을 가로 방향으로 나열
      padding: 16, // 항목 안쪽 여백
      borderBottomWidth: 1, // 항목 아래쪽 경계선 두께
      borderBottomColor: '#ccc', // 항목 아래쪽 경계선 색상
    },
    leftColumn: {
      flex: 1, // 왼쪽 열이 차지하는 비율
      justifyContent: 'space-between', // 세로 방향으로 아이템 간격을 동일하게
    },
    rightColumn: {
      flex: 1, // 오른쪽 열이 차지하는 비율
      justifyContent: 'space-between', // 세로 방향으로 아이템 간격을 동일하게
      alignItems: 'flex-end', // 오른쪽 열의 아이템을 오른쪽 끝에 정렬
    },
    listTileText: {
      fontSize: 16, // 항목 텍스트 크기
    },
  });
  
  export default App; // App 컴포넌트를 내보냅니다.
  