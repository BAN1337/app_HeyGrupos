import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SignIn from "../pages/SignIn";
import ChatRoom from "../pages/ChatRoom";
import Messages from "../pages/Messages";
import Search from "../pages/Search";

const AppStack = createNativeStackNavigator()

export default function AppRoutes() {
    return (
        <AppStack.Navigator initialRouteName="ChatRoom">
            <AppStack.Screen
                name="SignIn"
                component={SignIn}
                options={{
                    title: 'Faça Login'
                }}
            />

            <AppStack.Screen
                name="ChatRoom"
                component={ChatRoom}
                options={{
                    headerShown: false
                }}
            />
        </AppStack.Navigator>
    )
}