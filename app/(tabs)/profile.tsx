import { View, Text, SafeAreaView, Pressable, Image, ScrollView, RefreshControl, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Link, router } from 'expo-router'
import { useGlobalContext } from '@/context/GlobalContext'
import { logout, getPosts, uploadFile, updateUserAvatar, updatePostsCreatorAvatar } from '@/lib/appwrite'
import { Ionicons } from '@expo/vector-icons';
import { MasonryFlashList } from "@shopify/flash-list";
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { ID } from 'react-native-appwrite';

const Profile = () => {
  const { user, refreshUser, refreshPosts } = useGlobalContext()
  const pageSize = 6;
  const [posts, setPosts] = useState<any[]>([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserPosts = async (isRefresh = false) => {
    if (loading || !user?.userId) return;
    setLoading(true);
    setError(null);

    let page = pageNumber;
    if (isRefresh) {
      page = 0;
      setPageNumber(0);
      setHasMore(true);
    }

    try {
      const newPosts = await getPosts(page, pageSize, [user.userId]);
      if (isRefresh) {
        setPosts(newPosts);
      } else {
        setPosts(prevPosts => [...prevPosts, ...newPosts]);
      }
      setPageNumber(page + 1);
      setHasMore(newPosts.length === pageSize);
    } catch (error) {
      console.log(error);
      setError('获取帖子失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchUserPosts(true);
    setRefreshing(false);
  }, [user?.userId]);

  useEffect(() => {
    if (user?.userId) {
      fetchUserPosts(true);
    }
  }, [user?.userId]);

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/sign_in')
    } catch (error) {
      console.log(error);
      setError('退出登录失败，请重试');
    }
  }

  const handleAvatarChange = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        const compressedImage = await compressImage(result.assets[0].uri)
        if (compressedImage) {
          const { fileUrl } = await uploadFile(ID.unique(), compressedImage)
          await updateUserAvatar(user.userId, fileUrl.toString())
          await updatePostsCreatorAvatar(user.userId, fileUrl.toString())
          refreshUser()
          refreshPosts()
          Alert.alert('成功', '头像更新成功')
        }
      }
    } catch (error) {
      console.log(error)
      Alert.alert('错误', '头像更新失败，请重试')
    }
  }

  const compressImage = async (uri: string, quality = 0.2, maxWidth = 640) => {
    try {
      const mainResult = await manipulateAsync(
        uri,
        [{ resize: { width: maxWidth } }],
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

  // 渲染未登录界面
  if (!user?.userId) {
    return (
      <SafeAreaView className='flex-1 bg-myBackground'>
        <View className='flex-1 items-center justify-center p-4'>
          <Text className='text-xl font-bold mb-4'>请先登录</Text>
          <Text className='text-gray-500 text-center mb-8'>
            登录后即可查看个人资料和发布内容
          </Text>
          <Pressable
            className='bg-myGreen px-8 py-3 rounded-xl'
            onPress={() => router.push('/sign_in')}
          >
            <Text className='text-center font-semibold text-lg text-white'>
              去登录
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    )
  }

  // 渲染已登录界面
  return (
    <SafeAreaView className='flex-1 bg-myBackground'>
      <ScrollView
        className='flex-1'
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#60D174"
          />
        }
      >
        {/* Profile Header Section */}
        <View className='bg-gradient-to-b from-myGreen/20 to-myBackground p-12'>
          <View className='flex-col items-center gap-4'>
            <View className='relative'>
              {user?.avatarUrl ? (
                <Image source={{ uri: user.avatarUrl }} className='w-24 h-24 rounded-full' />
              ) : (
                <View className='w-24 h-24 rounded-full bg-gray-200 items-center justify-center'>
                  <Text className='text-4xl text-gray-400'>{user.name?.[0]}</Text>
                </View>
              )}
              <Pressable
                onPress={handleAvatarChange}
                className='absolute bottom-0 right-0 bg-myGreen rounded-full p-1'
              >
                <Ionicons name="add" size={20} color="white" />
              </Pressable>
            </View>
            <View className='items-center'>
              <Text className='text-2xl font-bold mb-1'>
                {user.name}
              </Text>
              <Text className='text-gray-500'>
                {user.email}
              </Text>
            </View>
          </View>
        </View>

        {/* Content Section */}
        <View className='-mt-2 px-2'>
          <Text className='text-lg font-bold mb-4 px-1'>
            我的推文
          </Text>
          {error ? (
            <Text className='text-red-500 text-center'>{error}</Text>
          ) : (
            <View className='h-96'>
              <MasonryFlashList
                data={posts}
                numColumns={2}
                onEndReached={() => {
                  if (hasMore && pageNumber > 0) {
                    fetchUserPosts();
                  }
                }}
                onEndReachedThreshold={0.7}
                renderItem={({ item }) => (
                  <Pressable
                    className="flex-1 flex-col rounder-sm m-1"
                    onPress={() => {
                      router.push(`/detail/${item?.$id}`);
                    }}
                  >
                    <Image
                      source={{ uri: item?.image_url }}
                      style={{
                        width: '100%',
                        height: 200,
                        maxHeight: 270,
                        borderRadius: 10,
                      }}
                      resizeMode="cover"
                    />
                    <View className="flex-1 flex-col p-2">
                      <Text className="font-bold mt-1 text-md">{item?.title}</Text>
                      <Text className="text-sm text-gray-500 mt-1">{item?.content}</Text>
                    </View>
                  </Pressable>
                )}
                estimatedItemSize={200}
              />
            </View>
          )}
        </View>

        {/* Logout Button */}
        <View className='items-center my-4'>
          <Pressable
            className='bg-myGreen px-8 py-3 rounded-xl flex-row items-center'
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color="white" />
            <Text className='text-center font-semibold text-lg text-white ml-2'>
              退出登录
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile