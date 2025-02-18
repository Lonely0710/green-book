import { View, Text, StatusBar, Pressable, Image } from "react-native";
import { MasonryFlashList } from "@shopify/flash-list";
import React, { useState, useEffect } from 'react'
import { getPosts } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalContext";
import { router } from "expo-router";

const Index_all = () => {

  const { freshPostCnt } = useGlobalContext()

  const pageSize = 6
  const [posts, setPosts] = useState<any[]>([])
  const [pageNumber, setPageNumber] = useState(0)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchPosts = async (isRefresh = false) => {
    if (loading) return
    setLoading(true)

    let page = pageNumber

    if (isRefresh) {
      page = 0
      setRefreshing(true)
      setPageNumber(0)
      setHasMore(true)
    }

    try {
      const newposts = await getPosts(page, pageSize)
      if (isRefresh) {
        setPosts(newposts)
      } else {
        setPosts(prevPosts => [...prevPosts, ...newposts])
      }
      setPageNumber(page + 1)
      setHasMore(newposts.length === pageSize)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchPosts(true)
  }, [freshPostCnt])

  return (
    <MasonryFlashList
      data={posts}
      numColumns={2}
      onEndReached={() => {
        if (hasMore && pageNumber > 0) {
          fetchPosts()
        }
      }}
      refreshing={refreshing}
      onRefresh={() => {
        fetchPosts(true)
      }}
      onEndReachedThreshold={0.7}
      renderItem={({ item }) =>
        <Pressable
          className="flex-1 flex-col  rounder-sm m-1"
          onPress={() => {
            router.push(`/detail/${item?.$id}`)
          }}
        >
          <Image source={{ uri: item?.image_url }}
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
            <View className="flex-row items-center mt-2">
              <Image
                source={{ uri: item?.creator_avatar_url }}
                className="w-6 h-6 rounded-full"
                resizeMode="cover"
              />
              <Text className="text-sm text-gray-500 ml-2">{item?.creator_name}</Text>
            </View>
          </View>
        </Pressable>
      }
      estimatedItemSize={200}
    />
  );
}

export default Index_all