import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, FlatList, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import styles from '../styles/StylesHome';

const CalendarScreen = ({ route }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [tasks, setTasks] = useState({});
  const [availableTags, setAvailableTags] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [taskColor, setTaskColor] = useState('#4CAF50');
  const [modalVisible, setModalVisible] = useState(false);
  const userId = route.params?.userId || null;
  const colors = ['#4CAF50', '#FF9800', '#2196F3', '#E91E63', '#9C27B0'];

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(`http://172.20.10.2:3000/get-objects/${userId}`);
        const data = await response.json();
        if (data && data.objects) {
          setAvailableTags(data.objects.map((obj) => obj.object_name));
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar las etiquetas: ' + error.message);
      }
    };
    fetchTags();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`http://172.20.10.2:3000/get-tasks/${userId}`);
        const data = await response.json();
        if (data && data.tasks) {
          const groupedTasks = data.tasks.reduce((acc, task) => {
            const date = task.task_date;
            if (!acc[date]) {
              acc[date] = [];
            }
            acc[date].push({
              id: task.id,
              name: task.task_name,
              tags: task.task_tags.split(','),
              color: task.task_color,
            });
            return acc;
          }, {});
          setTasks(groupedTasks);
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar las tareas: ' + error.message);
      }
    };
    fetchTasks();
  }, [userId]);

  const handleDayPress = (day) => {
    setSelectedDay(day.dateString);
    setModalVisible(true);
  };

  const handleSaveTask = async () => {
    if (!newTaskName.trim()) {
      Alert.alert('Error', 'El nombre de la tarea no puede estar vacío.');
      return;
    }

    try {
      const response = await fetch('http://172.20.10.2:3000/save-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskName: newTaskName,
          taskDate: selectedDay,
          taskTags: selectedTags,
          taskColor: taskColor,
          userId: userId,
        }),
      });

      if (response.ok) {
        setTasks((prevTasks) => {
          const updatedTasks = { ...prevTasks };
          if (!updatedTasks[selectedDay]) {
            updatedTasks[selectedDay] = [];
          }
          updatedTasks[selectedDay].push({
            id: Date.now().toString(), // ID temporal
            name: newTaskName,
            tags: selectedTags,
            color: taskColor,
          });
          return updatedTasks;
        });

        setNewTaskName('');
        setSelectedTags([]);
        setTaskColor('#4CAF50');
        setModalVisible(false);
        Alert.alert('Éxito', 'Tarea guardada correctamente.');
      } else {
        Alert.alert('Error', 'Error al guardar la tarea.');
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al guardar la tarea. Intenta nuevamente.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://172.20.10.2:3000/delete-task/${taskId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setTasks((prevTasks) => {
          const updatedTasks = { ...prevTasks };
          updatedTasks[selectedDay] = updatedTasks[selectedDay].filter((task) => task.id !== taskId);
          return updatedTasks;
        });
        Alert.alert('Éxito', 'Tarea eliminada correctamente.');
      } else {
        Alert.alert('Error', 'Error al eliminar la tarea.');
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al eliminar la tarea. Intenta nuevamente.');
    }
  };

  const filteredTasks = tasks[selectedDay] || [];

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={Object.keys(tasks).reduce((acc, date) => {
          acc[date] = { marked: true };
          return acc;
        }, {})}
      />
      {selectedDay && filteredTasks.length > 0 && (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={[styles.taskItem, { borderLeftColor: item.color }]}>
              <Text style={styles.taskName}>{item.name}</Text>
              <Text style={styles.taskTags}>Etiquetas: {item.tags.join(', ')}</Text>
              <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
                <Text style={styles.deleteButton}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          )}
          ListHeaderComponent={<Text style={styles.taskHeader}>Tareas para {selectedDay}:</Text>}
        />
      )}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Añadir Tarea</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre de la tarea"
              value={newTaskName}
              onChangeText={setNewTaskName}
            />
            <FlatList
              data={availableTags}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.tagButton, selectedTags.includes(item) && styles.selectedTagButton]}
                  onPress={() =>
                    setSelectedTags((prev) =>
                      prev.includes(item)
                        ? prev.filter((tag) => tag !== item)
                        : [...prev, item]
                    )
                  }
                >
                  <Text
                    style={[styles.tagButtonText, selectedTags.includes(item) && styles.selectedTagButtonText]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <View style={styles.colorSelector}>
              {colors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[styles.colorOption, { backgroundColor: color }, color === taskColor && styles.selectedColorOption]}
                  onPress={() => setTaskColor(color)}
                />
              ))}
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveTask}>
              <Text style={styles.saveButtonText}>Guardar Tarea</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CalendarScreen;
