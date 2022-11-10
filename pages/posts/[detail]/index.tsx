//各投稿の詳細ページ

import { useState, useEffect } from "react";
import { db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import type { NextPage } from "next";
import Layout from "@/components/Layout";
import {
  FormControl,
  Divider,
  Input,
  Flex,
  Box,
  Text,
  Heading,
  Button,
  List,
  ListItem,
  ListIcon,
  Link,
  Stack,
  Image,
} from "@chakra-ui/react";
import { LanguageTags } from "@/components/LanguageTags";
import { PostType } from "@/types/post";
import { useSetRecoilState } from "recoil";
import { postState, usePostIdValue, useAuhotrIdValue } from "@/lib/atoms";
import { useUser } from "@/lib/auth";
import { AuthorType } from "@/types/author";

const Detail: NextPage = () => {
  const [post, setPost] = useState<PostType>({
    id: "",
    appName: "",
    title: "",
    description: "",
    image: "",
    level: "",
    language: [""],
    appUrl: "",
    github: "",
    postedDate: null,
    authorId: "",
  });
  const [author, setAuthor] = useState<AuthorType>({
    uid: "",
    username: "",
    photoUrl: "",
  });
  const router = useRouter();
  const { detail } = router.query;
  const postIdValue = usePostIdValue();
  const authorIdValue = useAuhotrIdValue();
  const setPostDetail = useSetRecoilState<PostType>(postState);
  const user = useUser();

  // postsコレクションから、投稿データを参照
  useEffect(() => {
    const readPost = async () => {
      const docRef = doc(db, "posts", postIdValue);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setPost({
          ...docSnap.data(),
          id: postIdValue,
          title: docSnap.data().title,
          appName: docSnap.data().appName,
          description: docSnap.data().description,
          image: docSnap.data().image,
          appUrl: docSnap.data().appUrl,
          language: docSnap.data().language,
          level: docSnap.data().level,
          github: docSnap.data().github,
          postedDate: docSnap.data().postedDate,
          authorId: docSnap.data().authorId,
        });
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    };

    // usersコレクションから、投稿者情報を参照
    const readAuthor = async () => {
      const userRef = doc(db, "users", authorIdValue);
      const userDocSnap = await getDoc(userRef);

      if (userDocSnap.exists()) {
        setAuthor({
          ...userDocSnap.data(),
          uid: userDocSnap.data().uid,
          username: userDocSnap.data().username,
          photoUrl: userDocSnap.data().photoUrl,
        });
      } else {
        // doc.data() will be undefined in this case
        console.log("No such user!");
      }
    };

    readPost();
    readAuthor();
  }, []);

  // 各投稿をクリック、Recoilへ状態保持
  const handleEditButtonClick = (postId: string) => {
    setPostDetail({
      id: postId,
      title: post.title,
      appName: post.appName,
      description: post.description,
      image: post.image,
      appUrl: post.appUrl,
      language: post.language,
      level: post.level,
      github: post.github,
      postedDate: post.postedDate,
      authorId: post.authorId,
    });
  };

  const levels = (level: string) => {
    switch (level) {
      case "beginner":
        return "初級";
        break;
      case "intermediate":
        return "中級";
        break;
      case "advanced":
        return "上級";
        break;
    }
  };

  return (
    <Layout title={post.title}>
      <Flex flexDirection={"column"} align={"center"} w={"full"}>
        {/* 投稿タイトル */}
        <Heading
          maxW={"2xl"}
          textAlign={"center"}
          fontSize={{ base: "lg", sm: "2xl" }}
          px={{ base: 4, sm: 8 }}
          mt={20}
        >
          {post.title}
        </Heading>
        <Stack
          textAlign={"center"}
          w={{ base: "100%", md: "80%" }}
          p={4}
          spacing="4"
        >
          {/* アプリ名 */}
          <Text
            my={4}
            fontSize={{ base: "2xl", sm: "4xl" }}
            fontWeight={"bold"}
            color={"blue.400"}
          >
            {post.appName}
          </Text>

          {/* アプリの説明欄 */}
          <Box
            rounded={"lg"}
            bg={"white"}
            boxShadow={"lg"}
            py={10}
            px={{ base: 4, md: 10 }}
          >
            <Text fontSize={{ base: "sm", sm: "md" }}>{post.description}</Text>
          </Box>

          {/* アプリ画像 */}
          {post.image && (
            <Image
              borderRadius="lg"
              src={post.image}
              alt={`image of ${post.appName}`}
              objectFit="contain"
              maxH={"lg"}
            />
          )}

          {/* アプリの詳細情報 */}
          <Box
            rounded={"lg"}
            bg={"white"}
            boxShadow={"lg"}
            py={10}
            px={{ base: 4, md: 10 }}
            textAlign={"left"}
          >
            <List spacing={4} fontSize={{ base: "sm", sm: "md" }}>
              {/* アプリURL */}
              <ListItem>
                <ListIcon color="green.500" />
                アプリURL：
                <Link href={post.appUrl} color={"blue.400"} isExternal>
                  {post.appUrl}
                </Link>
              </ListItem>

              {/* GitHub */}
              <ListItem>
                <ListIcon color="green.500" />
                GitHub：
                <Link href={post.github} color={"blue.400"} isExternal>
                  {post.github}
                </Link>
              </ListItem>

              {/* 使用言語 */}
              <ListItem>
                <ListIcon color="green.500" />
                使用言語：
                <LanguageTags tags={post.language} />
              </ListItem>

              {/* レベル */}
              <ListItem>
                <ListIcon color="green.500" />
                レベル：{levels(post.level)}
              </ListItem>

              {/* 投稿日時 */}
              {/* <ListItem>
                <ListIcon color="green.500" />
                <Text>投稿日時：{getDisplayTime(post.postedDate)}</Text>
              </ListItem> */}
            </List>
          </Box>

          {/* 投稿者情報 */}
          <Flex alignItems={"center"}>
            <Text>投稿者：</Text>
            <Image
              src={author.photoUrl}
              boxSize={"40px"}
              borderRadius={"full"}
              alt={`icon of ${author.username}`}
              mr={2}
            />
            <Text fontWeight={"bold"}>{author.username}</Text>
          </Flex>
          <Divider h={4} />

          {/* ハートアイコン */}
          {/* <Flex align={"center"} justify={"space-between"}>
            <HStack>
              <Icon as={AiOutlineHeart} w={6} h={6} />
              <Text fontSize={"sm"}>100 Likes</Text>
            </HStack> */}
          {/* 投稿者 */}
          {/* <HStack>
              <Text fontSize={"sm"}>投稿者:</Text>
              <Author name="example" />
            </HStack>
          </Flex> */}

          {/* コメント欄 */}
          <Flex alignItems={"center"}>
            {/* 入力欄フォーム */}
            <FormControl id="comment" my={4}>
              <Input
                id="comment"
                type="text"
                placeholder="コメントを入力"
                autoComplete="off"
                bg={"white"}
              />
            </FormControl>
            {/* コメント送信ボタン */}
            <Button
              bg={"blue.400"}
              color={"white"}
              _hover={{
                bg: "blue.500",
              }}
              ml={2}
            >
              送信
            </Button>
          </Flex>

          {/* 各コメント */}
          <Stack
            rounded={"lg"}
            bg={"white"}
            boxShadow={"lg"}
            py={4}
            px={{ base: 4, sm: 8 }}
            textAlign={"left"}
          >
            <Flex alignItems={"center"} justifyContent={"start"}>
              <Image
                src={author.photoUrl}
                boxSize={"28px"}
                borderRadius={"full"}
                alt={`icon of ${author.username}`}
                mr={2}
              />
              <Text fontSize={"sm"}>{author.username}さん</Text>
              <Text ml={2} fontSize={"sm"} color={"gray.500"}>
                2022年11月10日
              </Text>
            </Flex>
            <Text fontSize={"sm"} py={4}>
              ここにコメント。ここにコメント。（１２０文字まで）
            </Text>
          </Stack>

          {/* 戻る/編集ボタン部分 */}
          <Stack>
            {/* 編集ボタン：ログインしているユーザーと、投稿者idが一致した場合のみ表示*/}
            {user.uid === post.authorId && (
              <NextLink href={`/posts/${detail}/edit`} passHref>
                <Button
                  as="a"
                  loadingText="Submitting"
                  size="lg"
                  bg={"pink.400"}
                  color={"white"}
                  _hover={{
                    bg: "pink.500",
                  }}
                  onClick={() => handleEditButtonClick(post.id)}
                >
                  編集
                </Button>
              </NextLink>
            )}

            {/* 戻るボタン */}
            <NextLink href="/" passHref>
              <Button
                as="a"
                loadingText="Submitting"
                size="lg"
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
              >
                戻る
              </Button>
            </NextLink>
          </Stack>
        </Stack>
      </Flex>
    </Layout>
  );
};

export default Detail;
