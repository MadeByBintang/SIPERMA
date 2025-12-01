<!DOCTYPE html>
<html>

<head>
    <title>System Reports PDF</title>
    <style>
        /* --- GLOBAL SETTINGS --- */
        @page {
            /* Memastikan A4 Landscape */
            size: A4 landscape;
        }

        body {
            font-family: sans-serif;
            font-size: 9px; /* DIKURANGI: 9px untuk menghemat ruang */
            margin: 10mm;
        }

        h2, h3 {
            margin-top: 25px;
            font-size: 14px; /* Ukuran header tetap sedikit lebih besar */
        }

        /* Mengurangi margin atas untuk tabel detail */
        h3:nth-of-type(2) {
            margin-top: 20px;
        }

        /* --- TABLE STYLING --- */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px; /* Dikurangi */
            table-layout: fixed; /* PENTING: Untuk mengontrol lebar kolom */
        }

        th,
        td {
            border: 1px solid #333;
            padding: 3px; /* DIKURANGI: Padding kecil untuk 12 kolom */
            text-align: left;
            word-break: break-word;
            vertical-align: top; /* PENTING: Agar teks rata atas */
            line-height: 1.2; /* Mengurangi spasi baris */
        }

        th {
            background: #f0f0f0;
            font-weight: bold;
        }

        /* --- COLUMN WIDTH OPTIMIZATION (12 Columns) --- */
        /* Total lebar harus 100% */
        table:last-of-type th:nth-child(1) { width: 8%; }  /* Applicant */
        table:last-of-type th:nth-child(2) { width: 11%; } /* Team/Members */
        table:last-of-type th:nth-child(3) { width: 9%; }  /* Supervisor */
        table:last-of-type th:nth-child(4) { width: 6%; }  /* Type */
        table:last-of-type th:nth-child(5) { width: 18%; } /* Project Title (Paling Lebar) */
        table:last-of-type th:nth-child(6) { width: 6%; }  /* Status */

        /* Kolom Tanggal (8% masing-masing) */
        table:last-of-type th:nth-child(7) { width: 8%; }  /* Start Date */
        table:last-of-type th:nth-child(8) { width: 8%; }  /* End Date */
        table:last-of-type th:nth-child(9) { width: 8%; }  /* Assigned At */
        table:last-of-type th:nth-child(10) { width: 8%; } /* Responded At */
        table:last-of-type th:nth-child(11) { width: 8%; } /* Finished At */

        /* Total: 8+11+9+6+18+6+8+8+8+8+8 = 100% */
    </style>
</head>

<body>
    <h2>System Reports</h2>

    <h3>Global Statistics</h3>
    <p>Total Projects: {{ $stats['totalProjects'] }}</p>
    <p>Active Projects: {{ $stats['totalActive'] }}</p>
    <p>Completed Projects: {{ $stats['totalCompleted'] }}</p>
    <p>Total Supervisors: {{ $stats['totalSupervisors'] }}</p>
    <p>Avg Students per Supervisor: {{ $stats['avgStudents'] }}</p>

    <h3>Project Distribution</h3>
    <table>
        <thead>
            <tr>
                <th>Internship (PKL)</th>
                <th>Thesis</th>
                <th>Competition</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{{ $stats['distribution']['internship'] }}</td>
                <td>{{ $stats['distribution']['thesis'] }}</td>
                <td>{{ $stats['distribution']['competition'] }}</td>
            </tr>
        </tbody>
    </table>

    <h3>Detailed Supervision List</h3>
    <table>
        <thead>
            <tr>
                <th>Applicant</th>
                <th>Team/Members</th>
                <th>Supervisor</th>
                <th>Type</th>
                <th>Project Title</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Assigned</th>
                <th>Responded</th>
                <th>Finished</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($supervisions as $s)
                <tr>
                    <td>{{ $s['applicant_name'] }}</td>
                    <td>{!! $s['team_members'] !!}</td>
                    <td>{{ $s['supervisor_name'] }}</td>
                    <td>{{ $s['activity_type'] }}</td>
                    <td>{{ $s['project_title'] }}</td>
                    <td>{{ $s['status'] }}</td>
                    <td>{{ $s['start_date'] }}</td>
                    <td>{{ $s['end_date'] }}</td>
                    <td>{{ $s['assigned_at'] }}</td>
                    <td>{{ $s['responded_at'] }}</td>
                    <td>{{ $s['finished_at'] }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>

</html>
