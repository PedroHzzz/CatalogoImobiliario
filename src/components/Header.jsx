import { View, Text, TouchableOpacity } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react"
import { Link, useRouter } from "expo-router"
import { usePublications } from "../contexts/PublicationsProvider"

export default function Header() {
  const [cart, setCart] = useState([])
  const { user, handleLogout } = usePublications()
  //carinho.length

  const router = useRouter()

  async function getCart() {
    try {
      const cart = await AsyncStorage.getItem("@cart")
      const cartArray = cart ? JSON.parse(cart) : []
      setCart(cartArray)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getCart()
  }, [])

  function logout() {
    handleLogout()

    router.push("/login")
  }

  return (
    <View className="flex flex-row items-center justify-between p-4 bg-blue-500">
      <View className="items-start">
        <Link href="/">
          <Text className="text-center text-gray-50 font-bold text-3xl">
            Catalógo Imobiliário
          </Text>
        </Link>
        <Text className="text-center text-gray-50 font-bold text-xl">
          {user && `Bem vindo, ${user.displayName}`}
        </Text>
      </View>
      <View className="items-end">
        <Link
          href="/cart"
          className="bg-blue-600 p-2 rounded-md flex flex-row items-center"
        >
          <Text className="text-center text-gray-50 font-bold text-xl">
            Favoritos 
          </Text>
        </Link>
        <TouchableOpacity onPress={logout}>
          <Text className="text-center text-gray-50 font-bold text-xl">
            {user ? "Sair" : "Entrar"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
