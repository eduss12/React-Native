import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50', // Fondo oscuro, más moderno
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ecf0f1', // Blanco roto
    marginBottom: 40,
    letterSpacing: 2, // Espaciado entre letras
  },
  input: {
    width: '100%',
    backgroundColor: '#ecf0f1', // Color claro de fondo
    padding: 15,
    borderRadius: 30, // Bordes más redondeados
    marginBottom: 20,
    fontSize: 16,
    color: '#34495e', // Color oscuro para el texto
    shadowColor: '#7f8c8d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  button: {
    width: '100%',
    backgroundColor: '#3498db', // Azul brillante
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#2980b9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  linkText: {
    color: '#3498db', // Azul brillante para los links
    marginTop: 20,
    fontSize: 16,
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  inputLabel: {
    color: '#ecf0f1',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    letterSpacing: 1,
  },
  });


export default styles;


