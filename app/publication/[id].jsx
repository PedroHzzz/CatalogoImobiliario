import { Link, usePathname, useRouter } from "expo-router"
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react"
import { formatPrice } from "../../src/helpers/formatPrice"
import { usePublications } from "../../src/contexts/PublicationsProvider"
import { Geolocation } from "react-native"
import MapView, { Marker } from "react-native-maps"
import axios from "axios"

export default function Route() {
  const pathname = usePathname()
  const { getData } = usePublications()
  const id = pathname.split("/")[2]
  const [publication, setPublication] = useState({})
  const [relacionados, setRelacionados] = useState([])
  const [cord, setCord] = useState(null)

  const router = useRouter()

  async function getUniquePublication() {
    try {
      const publications = await AsyncStorage.getItem("@publications")
      const publicationsArray = publications ? JSON.parse(publications) : []
      const publication = publicationsArray.find(
        (publication) => publication.id === id
      )

      setPublication(publication)
      return publication
    } catch (error) {
      console.log(error)
    }
  }

  async function getRelatedPublications() {
    try {
      const publications = await AsyncStorage.getItem("@publications")
      const publicationsArray = publications ? JSON.parse(publications) : []
      const relatedPublications = publicationsArray.filter((publication) =>
        publication.title.includes(publication.title)
      )

      setRelacionados(relatedPublications)
      return relatedPublications
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getUniquePublication()
    getRelatedPublications()
  }, [id])

  const address = `${publication?.addressLocation?.logradouro}, ${100}, ${
    publication?.addressLocation?.bairro
  }, ${publication?.addressLocation?.localidade}, ${
    publication?.addressLocation?.uf
  }`

  const getCoordinates = async () => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=AIzaSyClwCjaLFaVyPG7RppCOygiE86Rfbv7t1g`
      )

      console.log("response", response.data)
      const { results } = response.data
      if (results.length > 0) {
        const { lat, lng } = results[0].geometry.location
        setCord({ latitude: lat, longitude: lng })
      }
    } catch (error) {
      console.log(error)
    }
    return null
  }

  useEffect(() => {
    getCoordinates()
  }, [publication])

  async function handleDeletePublication(id) {
    try {
      const publications = await AsyncStorage.getItem("@publications")
      const publicationsArray = publications ? JSON.parse(publications) : []
      const newPublications = publicationsArray.filter(
        (publication) => publication.id !== id
      )
      await AsyncStorage.setItem(
        "@publications",
        JSON.stringify(newPublications)
      )

      getData()
      router.push("/")
    } catch (error) {
      console.log(error)
    }
  }

  console.log("address", address)

  return (
    <ScrollView>
      <View className="flex-1 bg-gray-50 mt-4 justify-start items-center gap-3 p-4">
        <Text className="text-center font-bold text-2xl">
          {publication?.title}
        </Text>
        <Image
          className="w-full h-40 rounded-md"
          r
          source={{ uri: publication?.photoUrl }}
        />
        <View className="bg-blue-500 p-2 rounded-md w-full">
          <View className="self-start py-6">
            <Text className="text-gray-50  font-bold text-lg">
              Rua: {publication?.endereco?.rua} -{" "}
              {publication?.endereco?.numero}
            </Text>
            <Text className="text-gray-50  font-bold text-lg">
              {publication?.endereco?.bairro}, {publication?.endereco?.cidade} -{" "}
              {publication?.endereco?.estado}
            </Text>
            <Text className="text-gray-50  font-bold text-lg">
              Cep: {publication?.endereco?.cep}
            </Text>
          </View>
          <Text className="text-gray-50 text-center font-bold text-lg">
            {publication?.description}
          </Text>
          <Text className="text-gray-50 text-right font-bold text-lg">
            {formatPrice(publication?.price)}
          </Text>

          <Text className="text-lg text-gray-50 py-5">
            <Link href={`https://wa.me/${publication?.telefone}`}>
              Chame no Whatsapp!{" "}
              <Image
                className="w-5 h-5"
                source={require("../../assets/whatsapp-logo.png")}
              />
            </Link>
          </Text>
          <View className="flex-row items-center justify-between mt-4">
            <TouchableOpacity
              className="bg-blue-600 p-2 rounded-md"
              onPress={() => {}}
            >
              <Text className="text-gray-50 text-center font-bold text-lg">
                Editar
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {cord && (
          <MapView
            style={{ width: "100%", height: 200 }}
            initialRegion={{
              latitude: cord.latitude,
              longitude: cord.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: cord.latitude,
                longitude: cord.longitude,
              }}
              title="Endereço Registrado"
              description={`
                ${publication?.addressLocation?.logradouro}, ${100}, ${
                publication?.addressLocation?.bairro
              }, ${publication?.addressLocation?.localidade}, ${
                publication?.addressLocation?.uf
              }

              `}
            />
          </MapView>
        )}

        <View className="self-end">
          <Link href="/" asChild>
            <TouchableOpacity className="bg-blue-600 p-2 rounded-md">
              <Text className="text-gray-50 text-center font-bold text-lg">
                Voltar
              </Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View className="flex flex-1 items-center justify-between">
          <Text className="text-xl">Relacionados</Text>

          <View className="flex gap-5 pb-4 flex-row flex-wrap justify-center items-center mt-5">
            {relacionados?.map((publication) => (
              <Link
                key={publication.id}
                href={`/publication/${publication.id}`}
                asChild
              >
                <TouchableOpacity className="bg-blue-600 p-2 rounded-md w-full">
                  <View className="bg-blue-500 p-2 rounded-md ">
                    <Text className="text-gray-50 text-center font-bold text-lg">
                      {publication.title}
                    </Text>
                    <Text className="text-gray-50 text-center font-bold text-lg">
                      {formatPrice(publication.price)}
                    </Text>
                    <Image
                      className="w-full h-20 rounded-md"
                      source={{ uri: publication.photoUrl }}
                    />
                  </View>
                </TouchableOpacity>
              </Link>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
