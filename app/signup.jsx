import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { usePublications } from "../src/contexts/PublicationsProvider";
import { Link } from "expo-router";

export default function SignIn() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [password, setPassword] = useState("");

  const { handleCreateAccount } = usePublications();

  function handleSignUp() {
    if (password !== passwordConfirmation) {
      alert("As senhas não são iguais");
      return;
    }

    handleCreateAccount(email, password, name);

    setName("");
    setEmail("");
    setPassword("");
    setPasswordConfirmation("");
  }

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <Text className="text-2xl font-bold text-center">Cadastre-se!</Text>

      <View className="flex-1 justify-center ">
        <Text className="text-gray-500 text-center mt-2">
          Preencha os dados abaixo para criar sua conta no Catalógo Imobiliário
        </Text>

        <View className="flex flex-col mt-4">
          <Text className="text-gray-500">Nome</Text>
          <TextInput
            className="border border-gray-300 p-2 rounded-md"
            onChangeText={setName}
          />
        </View>

        <View className="flex flex-col mt-4">
          <Text className="text-gray-500">E-mail</Text>
          <TextInput
            className="border border-gray-300 p-2 rounded-md"
            onChangeText={setEmail}
          />
        </View>

        <View className="flex flex-col mt-4">
          <Text className="text-gray-500">Senha</Text>
          <TextInput
            className="border border-gray-300 p-2 rounded-md"
            onChangeText={setPassword}
            secureTextEntry={true}
          />
        </View>

        <View className="flex flex-col mt-4">
          <Text className="text-gray-500">Confirme sua senha</Text>
          <TextInput
            className="border border-gray-300 p-2 rounded-md"
            onChangeText={setPasswordConfirmation}
            secureTextEntry={true}
          />
        </View>

        <TouchableOpacity
          className="bg-blue-500 p-2 rounded-md self-end mt-4"
          onPress={handleSignUp}
        >
          <Text className="text-gray-50">Cadastrar</Text>
        </TouchableOpacity>

        <Link href="/login" asChild>
          <TouchableOpacity
            className="bg-blue-500 p-2 rounded-md self-end mt-4"
            // onPress={handleSignIn}
          >
            <Text className="text-gray-50">Já tenho uma conta</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
