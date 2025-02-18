import { Account, Avatars, Client, Databases, ID, ImageGravity, Query, Storage } from 'react-native-appwrite'
import { User } from './model'
import { ImageResult } from 'expo-image-manipulator'

const client = new Client().setEndpoint('https://cloud.appwrite.io/v1').setProject('67b4052c0014071b7255')

const databaseID = '67b4055300271918c427'
const collectionIdUser = '67b4063900372acac570'
const collectionIdPost = '67b4192000362217a172'
const collectionIdComment = '67b4198c00178554af81'
const collectionIdFollow = '67b41994002c566db56c'
const bucketID = '67b430d8003dc99ffcde'

const account = new Account(client)
const database = new Databases(client)
const avatars = new Avatars(client)
const storage = new Storage(client)

export const uploadFile = async (image_key: string, file: ImageResult) => {
    try {
        const res = await storage.createFile(bucketID, image_key, {
            name: image_key,
            type: 'image/jpeg',
            size: file.height * file.width,
            uri: file.uri
        })
        const fileId = res.$id
        const fileUrl = storage.getFilePreview(bucketID, fileId, 640, 640, ImageGravity.Top, 100)

        return {
            fileId,
            fileUrl
        }

    } catch (error) {
        console.error(error)
        throw error
    }
}

// 登录部分API
const createUser = async (email: string, name: string, user_id: string, avatar_url: string) => {
    try {
        const user = await database.createDocument(databaseID, collectionIdUser, ID.unique(), {
            email,
            name,
            user_id,
            avatar_url
        })
        return user.$id
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const getUserbyUserID = async (user_id: string) => {
    const user = await database.listDocuments(databaseID, collectionIdUser, [Query.equal('user_id', user_id)])
    return user.documents[0]
}

export const login = async (email: string, password: string) => {
    try {
        const res = await account.createEmailPasswordSession(email, password)
        return res
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const logout = async () => {
    try {
        await account.deleteSession('current')
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const register = async (email: string, password: string, name: string) => {
    try {
        // 1. 注册
        const user = await account.create(ID.unique(), email, password, name)
        const avatarUrl = avatars.getInitials(name)
        const res = await createUser(email, name, user.$id, avatarUrl.toString())
        // 2. 登录
        await login(email, password)
        return user.$id
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const getCurrentUser = async () => {
    const res = await account.get()
    if (res.$id) {
        const user = await getUserbyUserID(res.$id)
        return {
            userId: res.$id,
            name: user.name,
            email: user.email,
            avatarUrl: user.avatar_url
        } as User
    }
    return null
}

// 帖子部分API
export const createPost = async (title: string, content: string, image_url: string, creator_id: string, creator_name: string, creator_avatar_url: string) => {
    try {
        const post = await database.createDocument(databaseID, collectionIdPost, ID.unique(), {
            title,
            content,
            image_url,
            creator_id,
            creator_name,
            creator_avatar_url
        })
        return post.$id
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const getPostById = async (post_id: string) => {
    try {
        const post = await database.getDocument(databaseID, collectionIdPost, post_id)
        return post
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const getPosts = async (pageNumber: number, pageSize: number, userIds?: string[]) => {
    try {
        let quries = [Query.limit(pageSize), Query.offset(pageNumber * pageSize), Query.orderAsc('$createdAt')]
        if (userIds) {
            quries.push(Query.equal('creator_id', userIds))
        }
        const posts = await database.listDocuments(databaseID, collectionIdPost, quries)
        return posts.documents
    } catch (error) {
        console.error(error)
        throw error
    }
}

// 评论部分API
export const createComment = async (post_id: string, content: string, from_user_id: string, from_user_name: string, from_user_avatar_url: string) => {
    const comment = await database.createDocument(databaseID, collectionIdComment, ID.unique(), {
        post_id,
        content,
        from_user_id,
        from_user_name,
        from_user_avatar_url
    })

    return comment
}

export const getCommentsByPostId = async (post_id: string) => {
    try {
        const comments = await database.listDocuments(databaseID, collectionIdComment, [Query.equal('post_id', post_id)])
        return comments.documents
    } catch (error) {
        console.error(error)
        throw error
    }
}

// 关注部分API
export const followUser = async (from_user_id: string, to_user_id: string) => {
    try {
        const follow = await database.createDocument(databaseID, collectionIdFollow, ID.unique(), {
            from_user_id,
            to_user_id
        })
        return follow
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const unFollowUser = async (from_user_id: string, to_user_id: string) => {
    try {
        const res = await database.listDocuments(databaseID, collectionIdFollow,
            [Query.equal('from_user_id', from_user_id), Query.equal('to_user_id', to_user_id)])
        if (res && res.documents) {
            const deleteRes = await database.deleteDocument(databaseID, collectionIdFollow,
                res.documents[0].$id)
            return deleteRes
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const getFollowUsers = async (user_id: string) => {
    try {
        const res = await database.listDocuments(databaseID, collectionIdFollow, [Query.equal('from_user_id', user_id)])
        return res.documents.map((item) => item.to_user_id)
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const updateUserAvatar = async (userId: string, avatarUrl: string) => {
    try {
        const user = await database.listDocuments(databaseID, collectionIdUser, [Query.equal('user_id', userId)])
        if (user.documents.length > 0) {
            await database.updateDocument(databaseID, collectionIdUser, user.documents[0].$id, {
                avatar_url: avatarUrl
            })
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const updatePostsCreatorAvatar = async (userId: string, newAvatarUrl: string) => {
    try {
        const posts = await database.listDocuments(databaseID, collectionIdPost, [
            Query.equal('creator_id', userId)
        ])

        const updatePromises = posts.documents.map(post =>
            database.updateDocument(databaseID, collectionIdPost, post.$id, {
                creator_avatar_url: newAvatarUrl
            })
        )

        await Promise.all(updatePromises)
    } catch (error) {
        console.error(error)
        throw error
    }
}

