from json import dumps
import csv
from django.shortcuts import render
from django.http import HttpResponse


csvFilePath4 = 'prova/percorsiEventi.csv'


# Create your views here.
def listToDict(lstA, lstB):
    op = []
    for i in lstB:
        p = zip(lstA, i)
        op.append(dict(p))
    return op


def listToDict3(lstA, lstB):
    op = []
    op2 = []
    i = 0
    while i < len(lstB) - 1:
        p = zip(lstA, lstB[i])
        op.append(dict(p))
        p2 = zip(lstA, lstB[i + 1])
        op2.append(dict(p2))
        i = i + 2
    return op, op2


def show_map(request):

    lstStr2 = ['timestep_time', 'vehicle_id', 'lng', 'lat', 'vehicle_angle', 'vehicle_type', 'vehicle_speed',
               'vehicle_pos', "vehicle_lane", "vehicle_slope", 'evento_critico']

    file2 = open(csvFilePath4, "r")
    data3 = list(csv.reader(file2, delimiter=";"))
    file2.close()

    data7 = listToDict(lstStr2, data3)

    veicoli = dumps(data7)
    print(veicoli)

    return render(request, 'prova.html',
                  {'veicoli': veicoli})
