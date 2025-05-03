<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Ficha del Paciente - Hospital Infantil</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f8fbff;
            color: #1f2937;
            margin: 40px;
        }

        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 3px solid #3b82f6;
        }

        .header .title {
            font-size: 24px;
            font-weight: bold;
            color: #3b82f6;
        }

        .header .subtitle {
            font-size: 14px;
            color: #6b7280;
            margin-top: 5px;
        }

        .section {
            margin-top: 30px;
            padding: 20px;
            background-color: #ffffff;
            border: 1px solid #d1d5db;
            border-radius: 12px;
        }

        .section-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #111827;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
        }

        th, td {
            padding: 10px 12px;
            text-align: left;
            vertical-align: top;
        }

        th {
            width: 35%;
            background-color: #f1f5f9;
            color: #374151;
            font-weight: bold;
        }

        td {
            color: #1f2937;
        }

        .footer {
            margin-top: 40px;
            font-size: 12px;
            text-align: right;
            color: #6b7280;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">Hospital Infantil</div>
        <div class="subtitle">Ficha del Paciente</div>
    </div>

    <div class="section">
        <div class="section-title">Datos del Paciente</div>
        <table>
            <tr>
                <th>Nombre completo</th>
                <td>{{ $patient->full_name }}</td>
            </tr>
            <tr>
                <th>Edad</th>
                <td>{{ $age }}</td>
            </tr>
            <tr>
                <th>Género</th>
                <td>{{ $patient->gender }}</td>
            </tr>
            <tr>
                <th>Fecha de nacimiento</th>
                <td>{{ $patient->birth_date->format('d/m/Y') }}</td>
            </tr>
            <tr>
                <th>Hospital</th>
                <td>{{ $patient->hospital->name }}</td>
            </tr>
            <tr>
                <th>Ciudad</th>
                <td>{{ $patient->city->name }}</td>
            </tr>
            <tr>
                <th>Nombre del tutor</th>
                <td>{{ $patient->tutor_name }}</td>
            </tr>
            <tr>
                <th>Teléfono del tutor</th>
                <td>{{ $patient->tutor_phone }}</td>
            </tr>
            <tr>
                <th>Fecha de registro</th>
                <td>{{ $patient->registration_date->format('d/m/Y') }}</td>
            </tr>
        </table>
    </div>

    <div class="footer">
        Generado el: {{ $current_date }}
    </div>
</body>
</html>
