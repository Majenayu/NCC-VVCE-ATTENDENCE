const express = require("express");
const mongoose = require("mongoose");
const xlsx = require("xlsx");
const { Cadet, Attendance } = require("./model");
const { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, WidthType } = require("docx");

const router = express.Router();

// Route to fetch all cadets
router.get("/get-cadets", async (req, res) => {
    try {
        const cadets = await Cadet.find();
        res.json(cadets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to add a new cadet
router.post("/add-cadets", async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        const { name, regNo } = req.body;
        
        if (!name || !regNo) return res.status(400).send("Missing fields");
        
        const newCadet = new Cadet({ name, regNo });
        await newCadet.save();

        res.status(201).json({ message: "Cadet added successfully" });
    } catch (err) {
        console.error("Error adding cadet:", err);
        res.status(500).json({ error: err.message });
    }
});



// Remove Cadet
router.delete("/remove-cadets/:id", async (req, res) => {
    try {
        console.log("Deleting Cadet ID:", req.params.id);
        await Cadet.findByIdAndDelete(req.params.id);
        res.json({ message: "Cadet removed successfully" });
    } catch (error) {
        console.error("Error removing cadet:", error);
        res.status(500).json({ message: "Error removing cadet" });
    }
});




// ✅ Route to add attendance
router.post("/add-attendances", async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        const { date, attendanceData } = req.body;

        if (!date || !attendanceData) return res.status(400).send("Missing fields");

        const regNos = attendanceData.map(cadet => cadet.regNo);
        const existingCadets = await Cadet.find({ regNo: { $in: regNos } });

        console.log("Existing Cadets:", existingCadets);

        if (existingCadets.length !== regNos.length) {
            return res.status(400).send("Some cadets do not exist in the database");
        }

        let existingRecord = await Attendance.findOne({ date });

        if (existingRecord) {
            attendanceData.forEach(newCadet => {
                let existingCadet = existingRecord.cadets.find(c => c.regNo === newCadet.regNo);
                if (existingCadet) {
                    existingCadet.status = newCadet.status;
                } else {
                    existingRecord.cadets.push(newCadet);
                }
            });

            await existingRecord.save();
        } else {
            await new Attendance({ date, cadets: attendanceData }).save();
        }

        res.json({ message: "Attendance recorded successfully" });
    } catch (err) {
        console.error("Error adding attendance:", err);
        res.status(500).send("Error adding attendance");
    }
});


// Get Attendance Status for a Date Range
router.post("/get-attendances", async (req, res) => {
    try {
        let { startDate, endDate } = req.body;
        if (!startDate || !endDate) return res.status(400).send("Missing date range");

        startDate = new Date(startDate);
        endDate = new Date(endDate);

        const records = await Attendance.find({
            date: { $gte: startDate, $lte: endDate },
        });

        if (!records.length) {
            return res.status(404).json({ message: "No attendance records found for this range" });
        }

        let attendanceSummary = {};

        // Loop through each attendance record
        records.forEach(record => {
            record.cadets.forEach(cadet => {
                if (!attendanceSummary[cadet.regNo]) {
                    attendanceSummary[cadet.regNo] = { present: 0, absent: 0, neutral: 0 };
                }
                if (cadet.status === "✅" || cadet.status === "present") {
                    attendanceSummary[cadet.regNo].present += 1;
                } else if (cadet.status === "❌" || cadet.status === "absent") {
                    attendanceSummary[cadet.regNo].absent += 1;
                } else {
                    attendanceSummary[cadet.regNo].neutral += 1;
                }
            });
        });

        res.json(attendanceSummary);
    } catch (err) {
        console.error("Error fetching attendance:", err);
        res.status(500).send("Error fetching attendance");
    }
});



// Download Attendance Report
// ✅ Download Attendance Report





