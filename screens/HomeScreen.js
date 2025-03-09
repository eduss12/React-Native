import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import GestionScreen from './GestionScreen';
import CalendarScreen from './CalendarScreen';
import StatisticsScreen from './StatisticsScreen';

const Tab = createBottomTabNavigator();

const HomeScreen = ({route={}}) => {
  const { userId } = route.params || {}; // Obtener el userId de las props de navegación
  
  console.log("Home userId" + userId)
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Gestión') {
            iconName = 'add-circle';
          } else if (route.name === 'Calendario') {
            iconName = 'calendar';
          } else if (route.name === 'Estadísticas') {
            iconName = 'stats-chart';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: 'gray',
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: '#f4f4f9' },
        headerTitle: 'Mi Aplicación',
      })}
    >
      <Tab.Screen 
        name="Gestión" 
        component={GestionScreen} 
        options={{ headerTitle: 'Gestión de Etiquetas' }} 
        initialParams={{ userId }}
      />
      <Tab.Screen name="Calendario" 
      component={CalendarScreen} options={{ headerTitle: 'Calendario de Recordatorios' }} 
      initialParams={{ userId }} />
      <Tab.Screen name="Estadísticas" 
      component={StatisticsScreen} 
      options={{ headerTitle: 'Estadisticas' }} 
        initialParams={{ userId }}/>
    </Tab.Navigator>
  );
};

export default HomeScreen;
