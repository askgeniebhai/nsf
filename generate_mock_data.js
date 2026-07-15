const fs = require('fs');

const generateMockData = () => {
    const firstNames = ['Amit', 'Rajesh', 'Suresh', 'Vikram', 'Sunil', 'Kushal', 'Priya', 'Neha', 'Ravi', 'Anil', 'Manoj', 'Deepak', 'Sanjay', 'Rahul', 'Vikas', 'Ajay', 'Pooja', 'Kavita', 'Ramesh', 'Dinesh', 'Mohit', 'Rohit', 'Gaurav', 'Arun', 'Tarun'];
    const lastNames = ['Kumar', 'Singh', 'Sharma', 'Verma', 'Gupta', 'Patel', 'Yadav', 'Joshi', 'Chauhan', 'Thakur', 'Mishra', 'Pandey', 'Tiwari', 'Das', 'Roy', 'Rana'];

    const designations = ['Security Guard', 'Head Guard', 'Supervisor', 'CCTV Operator', 'Gunman'];
    const salaries = {
        'Security Guard': 15000,
        'Head Guard': 18000,
        'Supervisor': 25000,
        'CCTV Operator': 20000,
        'Gunman': 22000
    };

    const employees = [];

    // Ensure NFS-9921 John Smith exists for the tests
    employees.push({
        id: 'NFS-9921',
        name: 'John Smith',
        mobile: '9876543210',
        designation: 'Security Guard',
        salary: 15000,
        aadhaar: '123456789012',
        pan: 'ABCDE1234F',
        status: 'Active',
        rank: 'Guard',
        shift: 'Day'
    });

    for (let i = 2; i <= 25; i++) {
        const id = `NFS-${i.toString().padStart(3, '0')}`;
        const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
        const desig = designations[Math.floor(Math.random() * designations.length)];

        employees.push({
            id: id,
            name: name,
            mobile: `9${Math.floor(Math.random() * 900000000) + 100000000}`,
            designation: desig,
            salary: salaries[desig],
            aadhaar: `${Math.floor(Math.random() * 900000000000) + 100000000000}`,
            pan: `${String.fromCharCode(65+Math.floor(Math.random()*26))}${String.fromCharCode(65+Math.floor(Math.random()*26))}${String.fromCharCode(65+Math.floor(Math.random()*26))}${String.fromCharCode(65+Math.floor(Math.random()*26))}${String.fromCharCode(65+Math.floor(Math.random()*26))}${Math.floor(Math.random() * 9000) + 1000}${String.fromCharCode(65+Math.floor(Math.random()*26))}`,
            status: Math.random() > 0.1 ? 'Active' : 'Inactive',
            rank: desig,
            shift: Math.random() > 0.5 ? 'Day' : 'Night'
        });
    }

    const attendanceLogs = [];
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    employees.forEach(emp => {
        if(emp.status !== 'Active') return;

        for (let d = 1; d <= daysInMonth; d++) {
            // Skip future dates
            if (d > today.getDate()) continue;

            const dateStr = `${(d).toString().padStart(2, '0')}/${(currentMonth + 1).toString().padStart(2, '0')}/${currentYear}`;

            // Randomly assign Present (85%), Absent (10%), Leave (5%)
            const rand = Math.random();
            let status = 'Present';
            if (rand > 0.95) status = 'Leave';
            else if (rand > 0.85) status = 'Absent';

            let checkIn = null;
            let checkOut = null;
            let location = null;
            let isLate = false;

            if (status === 'Present') {
                const inHour = 8 + Math.floor(Math.random() * 3); // 8, 9, or 10
                const inMin = Math.floor(Math.random() * 60);
                isLate = (inHour >= 9 && inMin > 0);

                checkIn = `${inHour.toString().padStart(2, '0')}:${inMin.toString().padStart(2, '0')} AM`;

                // 90% chance to have checked out if it's not today, or if they checked in early today
                if (d < today.getDate() || Math.random() > 0.5) {
                    const outHour = 17 + Math.floor(Math.random() * 3); // 5 PM - 7 PM
                    const outMin = Math.floor(Math.random() * 60);
                    checkOut = `${(outHour-12).toString().padStart(2, '0')}:${outMin.toString().padStart(2, '0')} PM`;
                }

                location = `Gate ${Math.floor(Math.random() * 4) + 1}`;

                // Add structured logs for newer admin dashboard style if needed
                attendanceLogs.push({
                    id: `LOG-${Math.floor(Math.random()*100000)}`,
                    userId: emp.id,
                    type: 'Check In',
                    timestamp: new Date(currentYear, currentMonth, d, inHour, inMin).toISOString(),
                    location: { lat: 12.9716 + (Math.random()*0.01), lng: 77.5946 + (Math.random()*0.01), address: location }
                });

                if(checkOut) {
                    attendanceLogs.push({
                        id: `LOG-${Math.floor(Math.random()*100000)}`,
                        userId: emp.id,
                        type: 'Check Out',
                        timestamp: new Date(currentYear, currentMonth, d, parseInt(checkOut.split(':')[0])+12, parseInt(checkOut.split(':')[1])).toISOString(),
                        location: { lat: 12.9716, lng: 77.5946, address: location }
                    });
                }
            }

            // Push to legacy attendance array for js/engine.js support
            attendanceLogs.push({
                empId: emp.id,
                name: emp.name,
                date: dateStr,
                status: status,
                checkIn: checkIn,
                checkOut: checkOut,
                location: location,
                isLate: isLate
            });
        }
    });

    return { employees, attendanceLogs };
};

const data = generateMockData();
fs.writeFileSync('mockData.json', JSON.stringify(data, null, 2));
console.log("Mock data generated in mockData.json");
