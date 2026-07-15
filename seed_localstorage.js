const fs = require('fs');
const mockData = JSON.parse(fs.readFileSync('mockData.json', 'utf8'));

// We need to inject this into the browser's localStorage.
// Easiest way during tests is to have a small script that runs when the admin/guard page loads
// Or just inject it into js/engine.js initialization.

const scriptContent = `
(function() {
    // Seed mock data for V1.0 Verification
    if (!localStorage.getItem('nsf_v1_seeded')) {
        const mockEmployees = ${JSON.stringify(mockData.employees)};
        const mockLogs = ${JSON.stringify(mockData.attendanceLogs)};

        localStorage.setItem('nsf_employees', JSON.stringify(mockEmployees));

        // Split logs for different data structures used in the app
        const legacyLogs = mockLogs.filter(l => l.date);
        const newLogs = mockLogs.filter(l => l.timestamp);

        localStorage.setItem('nfs_attendance', JSON.stringify(legacyLogs));
        localStorage.setItem('nsf_attendance_logs', JSON.stringify(newLogs));

        localStorage.setItem('nsf_v1_seeded', 'true');
        console.log("Mock data seeded successfully.");
    }
})();
`;

fs.writeFileSync('js/seed.js', scriptContent);
