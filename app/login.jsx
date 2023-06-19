import { View, Text, TextInput, TouchableOpacity } from "react-native"
import { signInWithEmailAndPassword } from "../src/api/api"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useState } from "react"
import { Link, useRouter } from "expo-router"
import { usePublications } from "../src/contexts/PublicationsProvider"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { setLogin } = usePublications()

  const router = useRouter()

  async function handleLogin() {
    try {
      const credentials = await signInWithEmailAndPassword(email, password)

      await AsyncStorage.setItem("@user", JSON.stringify(credentials.user))

      setLogin(true)
      router.push("/")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <Text className="text-2xl font-bold text-center">Login</Text>

      <View className="flex-1 justify-center ">
        <Text className="text-gray-500 text-center mt-2">
          Preencha os dados abaixo para entrar no Catalógo Imobiliário
        </Text>

        <View className="flex flex-col mt-4">
          <Text className="text-gray-500">E-mail</Text>
          <TextInput
            className="border border-gray-300 p-2 rounded-md"
            onChangeText={setEmail}
          />

          <Text className="text-gray-500 mt-4">Senha</Text>
          <TextInput
            className="border border-gray-300 p-2 rounded-md"
            secureTextEntry={true}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            className="bg-blue-500  p-2 rounded-md mt-4"
            onPress={handleLogin}
          >
            <Text className="text-center text-white">Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-gray-200 text-blue-500 p-2 rounded-md mt-4"
            onPress={() => {}}
          >
            <Link href="/signup" className="text-center text-white">
              Criar uma conta
            </Link>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
