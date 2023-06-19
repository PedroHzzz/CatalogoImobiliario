import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native"
import { formatPrice } from "../src/helpers/formatPrice"
import { Link } from "expo-router"

export default function Cart() {
  const [cart, setCart] = useState([])

  async function getCart() {
    try {
      const cart = await AsyncStorage.getItem("@cart")
      const cartArray = cart ? JSON.parse(cart) : []
      setCart(cartArray)
    } catch (error) {
      console.log(error)
    }
  }

  console.log(cart)

  async function removeFromCart(id) {
    try {
      const cart = await AsyncStorage.getItem("@cart")
      const cartArray = cart ? JSON.parse(cart) : []
      const newCart = cartArray.filter((publication) => publication.id !== id)
      await AsyncStorage.setItem("@cart", JSON.stringify(newCart))
      setCart(newCart)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getCart()
  }, [])

  return (
    <ScrollView>
      <View className="flex-1 bg-gray-50 min-h-screen">
        <View className="flex-1 bg-gray-50 mt-4 justify-start items-center gap-3 p-4">
          <Text className="text-center font-bold text-2xl">
            Seus imóveis favoritos
          </Text>
          {cart?.map((publication) => (
            <View
              key={publication.id}
              className="w-full  bg-blue-500 rounded-xl overflow-hidden shadow-md"
            >
              <Image
                className="w-full h-40 rounded-md"
                source={{ uri: publication.photoUrl }}
              />
              <View className="p-4">
                <View className="flex-row flex-1 items-center justify-between">
                  <View>
                    <Text className="text-lg font-bold text-gray-50">
                      {publication.title}
                    </Text>
                    <Text className="text-lg font-bold text-gray-50">
                      {formatPrice(publication.price)}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => removeFromCart(publication.id)}
                    className="bg-red-500 p-2 rounded-md"
                  >
                    <Text className="text-gray-50">Remover</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}

          {cart.length === 0 && (
            <Text className="text-center font-bold text-2xl">
              Você ainda não adicionou nenhum anúncio ao favoritos!
            </Text>
          )}

          <View className="self-end gap-2">
            <Link href="/" asChild>
              <TouchableOpacity className="bg-blue-500 p-2 rounded-md">
                <Text className="text-gray-50">
                  Voltar para a página inicial
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
