import serial
from flask import Flask, jsonify
import random

# Inicializamos el servidor Flask
app = Flask(__name__)

class RFIDReader:
    def __init__(self, port, baudrate=115200):
        """
        Inicializa la conexión con el lector RFID.
        """
        try:
            self.serial = serial.Serial(port, baudrate, timeout=1)
            print(f"Conectado al lector RFID en el puerto {port}")
        except serial.SerialException as e:
            print(f"Error al conectar al puerto {port}: {e}")

    def build_packet(self, address, command, data=None):
        """
        Construye una trama para enviar al lector RFID.
        """
        if data is None:
            data = []

        length = len(data) + 3  # Len incluye Address y Command
        packet = bytearray([0xA0, length, address, command] + data)
        checksum = (~sum(packet) + 1) & 0xFF
        packet.append(checksum)

        return packet

    def send_command(self, address, command, data=None):
        """
        Envía una trama al lector RFID.
        """
        packet = self.build_packet(address, command, data)
        try:
            self.serial.write(packet)
            print(f"Trama enviada: {packet.hex().upper()}")
            response = self.serial.read(1024)
            print(f"Respuesta completa: {response.hex().upper()}")
            return response
        except serial.SerialException as e:
            print(f"Error al enviar comando: {e}")
            return b""

    def parse_response(self, response):
        """
        Analiza la trama de respuesta del lector y extrae los EPCs
        del segmento relevante.
        """
        if len(response) < 30 or response[0] != 0xA0:
            print("Trama inválida o incompleta.")
            return []

        try:
            # Convertir la respuesta en un string hexadecimal
            hex_response = response.hex().upper()

            # Extraer el segmento específico
            start = 30  # Byte 23 (Hexadecimal comienza en 2 * 23)
            end = 34    # Byte 30 (Hexadecimal termina en 2 * 30)
            segment = hex_response[start:end]

            print(f"Segmento analizado: {segment}")
            return [segment]  # Devuelve el segmento como un EPC detectado
        except Exception as e:
            print(f"Error al analizar la trama: {e}")
            return []

    def real_time_inventory(self, address=0x01):
        """
        Realiza un inventario en tiempo real y detecta EPCs.
        """
        print("Iniciando inventario en tiempo real...")
        command = 0x89
        response = self.send_command(address, command, [0x01])
        return self.parse_response(response)

    def close(self):
        """
        Cierra la conexión serial.
        """
        if self.serial.is_open:
            self.serial.close()
            print("Conexión con el lector RFID cerrada.")

# Ruta que se invoca cuando el servidor recibe una solicitud para leer una etiqueta RFID
@app.route('/read-rfid', methods=['GET'])
def read_rfid():
    port = "COM3"  # Cambia este valor según el puerto de tu lector

    # Creamos la instancia del lector RFID
    reader = RFIDReader(port)

    try:
        # Realiza el inventario y obtiene los EPCs
        epcs = reader.real_time_inventory(address=0x01)

        if epcs:
            # Devuelve el primer EPC detectado
            return jsonify({'rfidCode': epcs[0]})
        else:
            # Si no se detectó ningún EPC
            return jsonify({'message': 'No se detectaron etiquetas.'}), 400
    finally:
        reader.close()

if __name__ == '__main__':
    # Inicia el servidor Flask en el puerto 5000
    app.run(host='0.0.0.0', port=5000)
