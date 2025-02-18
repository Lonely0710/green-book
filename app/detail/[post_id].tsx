import { TextInput, Image, View, Text, SafeAreaView, ScrollView, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { getPostById, getUserbyUserID, getFollowUsers, followUser, unFollowUser, createComment, getCommentsByPostId } from '@/lib/appwrite'
import { useGlobalContext } from '@/context/GlobalContext'
import { router } from 'expo-router'
import { IconSymbol } from '@/components/ui/IconSymbol'


const Detail = () => {
  const { post_id } = useLocalSearchParams()
  const [post, setPost] = useState<any>(null)
  const [creatorId, setCreatorId] = useState<any>(null)
  const [creatorName, setCreatorName] = useState<any>(null)
  const [creatorAvatar, setCreatorAvatar] = useState<any>(null)
  const [isFollowed, setIsFollowed] = useState<any>(false)

  const [comment, setComment] = useState('')
  const [comments, setComments] = useState<any>([])

  const { user } = useGlobalContext()

  const getData = async () => {
    try {
      const post = await getPostById(post_id as string)
      const creator = await getUserbyUserID(post?.creator_id)
      const followingUsers = await getFollowUsers(user?.userId)
      const isFollowed = followingUsers.some((followingUser: any) => followingUser === creator.user_id)
      const comments = await getCommentsByPostId(post_id as string)

      setPost(post)
      setCreatorId(creator.user_id)
      setCreatorName(creator.name)
      setCreatorAvatar(creator.avatar_url)
      setIsFollowed(isFollowed)
      setComments(comments)

    } catch (error) {
      console.log(error)
    }
  }

  const handleFollow = async () => {
    try {
      if (isFollowed) {
        await unFollowUser(user?.userId, creatorId)
      } else {
        await followUser(user?.userId, creatorId)
      }
      setIsFollowed(!isFollowed)
    } catch (error) {
      console.log(error)
    }
  }
  const handleComment = async () => {
    try {
      const res = await createComment(post_id as string, comment, user?.userId, user?.name, user?.avatarUrl)
      setComment('')
      getData()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <SafeAreaView className='flex-1 bg-myWhite flex-col'>
      <ScrollView
        showsVerticalScrollIndicator={true}
        persistentScrollbar={true}
        indicatorStyle="black"
      >
        {/* 第一行 */}
        <View className='flex-row items-center justify-between mx-6 my-4'>
          <View className='flex-row items-center'>
            <Pressable
              onPress={() => router.back()}
              className='mr-4'
            >
              <IconSymbol name="chevron.left" size={28} color="black" />
            </Pressable>
            <View className='flex-row items-center gap-2'>
              <Image
                source={{ uri: creatorAvatar }}
                className='w-10 h-10 rounded-full'
              />
              <Text className='text-lg font-semibold'>{creatorName}</Text>
            </View>
          </View>

          <Pressable
            onPress={handleFollow}
            className={`px-4 p-2 rounded-full ${isFollowed ? 'bg-gray-300' : 'bg-myGreen'}`}
          >
            <Text className='text-myWhite font-semibold'>
              {isFollowed ? '已关注' : '关注'}
            </Text>
          </Pressable>
        </View>

        {/* 第二行 */}
        <View className='flex-1'>
          <Image
            source={{ uri: post?.image_url }}
            className='w-full h-[400px]'
          />

          <View className='px-8 mt-4'>
            <Text className='text-2xl font-semibold'>{post?.title}</Text>
            <Text className='text-lg text-gray-500 mt-3 leading-7'>{post?.content}</Text>
          </View>
        </View>

        {/* 第三行 */}
        <View className='flex-row items-center justify-between mx-6 my-4 gap-2'>
          <Image source={{ uri: user?.avatarUrl }} className='w-10 h-10 rounded-full' />
          <TextInput
            placeholder='添加评论'
            className='flex-1 border border-gray-300 rounded-full px-4 py-2'
            value={comment}
            onChangeText={setComment}
          />
          <Pressable
            onPress={handleComment}
            className='bg-myGreen px-4 p-2 rounded-full'
          >
            <Text className='text-myWhite font-semibold'>发送</Text>
          </Pressable>
        </View>

        {/* 第四行 */}
        <View className='px-4 pb-6'>
          <Text className='text-base text-gray-500 mb-4'>共{comments.length}条评论</Text>
          {
            comments.map((comment: any) => (
              <View
                className='mb-2  pb-2 border-b border-white'
                key={comment.$id}
              >
                <View className='flex-row items-center mb-2'>
                  <Image source={{ uri: comment?.from_user_avatar_url }} className='w-8 h-8 rounded-full mr-2' />
                  <View>
                    <Text className='font-medium'>{comment?.from_user_name}</Text>
                    <View className='flex flex-col'>
                      <Text className='text-xs text-gray-400'>
                        {new Date(comment?.$createdAt).toLocaleDateString('zh-CN')}
                      </Text>
                      <Text className='text-xs text-gray-400'>
                        {new Date(comment?.$createdAt).toLocaleTimeString('zh-CN', {
                          hour12: false,
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Text>
                    </View>
                  </View>
                  <Text className='ml-10 text-gray-500'>{comment.content}</Text>
                </View>
              </View>
            ))
          }
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

export default Detail