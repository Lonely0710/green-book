import { useState } from 'react';
import { Text, Button, Image, View, StyleSheet, Pressable, SafeAreaView, TextInput, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { createPost, uploadFile } from '@/lib/appwrite';
import { useGlobalContext } from '@/context/GlobalContext';
import { router } from 'expo-router';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { ID } from 'react-native-appwrite';


export default function Add() {
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { user, refreshPosts } = useGlobalContext()

  const handleAdd = async () => {
    if (!image || !title || !content) {
      Alert.alert('请输入完整信息')
      return
    }

    setLoading(true)
    try {
      const res = await createPost(title, content, image, user.userId, user.name, user.avatarUrl)
      console.log(res)
      setLoading(false)
      setTitle('')
      setContent('')
      setImage(null)
      Alert.alert('发布成功')
      refreshPosts()
      router.push('/')
    } catch (error) {
      console.log(error)
      setLoading(false)
      Alert.alert('发布失败')
    }
  }

  const compressImage = async (uri: string, quality = 0.2, maxWidth = 640) => {
    try {
      const mainResult = await manipulateAsync(
        uri,
        [
          { resize: { width: maxWidth } }
        ],
        {
          compress: quality,
          format: SaveFormat.JPEG
        }
      )
      return mainResult
    } catch (error) {
      console.log(error)
      return null
    }
  }

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const compressedImage = await compressImage(result.assets[0].uri)
        if (compressedImage) {
          const { fileId, fileUrl } = await uploadFile(ID.unique(), compressedImage)
          setImage(fileUrl.toString())
        }
      }
    } catch (error) {
      console.log(error)
      Alert.alert('图片选择失败')
    }
  };

  return (
    <SafeAreaView className='flex-1 bg-myBackGround flex-col items-center'>
      <Pressable
        onPress={pickImage}
        className='border-2 mt-10 h-[260px] w-[300px] rounded-2xl border-myGreen/60 overflow-hidden'
      >
        <View className='flex-1 items-center justify-center'>
          {
            image ? <Image source={{ uri: image }} className='w-full h-full rounded-xl' /> :
              <View className="items-center space-y-2">
                <IconSymbol name='camera' size={32} color='myGreen' />
                <Text className="text-gray-500 text-sm">点击选择图片</Text>
              </View>
          }
        </View>
      </Pressable>

      <TextInput
        placeholder='为你的推文起一个标题吧！'
        className='w-[300px] h-[40px] border-2 border-myGreen/60 overflow-hidden rounded-lg mt-10 p-2'
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        placeholder='请输入你的想法...'
        className='w-[300px] h-[200px] bg-gray-200 rounded-lg mt-10 p-2'
        value={content}
        onChangeText={setContent}
        multiline
        scrollEnabled
        textAlignVertical="top"
        numberOfLines={1}
      />

      <Pressable
        className='flex-row items-center justify-center space-x-1 h-[42px] px-6 bg-myGreen rounded-xl mt-8'
        onPress={handleAdd}
      >
        <Text className='text-myWhite text-bold text-lg'>{(loading ? '发布中...' : '发布')}</Text>
      </Pressable>

    </SafeAreaView>
  );
}


