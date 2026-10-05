import React from 'react';
import { Tabs } from 'expo-router';
import { MobileAuthProvider } from '../src/context/auth-context';
import { MobileLanguageProvider } from '../src/context/language-context';
import { C } from '../src/styles/theme';
import { Ionicons } from '@expo/vector-icons';

const TabsNav: any = Tabs;

export default function MobileLayout() {
  return (
    <MobileLanguageProvider>
      <MobileAuthProvider>
        <TabsNav
          screenOptions={{
            tabBarActiveTintColor: C['forest-ink'],
            tabBarInactiveTintColor: C['forest-ink'] + '66', // 40% opacity
            tabBarStyle: {
              backgroundColor: C['cream-paper'],
              borderTopColor: C['pencil-gray'] + '4D', // 30% opacity
              borderTopWidth: 1,
              height: 64,
              paddingBottom: 8,
              paddingTop: 8,
            },
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: '600',
            },
            headerStyle: {
              backgroundColor: C['cream-paper'],
              borderBottomColor: C['pencil-gray'] + '4D',
              borderBottomWidth: 1,
              shadowOpacity: 0,
              elevation: 0,
            },
            headerTintColor: C['forest-ink'],
            headerTitleStyle: {
              fontWeight: '700',
              fontSize: 18,
            },
          }}
        >
          {/* 1. Dashboard */}
          <Tabs.Screen
            name="index"
            options={{
              title: 'Dashboard',
              tabBarIcon: ({ color, size }: any) => (
                <Ionicons name="home-outline" size={size || 22} color={color} />
              ),
            }}
          />

          {/* 2. My Library */}
          <Tabs.Screen
            name="library"
            options={{
              title: 'Library',
              tabBarIcon: ({ color, size }: any) => (
                <Ionicons name="book-outline" size={size || 22} color={color} />
              ),
            }}
          />

          {/* 3. AI Study Room */}
          <Tabs.Screen
            name="study-room"
            options={{
              title: 'Study Room',
              tabBarIcon: ({ color, size }: any) => (
                <Ionicons name="sparkles-outline" size={size || 22} color={color} />
              ),
            }}
          />

          {/* 4. Practice & Exams */}
          <Tabs.Screen
            name="practice"
            options={{
              title: 'Practice',
              tabBarIcon: ({ color, size }: any) => (
                <Ionicons name="school-outline" size={size || 22} color={color} />
              ),
            }}
          />

          {/* 5. Progress */}
          <Tabs.Screen
            name="progress"
            options={{
              title: 'Progress',
              tabBarIcon: ({ color, size }: any) => (
                <Ionicons name="trending-up-outline" size={size || 22} color={color} />
              ),
            }}
          />

          {/* Additional routes accessible via navigation */}
          <Tabs.Screen
            name="curriculum"
            options={{
              title: 'Curriculum',
              tabBarIcon: ({ color, size }: any) => (
                <Ionicons name="layers-outline" size={size || 22} color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="map-lab"
            options={{
              title: 'Map Lab',
              tabBarIcon: ({ color, size }: any) => (
                <Ionicons name="map-outline" size={size || 22} color={color} />
              ),
            }}
          />

          {/* Legacy route aliases (hidden from tab bar) */}
          <Tabs.Screen name="tutor" options={{ href: null }} />
          <Tabs.Screen name="exams" options={{ href: null }} />
          <Tabs.Screen name="geography" options={{ href: null }} />
        </TabsNav>
      </MobileAuthProvider>
    </MobileLanguageProvider>
  );
}