router.get("/download-attendances", async (req, res) => {
    try {
        const { startDate, endDate, format } = req.query;
        if (!startDate || !endDate || !format) return res.status(400).send("Missing parameters");

        // Fetch attendance records from MongoDB
        const records = await Attendance.find({
            date: { $gte: new Date(startDate), $lte: new Date(endDate) },
        });

        if (records.length === 0) {
            return res.status(404).send("No attendance records found.");
        }

        let cadetMap = new Map();
        let allDates = new Set();

        // Process attendance records
        for (let record of records) {
            let dateStr = record.date.toISOString().split("T")[0];
            allDates.add(dateStr);

            for (let cadet of record.cadets) {
                if (!cadetMap.has(cadet.regNo)) {
                    // Fetch cadet name only once to optimize DB calls
                    const cadetInfo = await Cadet.findOne({ regNo: cadet.regNo });
                    cadetMap.set(cadet.regNo, {
                        name: cadetInfo?.name || "Unknown",
                        attendance: {},
                        totalPresent: 0,
                        totalAttendanceTaken: 0,
                    });
                }

                let cadetData = cadetMap.get(cadet.regNo);
                cadetData.totalAttendanceTaken++;

                // Update attendance count
                if (cadet.status === "✅" || cadet.status.toLowerCase() === "present") {
                    let lastCount = cadetData.attendance[dateStr] ?? cadetData.totalPresent;
                    cadetData.attendance[dateStr] = lastCount + 1;
                    cadetData.totalPresent++;
                } else {
                    cadetData.attendance[dateStr] = "-"; // Mark as absent
                }
            }
        }

        let sortedDates = Array.from(allDates).sort();

        if (format === "word") {
            // Create a Word Document
            const doc = new Document({
                sections: [{
                    properties: {},
                    children: [
                        new Paragraph({
                            children: [new TextRun({ text: "Attendance Report", bold: true, size: 32 })],
                            alignment: "center",
                            spacing: { after: 300 },
                        }),
                        new Table({
                            rows: [
                                // Header row
                                new TableRow({
                                    children: [
                                        new TableCell({ children: [new Paragraph("Reg No")], width: { size: 10, type: WidthType.PERCENTAGE } }),
                                        new TableCell({ children: [new Paragraph("Name")], width: { size: 20, type: WidthType.PERCENTAGE } }),
                                        ...sortedDates.map(date => new TableCell({ children: [new Paragraph(date)], width: { size: 15, type: WidthType.PERCENTAGE } })),
                                        new TableCell({ children: [new Paragraph("Total Attendance Taken")], width: { size: 20, type: WidthType.PERCENTAGE } }),
                                        new TableCell({ children: [new Paragraph("Total Present")], width: { size: 20, type: WidthType.PERCENTAGE } }),
                                    ],
                                }),
                                // Cadet rows
                                ...Array.from(cadetMap).map(([regNo, cadet]) => new TableRow({
                                    children: [
                                        new TableCell({ children: [new Paragraph(regNo)] }),
                                        new TableCell({ children: [new Paragraph(cadet.name)] }),
                                        ...sortedDates.map(date => new TableCell({ children: [new Paragraph(cadet.attendance[date]?.toString() || "-")] })),
                                        new TableCell({ children: [new Paragraph(cadet.totalAttendanceTaken.toString())] }),
                                        new TableCell({ children: [new Paragraph(cadet.totalPresent.toString())] }),
                                    ],
                                })),
                            ],
                        }),
                    ],
                }],
            });

            const buffer = await Packer.toBuffer(doc);
            res.setHeader("Content-Disposition", 'attachment; filename="attendance.docx"');
            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
            res.end(buffer);

        } else if (format === "excel") {
            // Prepare Excel data
            const rows = [["Reg No", "Name", ...sortedDates, "Total Attendance Taken", "Total Present"]];

            cadetMap.forEach((cadet, regNo) => {
                let row = [regNo, cadet.name];
                let cumulativeCount = 0;

                sortedDates.forEach(date => {
                    if (cadet.attendance[date] !== "-") {
                        cumulativeCount = cadet.attendance[date]; // Keep latest cumulative count
                        row.push(cumulativeCount);
                    } else {
                        row.push("-"); // Mark absent
                    }
                });

                row.push(cadet.totalAttendanceTaken);
                row.push(cadet.totalPresent);
                rows.push(row);
            });

            const ws = xlsx.utils.aoa_to_sheet(rows);
            const wb = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(wb, ws, "Attendance");

            const buffer = xlsx.write(wb, { bookType: "xlsx", type: "buffer" });

            res.setHeader("Content-Disposition", 'attachment; filename="attendance.xlsx"');
            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.end(buffer);

        } else {
            res.status(400).send("Invalid format requested");
        }
    } catch (err) {
        console.error("Error generating report:", err);
        res.status(500).send("Error generating report");
    }
});




module.exports = router;
