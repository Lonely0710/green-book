import { View, Text, SafeAreaView, TextInput, Pressable, Alert } from 'react-native'
import React, { useState, useRef } from 'react'
import { Link, router } from 'expo-router'
import { login } from '@/lib/appwrite'
import { useGlobalContext } from '@/context/GlobalContext'
import LottieView from 'lottie-react-native'
import { IconSymbol } from '@/components/ui/IconSymbol'

const sign_in = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const { refreshUser } = useGlobalContext()

  const handleSignIn = async () => {
    try {
      setLoading(true)
      await login(email, password)
      setLoading(false)
      Alert.alert('登录成功')
      router.push('/')
      refreshUser()
    } catch (error) {
      console.log(error)
      Alert.alert('登录失败', '请检查邮箱和密码是否正确')
      setLoading(false)
    }
  }

  return (
    <SafeAreaView className='flex-1 bg-myBackground'>
      <View className='flex-1 flex-col mx-2'>
        <Pressable
          onPress={() => router.push('/')}
          className='mt-4 ml-4'
        >
          <IconSymbol name="chevron.left" size={28} color="black" />
        </Pressable>

        <LottieView
          source={require('@/assets/animations/cat_login.json')}
          autoPlay
          loop
          style={{
            width: 280,
            height: 200,
            alignSelf: 'center',
            marginTop: 10,
          }}
        />

        <Text className='text-3xl font-bold text-center mt-20'>
          登录
        </Text>

        <TextInput
          placeholder='Email'
          value={email}
          onChangeText={setEmail}
          className='border border-gray-300 rounded-lg p-2 mt-6 h-12 mx-8'
        />

        <TextInput
          placeholder='Password'
          value={password}
          onChangeText={setPassword}
          className='border border-gray-300 rounded-lg p-2 mt-6 h-12 mx-8'
          secureTextEntry={true}
        />

        <Pressable
          className='bg-myGreen rounded-lg p-2 mt-6 h-12 items-center justify-center w-32 self-center'
          onPress={handleSignIn}
        >
          <Text className='text-center text-white font-semibold text-lg'>
            {loading ? '登录中...' : '登录'}
          </Text>
        </Pressable>

        <View className='flex-row justify-center mt-4'>
          <Text className='text-gray-500'>
            没有账号？
          </Text>
          <Link href='/sign_up' className='text-myGreen ml-1'>
            注册
          </Link>
        </View>
      </View>

    </SafeAreaView>
  )
}

export default sign_in