import React, { useState, useEffect, use } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import styles from '../styles/StylesHome.js';

const GestionScreen = ({route}) => {

  const {userId} = route.params || {};

  console.log("GestionId: " +userId);

  const [rfidCode, setRfidCode] = useState('');
  const [objectName, setObjectName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [objectsList, setObjectsList] = useState([]);

  useEffect(() => {
    const fetchObjectsList = async () => {
      try {
        const response = await fetch(`http://172.20.10.2:3000/get-objects/${userId}`);
        const data = await response.json();
        if (data && data.objects) {
          setObjectsList(data.objects);
        } else {
          Alert.alert('Error', 'No se pudo obtener la lista de objetos.');
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudo obtener la lista de objetos: ' + error.message);
      }
    };

    fetchObjectsList();
  }, []);

  const handleReadRFID = async () => {
    try {
      const response = await fetch('http://172.20.10.2:3000/read-rfid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (response.status === 200) {
        setRfidCode(data.rfidCode);
        setModalVisible(true);
      } else {
        Alert.alert('Error', data.message || 'Error leyendo RFID.');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Error al conectarse al servidor.');
    }
  };

  const handleAssignRFID = async () => {
    try {
        console.log({ rfidCode, objectName,userId });
      const response = await fetch('http://172.20.10.2:3000/assign-rfid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rfidCode, objectName,  userId }),
      });

      const data = await response.json();
      if (response.status === 201) {
        Alert.alert('Éxito', 'Objeto asignado correctamente.');
        setModalVisible(false);
        setObjectName('');
        setRfidCode('');
        setObjectsList([...objectsList, { rfid_code: rfidCode, object_name: objectName }]);
      } else {
        Alert.alert('Error', data.message || 'Error asignando RFID.');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Error al conectarse al servidor.');
    }
  };

  const handleDeleteObject = async (rfidCodeToDelete) => {
    try {
      const response = await fetch(`http://172.20.10.2:3000/delete-object/${rfidCodeToDelete}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (response.status === 200) {
        Alert.alert('Éxito', 'Etiqueta eliminada correctamente.');
        setObjectsList(objectsList.filter(item => item.rfid_code !== rfidCodeToDelete));
      } else {
        Alert.alert('Error', data.message || 'Error eliminando la etiqueta.');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Error al conectarse al servidor.');
    }
  };

  const renderObjectItem = ({ item }) => (
    <View style={styles.objectItem}>
      <Text style={styles.rfidCodeText}>RFID: {item.rfid_code}</Text>
      <Text style={styles.objectNameText}>Nombre: {item.object_name}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteObject(item.rfid_code)}>
        <Text style={styles.deleteButtonText}>🗑️ Eliminar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.optionButton} onPress={handleReadRFID}>
        <Text style={styles.optionText}>📦 Añadir Etiqueta</Text>
      </TouchableOpacity>

      <FlatList
        data={objectsList}
        renderItem={renderObjectItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.objectsList}
        ListEmptyComponent={<Text style={styles.emptyListText}>No hay objetos asignados aún.</Text>}
      />

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Asociar Objeto al RFID</Text>
            <Text style={styles.modalText}>Código RFID: {rfidCode}</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre del Objeto"
              value={objectName}
              onChangeText={setObjectName}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleAssignRFID}>
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default GestionScreen;
