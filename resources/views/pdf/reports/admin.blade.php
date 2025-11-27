<!DOCTYPE html>
<html>

<head>
    <title>System Reports PDF</title>
    <style>
        body {
            font-family: sans-serif;
            font-size: 12px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        th,
        td {
            border: 1px solid #333;
            padding: 8px;
            text-align: left;
        }

        th {
            background: #f0f0f0;
        }
    </style>
</head>

<body>
    <h2>System Reports</h2>

    <p>Total Projects: {{ $stats['totalProjects'] }}</p>
    <p>Active Projects: {{ $stats['totalActive'] }}</p>
    <p>Completed Projects: {{ $stats['totalCompleted'] }}</p>
    <p>Total Supervisors: {{ $stats['totalSupervisors'] }}</p>
    <p>Avg Students per Supervisor: {{ $stats['avgStudents'] }}</p>

    <h3>Project Distribution</h3>
    <table>
        <thead>
            <tr>
                <th>PKL</th>
                <th>Thesis</th>
                <th>Competition</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{{ $stats['distribution']['pkl'] }}</td>
                <td>{{ $stats['distribution']['thesis'] }}</td>
                <td>{{ $stats['distribution']['competition'] }}</td>
            </tr>
        </tbody>
    </table>
</body>

</html>
