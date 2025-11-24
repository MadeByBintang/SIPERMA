<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: sans-serif;
            font-size: 13px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        table,
        th,
        td {
            border: 1px solid #444;
        }

        th,
        td {
            padding: 6px;
        }

        h2 {
            text-align: center;
        }
    </style>
</head>

<body>
    <h2>Laporan Aktivitas (Admin)</h2>
    <p>Jumlah kegiatan: {{ count($activities) }}</p>
    <hr>

    <table>
        <thead>
            <tr>
                <th>Mahasiswa</th>
                <th>Kegiatan</th>
                <th>Jenis</th>
                <th>Pembimbing</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($activities as $a)
                <tr>
                    <td>{{ $a['student'] }}</td>
                    <td>{{ $a['activityName'] }}</td>
                    <td>{{ $a['activityType'] }}</td>
                    <td>{{ $a['supervisor'] }}</td>
                    <td>{{ $a['status'] }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

</body>

</html>
