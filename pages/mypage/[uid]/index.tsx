import React, { useState, useEffect } from "react";
import { db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import type { NextPage } from "next";
import Layout from "../../../components/Layout";
import {
  Flex,
  Heading,
  Box,
  FormControl,
  Input,
  FormLabel,
  Button,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useUser } from "../../../lib/auth";

const Mypage: NextPage = () => {
  const user = useUser();
  const [username, setUsername] = useState("");

  // firebaseから、ユーザーのドキュメントをidで参照
  useEffect((): any => {
    const readDoc = async () => {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUsername(docSnap.data().username);
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      } catch (error) {
        console.log(error);
      }
    };
    return readDoc;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout title={"Mypage - ShareFolio"}>
      <Flex
        flexDirection={"column"}
        align={"center"}
        w={"full"}
        p={{ base: 2, sm: 4, md: 8 }}
      >
        {/* ヘディング部分 */}
        <Heading fontSize={"4xl"} mb={8}>
          マイページ
        </Heading>

        <Box
          rounded={"lg"}
          bg={"white"}
          boxShadow={"lg"}
          py={10}
          px={{ base: 4, sm: 4, md: 14 }}
          w={{ base: "100%", sm: "80%", md: "55%" }}
          maxW={"lg"}
        >
          {/* 選択されているプロフィール画像 */}
          <VStack mb={8}>
            <Image
              src={user.photoUrl ? user.photoUrl : "/no-image-icon.png"}
              alt={`profile icon of ${username}`}
              borderRadius={"100%"}
            />
            <Text fontSize={"sm"}>
              {!user.photoUrl && "プロフィールアイコンが設定されていません"}
            </Text>
          </VStack>
          <FormControl id="username" isRequired mb={8}>
            <FormLabel fontWeight={"bold"} color={"blue.400"}>
              ユーザーネーム
            </FormLabel>
            <Input
              id="username"
              type="username"
              placeholder="Usernameを入力"
              value={username ? username : ""}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormControl>

          <FormControl mb={8}>
            <FormLabel fontWeight={"bold"} color={"blue.400"}>
              プロフィールアイコンを変更する
            </FormLabel>
            {/* 画像アップロード部分 */}
            <input type="file" />
          </FormControl>

          {/* 更新ボタン */}
          <Button
            type="submit"
            loadingText="Submitting"
            bg={"blue.400"}
            color={"white"}
            _hover={{
              bg: "blue.500",
            }}
            mr={4}
          >
            更新
          </Button>

          {/* 戻るボタン */}
          <NextLink href="/posts" passHref>
            <Button
              as="a"
              loadingText="Submitting"
              bg={"gray.400"}
              color={"white"}
              _hover={{
                bg: "gray.500",
              }}
            >
              TOPへ
            </Button>
          </NextLink>
        </Box>
      </Flex>
    </Layout>
  );
};

export default Mypage;
