import React from 'react';
import { Tabs } from 'expo-router';
import { MobileAuthProvider } from '../src/context/auth-context';
import { MobileLanguageProvider } from '../src/context/language-context';

const TabsNav: any = Tabs;

export default function MobileLayout() {
  return (
    <MobileLanguageProvider>
      <MobileAuthProvider>
        <TabsNav
          screenOptions={{
            tabBarActiveTintColor: '#4f46e5',
            tabBarInactiveTintColor: '#94a3b8',
            tabBarStyle: {
              backgroundColor: '#ffffff',
              borderTopColor: '#e2e8f0',
              height: 60,
              paddingBottom: 8,
              paddingTop: 8,
            },
            headerStyle: {
              backgroundColor: '#4f46e5',
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Tabs.Screen name="index" options={{ title: 'Home' }} />
          <Tabs.Screen name="library" options={{ title: 'Library' }} />
          <Tabs.Screen name="tutor" options={{ title: 'AI Tutor' }} />
          <Tabs.Screen name="exams" options={{ title: 'Exams' }} />
          <Tabs.Screen name="progress" options={{ title: 'Progress' }} />
          <Tabs.Screen name="geography" options={{ title: 'Geography' }} />
        </TabsNav>
      </MobileAuthProvider>
    </MobileLanguageProvider>
  );
}
