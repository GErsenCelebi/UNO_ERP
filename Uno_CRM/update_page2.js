const fs = require('fs');
let content = fs.readFileSync('C:/Ersen/Projects_2025/Uno_ERP/Uno_CRM/src/app/master-data/page.tsx', 'utf8');

const startString = "const tourRows = sheetToRows(wb, 'Tours');";
let startIndex = content.indexOf(startString);
if (startIndex !== -1) {
    // Go back to the preceding comment line
    startIndex = content.lastIndexOf('//', startIndex);
}

const endString = "if (counts.Bookings) addLog(";
let endIndex = content.indexOf(endString);
if (endIndex !== -1) {
    // Find the end of the statement
    endIndex = content.indexOf(');', endIndex) + 2;
}

if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
    content = content.substring(0, startIndex) + content.substring(endIndex);
    
    // Also remove the log statement before it: addLog(`\n🎉 Master data imported. Now importing projects & tours...`, 'info');
    // because I replaced it in the first script, it might be: addLog(`\n🎉 Master data import complete!`, 'ok');
    
    fs.writeFileSync('C:/Ersen/Projects_2025/Uno_ERP/Uno_CRM/src/app/master-data/page.tsx', content);
    console.log('Removed Tours, TourServices, Bookings');
} else {
    console.log('Could not find slice indices', startIndex, endIndex);
}
