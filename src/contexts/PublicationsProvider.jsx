import { useContext, createContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { signUpWithEmailAndPassword } from "../api/api"
import { useRouter } from "expo-router"

const PublicationsContext = createContext()

export function PublicationsProvider({ children }) {
  const [publications, setPublications] = useState([])
  const [user, setUser] = useState(null)
  const [updated, setUpdated] = useState(false)
  const [auth, setAuth] = useState(false)
  const [login, setLogin] = useState(false)
  const [addressLocation, setAddressLocation] = useState(null)
  const [nomeRua, setNomeRua] = useState("")
  const [numero, setNumero] = useState("")
  const [bairro, setBairro] = useState("")
  const [cidade, setCidade] = useState("")
  const [estado, setEstado] = useState("")

  const router = useRouter()

  async function handleCreateAccount(email, password, displayName) {
    try {
      await signUpWithEmailAndPassword(email, password, displayName)

      router.push("/login")
    } catch (error) {
      console.error("Erro ao criar usuário:", error)
    }
  }

  useEffect(() => {
    AsyncStorage.getItem("@user").then((user) => {
      setUser(JSON.parse(user))
      setAuth(true)
    })

    getData()
  }, [])

  //limpar o async storage
  // useEffect(() => {
  //   AsyncStorage.removeItem("@publications")
  // }, [])

  const [selectedPriceRange, setSelectedPriceRange] = useState("")

  async function getData() {
    try {
      const publications = await AsyncStorage.getItem("@publications")
      if (publications) {
        const parsedPublications = JSON.parse(publications)

        let filteredPublications = parsedPublications

        // Verificar se um intervalo de preço foi selecionado
        if (selectedPriceRange !== "") {
          // Filtrar as publicações com base no preço
          if (selectedPriceRange === "low") {
            filteredPublications = parsedPublications.filter(
              (publication) => publication.price < 100000
            )
          } else if (selectedPriceRange === "medium") {
            filteredPublications = parsedPublications.filter(
              (publication) =>
                publication.price >= 100000 && publication.price <= 500000
            )
          } else if (selectedPriceRange === "high") {
            filteredPublications = parsedPublications.filter(
              (publication) => publication.price > 500000
            )
          }
        }

        setPublications(filteredPublications)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    AsyncStorage.getItem("@user").then((user) => {
      setUser(JSON.parse(user))
      setAuth(true)

      getData()
    })
  }, [login])

  useEffect(() => {
    AsyncStorage.getItem("@user").then((user) => {
      setUser(JSON.parse(user))
      setAuth(true)
    })

    getData()
  }, [selectedPriceRange])

  function handleLogout() {
    AsyncStorage.removeItem("@user")
    setUser(null)
  }

  return (
    <PublicationsContext.Provider
      value={{
        publications,
        setPublications,
        setUpdated,
        updated,
        getData,
        handleCreateAccount,
        user,
        auth,
        handleLogout,
        setLogin,
        selectedPriceRange,
        setSelectedPriceRange,
        setAddressLocation,
        addressLocation,
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
      }}
    >
      {children}
    </PublicationsContext.Provider>
  )
}

export function usePublications() {
  const context = useContext(PublicationsContext)
  return context
}
