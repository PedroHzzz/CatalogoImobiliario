import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { View, Text } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import Header from "../src/components/Header"
import { PublicationsProvider } from "../src/contexts/PublicationsProvider"
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs"
import { Tabs } from "expo-router"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

export default function Layout() {
  const { bottom, top } = useSafeAreaInsets()
  const Tab = createMaterialBottomTabNavigator()

  return (
    <View
      className="relative flex-1 bg-gray-50"
      style={{ paddingTop: top, paddingBottom: bottom }}
    >
      <PublicationsProvider>
        <StatusBar style="light" translucent />
        <Header />

        {/* <Tabs
          screenOptions={{
            headerShown: true,
            contentStyle: { backgroundColor: "transparent" },
            animation: "slide_from_right",
          }}
          //nao cria todas as telas de uma vez
          lazy={true}
          //estiliza o tabbar
          barStyle={{
            backgroundColor: "#fff",
            borderTopColor: "#ccc",
            borderTopWidth: 1,
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              tabBarLabel: "Home",
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="home" color={color} size={26} />
              ),
            }}
          />
          <Tabs.Screen
            name="cart"
            options={{
              tabBarLabel: "Cart",
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="cart" color={color} size={26} />
              ),
            }}
          />
          <Tabs.Screen
            name="login"
            options={{
              href: "/login",
              tabBarLabel: "Login",
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="login" color={color} size={26} />
              ),
            }}
          />
          <Tabs.Screen
            name="signup"
            options={{
              tabBarLabel: "Signup",
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="account-plus"
                  color={color}
                  size={26}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="new"
            options={{
              tabBarLabel: "New",
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="plus" color={color} size={26} />
              ),
            }}
          />
        </Tabs> */}

        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "transparent" },
            animation: "slide_from_right",
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="cart" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="login" />
        </Stack>
      </PublicationsProvider>
    </View>
  )
}
