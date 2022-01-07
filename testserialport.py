import serial.tools.list_ports
ports = serial.tools.list_ports.comports()

def testserialport12():
    flag=0

    for port, desc, hwid in sorted(ports):
        if "USB-SERIAL CH340" in desc: 
            print ('Connected in port ', port)
            flag=1

    if(flag==0):
        print('No ports')

testserialport12()

