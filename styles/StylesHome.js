import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f9',
  },
  weatherItem: {
    padding: 10,
    backgroundColor: '#e0f7fa',
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherDate: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  weatherTemp: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
  },
  weatherDescription: {
    fontSize: 16,
    color: '#00796b',
    marginTop: 5,
  },
  optionButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    marginBottom: 20,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    alignSelf: 'center',
  },
  optionText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  objectsList: {
    marginTop: 20,
  },
  objectItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rfidCodeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  objectNameText: {
    fontSize: 14,
    color: '#777',
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
  },
  emptyListText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#aaa',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tagButton: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  selectedTagButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  tagButtonText: {
    color: '#000',
  },
  selectedTagButtonText: {
    color: 'white',
  },
  taskHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  taskItem: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    borderLeftWidth: 5,
    borderColor: '#ccc',
    marginBottom: 5,
  },
  taskName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskTags: {
    fontSize: 14,
    color: '#666',
  },
  colorSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'white',
  },
  selectedColorOption: {
    borderColor: '#333',
  },
  centeredScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 20,
    color: '#aaa',
  },
  eventsContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  eventItemText: {
    fontSize: 16,
    color: '#555',
  },
  // Modal estilos reutilizados:
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '80%', backgroundColor: '#fff', padding: 20, borderRadius: 10, elevation: 5 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalText: { fontSize: 16, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 5, padding: 10, marginBottom: 10, width: '100%' },
  saveButton: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 5 },
  saveButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});

export default styles;