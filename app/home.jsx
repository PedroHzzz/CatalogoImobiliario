import { View, Text, Image } from "react-native"
import { useEffect, useState } from "react"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import { formatPrice } from "../src/helpers/formatPrice"
//react navigation
import { usePublications } from "../src/contexts/PublicationsProvider"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Link, useRouter } from "expo-router"
import { Picker } from "@react-native-picker/picker"

export default function Home() {
  const {
    getData,
    publications,
    setPublications,
    selectedPriceRange,
    setSelectedPriceRange,
  } = usePublications()
  //react navigation

  const router = useRouter()

  async function addToFavorites(id) {
    try {
      const cart = await AsyncStorage.getItem("@cart")
      const cartArray = cart ? JSON.parse(cart) : []
      const publication = publications.find(
        (publication) => publication.id === id
      )
      const newCart = [...cartArray, publication]

      await AsyncStorage.setItem("@cart", JSON.stringify(newCart))

      getData()
      router.push("/cart")
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <ScrollView className="p-4">
      <View className="flex-row flex-1 items-center justify-between">
        <Text className="text-xl">Em destaque</Text>
        <Link href="/new">
          <TouchableOpacity className="bg-blue-500 p-2 rounded-md">
            <Text className="text-gray-50">Adicione um anúncio</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <View>
        <Picker
          selectedValue={selectedPriceRange}
          onValueChange={(value) => setSelectedPriceRange(value)}
        >
          <Picker.Item label="Todos" value="" />
          <Picker.Item label="Preço Baixo" value="low" />
          <Picker.Item label="Preço Médio" value="medium" />
          <Picker.Item label="Preço Alto" value="high" />
        </Picker>
      </View>

      <View className="flex gap-5 pb-4 flex-row flex-wrap justify-center items-center mt-5">
        {publications.map((publication) => (
          <View
            key={publication.id}
            className="w-full  bg-blue-500 rounded-xl overflow-hidden shadow-md "
          >
            <Image
              className="w-full h-40 rounded-md"
              r
              source={{ uri: publication.photoUrl }}
            />
            <View className="p-4">
              <View className="flex-row flex-1 items-center justify-between">
                <Text className="text-lg font-bold text-gray-50">
                  {publication.title}
                </Text>
                <Text className="text-lg font-bold text-gray-50">
                  {formatPrice(publication.price)}
                </Text>
              </View>

              <Text className="text-sm text-gray-50">
                {publication.description.substring(0, 25).concat("...")}
              </Text>

              <View className="flex flex-row justify-end gap-2">
                <TouchableOpacity
                  className="bg-blue-400 p-2 rounded-md"
                  onPress={() => addToFavorites(publication.id)}
                >
                  <Text className="text-gray-50">Favoritar</Text>
                </TouchableOpacity>
                <Link href={`/publication/${publication.id}`}>
                  <TouchableOpacity className="bg-blue-400 p-2 rounded-md">
                    <Text className="text-gray-50">Ver mais</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}
