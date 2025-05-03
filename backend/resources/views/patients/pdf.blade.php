<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Historial del Paciente</title>
    <style>
        body { font-family: Arial, sans-serif; }
        .header { text-align: center; margin-bottom: 20px; }
        .title { font-size: 20px; font-weight: bold; }
        .patient-info { margin-bottom: 15px; }
        .label { font-weight: bold; }
        .footer { margin-top: 30px; font-size: 12px; text-align: right; }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">Hospital Infantil - Ficha del Paciente</div>
    </div>
    
    <div class="patient-info">
        <div class="label">Nombre completo:</div>
        <div>{{ $patient->full_name }}</div>
    </div>
    
    <div class="patient-info">
        <div class="label">Edad:</div>
        <div>{{ $age }}</div>
    </div>
    
    <div class="patient-info">
        <div class="label">Género:</div>
        <div>{{ $patient->gender }}</div>
    </div>
    
    <div class="patient-info">
        <div class="label">Fecha de nacimiento:</div>
        <div>{{ $patient->birth_date->format('d/m/Y') }}</div>
    </div>
    
    <div class="patient-info">
        <div class="label">Hospital:</div>
        <div>{{ $patient->hospital->name }}</div>
    </div>
    
    <div class="patient-info">
        <div class="label">Ciudad:</div>
        <div>{{ $patient->city->name }}</div>
    </div>
    
    <div class="patient-info">
        <div class="label">Nombre del tutor:</div>
        <div>{{ $patient->tutor_name }}</div>
    </div>
    
    <div class="patient-info">
        <div class="label">Teléfono del tutor:</div>
        <div>{{ $patient->tutor_phone }}</div>
    </div>
    
    <div class="patient-info">
        <div class="label">Fecha de registro:</div>
        <div>{{ $patient->registration_date->format('d/m/Y') }}</div>
    </div>
    
    <div class="footer">
        Generado el: {{ $current_date }}
    </div>
</body>
</html>