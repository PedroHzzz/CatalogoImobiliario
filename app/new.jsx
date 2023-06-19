import { Link, useRouter } from "expo-router"
import { View, Text, TouchableOpacity, Image } from "react-native"
import { ScrollView, TextInput } from "react-native-gesture-handler"
import * as ImagePicker from "expo-image-picker"
import { useState } from "react"
import { usePublications } from "../src/contexts/PublicationsProvider"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { addAnnouncement } from "../src/api/api"

export default function NewPublication() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const [telefone, setTelefone] = useState("")
  const [cep, setCep] = useState("")
  const [price, setPrice] = useState(0)
  const [preview, setPreview] = useState(null)
  const { user, setAddressLocation, addressLocation } = usePublications()

  const {
    getData,
    setUpdated,
    nomeRua,
    setNomeRua,
    numero,
    setNumero,
    bairro,
    setBairro,
    cidade,
    setCidade,
    estado,
    setEstado,
  } = usePublications()

  const router = useRouter()

  async function openImagePicker() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      })

      if (result.assets[0]) {
        setPreview(result.assets[0].uri)
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function getAdress() {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await response.json()
      setNomeRua(data.logradouro)
      setBairro(data.bairro)
      setCidade(data.localidade)
      setEstado(data.uf)
      setAddressLocation(data)
    } catch (error) {
      console.log(error)
    }
  }

  async function handleCreatePublication() {
    const newPublication = {
      title,
      description,
      price,
      telefone,
      photoUrl: preview,
      id: new Date().getTime().toString(),
      addressLocation,
      endereco: {
        rua: nomeRua,
        numero,
        bairro,
        cidade,
        estado,
        cep,
      },
    }

    try {
      const publications = await AsyncStorage.getItem("@publications")
      const publicationsArray = publications ? JSON.parse(publications) : []
      await AsyncStorage.setItem(
        "@publications",
        JSON.stringify([...publicationsArray, newPublication])
      )

      addAnnouncement(user.uid, newPublication)

      setUpdated(true)
      await getData()
      router.push("/")
    } catch (error) {
      console.log(error)
    }
  }

  if (!user) {
    return router.push("/login")
  }

  return (
    <ScrollView>
      <View className="flex-1 p-4">
        <Text className="text-2xl font-bold text-center">Novo anúncio</Text>

        <Text className="text-gray-500 text-center mt-2">
          Preencha os dados abaixo para anunciar um novo produto no Catalógo Imobiliário
        </Text>

        <View className="flex flex-col mt-4">
          <Text className="text-gray-500">Título</Text>
          <TextInput
            className="border border-gray-300 p-2 rounded-md"
            onChangeText={setTitle}
          />
        </View>

        <View className="flex flex-col mt-4">
          <Text className="text-gray-500">Descrição</Text>
          <TextInput
            className="border border-gray-300 p-2 rounded-md"
            onChangeText={setDescription}
          />
        </View>

        <View className="flex flex-col mt-4">
          <Text className="text-gray-500">Preço</Text>
          <TextInput
            className="border border-gray-300 p-2 rounded-md w-1/4"
            onChangeText={setPrice}
          />
        </View>
        <View className="flex flex-col mt-4">
          <Text className="text-gray-500">Telefone</Text>
          <TextInput
            className="border border-gray-300 p-2 rounded-md w-1/4"
            onChangeText={setTelefone}
          />
        </View>

        <View className="flex flex-col mt-4">
          <Text className="text-gray-500">Cep</Text>
          <TextInput
            className="border border-gray-300 p-2 rounded-md w-1/4"
            onChangeText={setCep}
          />
          <TouchableOpacity
            className="border border-gray-300 p-2 rounded-md flex-row items-center justify-center mt-2"
            onPress={getAdress}
          >
            <Text className="text-gray-500">Buscar endereço</Text>
          </TouchableOpacity>

          {nomeRua && (
            <View>
              <View className="flex flex-col mt-4">
                <Text className="text-gray-500">Rua</Text>
                <TextInput
                  className="border border-gray-300 p-2 rounded-md"
                  value={nomeRua}
                  onChangeText={setNomeRua}
                />
              </View>

              <View className="flex flex-col mt-4">
                <Text className="text-gray-500">Número</Text>
                <TextInput
                  className="border border-gray-300 p-2 rounded-md"
                  value={numero}
                  onChangeText={setNumero}
                />
              </View>

              <View className="flex flex-col mt-4">
                <Text className="text-gray-500">Bairro</Text>
                <TextInput
                  className="border border-gray-300 p-2 rounded-md"
                  value={bairro}
                  onChangeText={setBairro}
                />
              </View>

              <View className="flex flex-col mt-4">
                <Text className="text-gray-500">Cidade</Text>
                <TextInput
                  className="border border-gray-300 p-2 rounded-md"
                  value={cidade}
                  onChangeText={setCidade}
                />
              </View>

              <View className="flex flex-col mt-4">
                <Text className="text-gray-500">Estado</Text>
                <TextInput
                  className="border border-gray-300 p-2 rounded-md"
                  value={estado}
                  onChangeText={setEstado}
                />
              </View>
            </View>
          )}
        </View>

        <View className="flex flex-col mt-4">
          <Text className="text-gray-500">Foto</Text>
          <TouchableOpacity
            className="border border-gray-300 p-2 rounded-md flex-row items-center justify-center"
            onPress={openImagePicker}
          >
            <Text className="text-gray-500">Selecione uma foto</Text>
          </TouchableOpacity>
        </View>

        {preview && (
          <View className="flex flex-col mt-4 flex-1">
            <Text className="text-gray-500">Prévia</Text>
            <View className="p-2 rounded-md flex-row items-center justify-center flex-1">
              <Image
                style={{ width: 200, height: 200 }}
                source={{ uri: preview }}
                className="rounded-md w-full flex-1 object-cover"
              />
            </View>
          </View>
        )}

        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            className="bg-blue-500 p-2 rounded-md self-end mt-4"
            onPress={handleCreatePublication}
          >
            <Text className="text-gray-50">Publicar</Text>
          </TouchableOpacity>

          <Link href="/" asChild>
            <TouchableOpacity className="bg-gray-500 p-2 rounded-md self-end">
              <Text className="text-gray-50">Voltar para o ínicio</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ScrollView>
  )
}
