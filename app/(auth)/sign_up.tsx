import { View, Text, SafeAreaView, TextInput, Pressable, Alert } from 'react-native'
import React, { useState } from 'react'
import { Link, router } from 'expo-router'
import { register } from '@/lib/appwrite'
import { useGlobalContext } from '@/context/GlobalContext'
import LottieView from 'lottie-react-native'

const sign_up = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(false)

    const { refreshUser } = useGlobalContext()

    const handleSignUp = async () => {
        try {
            setLoading(true)
            await register(email, password, username)
            setLoading(false)
            router.push('/')
            refreshUser()
        } catch (error) {
            console.log(error)
            Alert.alert('注册失败', '请检查邮箱和密码是否正确')
            setLoading(false)
        }
    }

    return (
        <SafeAreaView className='flex-1 bg-myBackground'>
            <View className='flex-1 flex-col mx-2'>

                <LottieView
                    source={require('@/assets/animations/dog_register.json')}
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
                    注册
                </Text>

                <TextInput
                    placeholder='Email'
                    value={email}
                    onChangeText={setEmail}
                    className='border border-gray-300 rounded-lg p-2 mt-6 h-12 mx-8'
                />

                <TextInput
                    placeholder='Username'
                    value={username}
                    onChangeText={setUsername}
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
                    onPress={handleSignUp}
                >
                    <Text className='text-center text-white font-semibold text-lg'>
                        {loading ? '注册中...' : '注册'}
                    </Text>
                </Pressable>

                <View className='flex-row justify-center mt-4'>
                    <Text className='text-gray-500'>
                        已有账号？
                    </Text>
                    <Link href='/sign_in' className='text-myGreen ml-1'>
                        登录
                    </Link>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default sign_up