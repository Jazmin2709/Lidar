const db = require('../config/db');
const PDFDocument = require("pdfkit-table");
const moment = require('moment'); // ← IMPORTANTE: agregado aquí

// ========================
// 📦 Obtener todos los registros (GET /buddypartner)
// ========================
exports.GetBuddyPartner = (req, res) => {
    db.query("SELECT *, DATE(Fecha) AS fecha_sola FROM buddy", (error, results) => {
        if (error) {
            console.error("Error al consultar registros de Buddy Partner:", error);
            return res.status(500).json({ message: "Error al obtener Buddy Partners" });
        }

        const hoy = new Date().toISOString().split("T")[0];

        const data = results.map(r => {
            const etapa = r.Est_etapa?.toLowerCase();
            const fechaRegistro = r.fecha_sola;

            const esPendiente =
                (r.Tipo === 1 || r.Tipo === 2) &&
                (etapa === "inicio" || etapa === "en proceso") &&
                fechaRegistro < hoy;

            return {
                ...r,
                pendiente: esPendiente
            };
        });

        return res.status(200).json(data);
    });
};

// ========================
// ➕ Crear nuevo registro (POST /buddypartner)
// ========================
// ========================
// ➕ Crear nuevo registro (POST /buddypartner)
// ========================
exports.BuddyPartner = (req, res) => {
    const {
        num_cuadrilla, Hora_buddy, Est_empl, Est_vehi,
        Fecha, Est_etapa, Est_her, Tipo, id_empleado,
        MotivoEmp, MotivoVeh, MotivoHer,
        Carnet = null,
        TarjetaVida = null,
        Tablero = null,
        Calentamiento = null,
    } = req.body;

    console.log("Datos de la solicitud (req.body):", req.body);

    // Validaciones básicas (estas las mantenemos)
    if (!num_cuadrilla || !Hora_buddy || !Est_empl || !Est_vehi ||
        !Fecha || !Est_etapa || !Est_her || !id_empleado || !Tipo) {
        return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    if (Tipo === 1 && (!Carnet || !TarjetaVida)) {
        return res.status(400).json({ message: "Para Tipo 1 son obligatorias Carnet y TarjetaVida" });
    }

    // ←←← YA NO BLOQUEAMOS DUPLICADOS AQUÍ (lo maneja el frontend con alerta)

    const values = {
        num_cuadrilla,
        Hora_buddy,
        Est_empl,
        Est_vehi,
        Carnet,
        TarjetaVida,
        Fecha,
        Est_etapa,
        Est_her,
        MotivoEmp,
        MotivoVeh,
        MotivoHer,
        Tablero,
        Calentamiento,
        Tipo,
        id_empleado
    };

    db.query("INSERT INTO buddy SET ?", values, (error) => {
        if (error) {
            console.error("Error al registrar Buddy Partner:", error);
            return res.status(500).json({ message: "Error al registrar" });
        }

        return res.status(200).json({
            message: `BuddyPartner #${Tipo} registrado correctamente`
        });
    });
};
// GET /check-duplicate
exports.CheckDuplicate = (req, res) => {
    const { id_empleado, fecha, tipo } = req.query;

    if (!id_empleado || !fecha || !tipo) {
        return res.status(400).json({ exists: false, message: "Faltan parámetros" });
    }

    const sql = `
        SELECT 
            COUNT(*) as count,
            MAX(num_cuadrilla) as num_cuadrilla,          
            MAX(Hora_buddy) as hora_buddy,                
            MAX(Est_etapa) as est_etapa
        FROM buddy 
        WHERE id_empleado = ? 
        AND DATE(Fecha) = DATE(?) 
        AND Tipo = ?
        LIMIT 1
    `;

    db.query(sql, [id_empleado, fecha, tipo], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ exists: false });
        }

        const row = result[0];
        const exists = row.count > 0;

        res.json({
            exists,
            registro: exists ? {
                num_cuadrilla: row.num_cuadrilla || "—",
                Hora_buddy: row.hora_buddy || "—",
                Est_etapa: row.est_etapa || "—"
            } : null
        });
    });
};

// ========================
// 📝 Actualizar registro (PUT /buddypartner/:id)
// ========================
exports.EditBuddyPartner = (req, res) => {
    const { id } = req.params;
    const data = req.body;

    db.query("UPDATE buddy SET ? WHERE id_buddy1 = ?", [data, id], (err) => {
        if (err) {
            console.error("Error al actualizar:", err);
            return res.status(500).json({ message: "Error al actualizar" });
        }
        return res.status(200).json({ message: "Actualizado correctamente" });
    });
};

// ========================
// 🗑️ Eliminar registro (DELETE /buddypartner/:id)
// ========================
exports.DeleteBuddyPartner = (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM buddy WHERE id_buddy1 = ?", [id], (err) => {
        if (err) {
            console.error("Error al eliminar:", err);
            return res.status(500).json({ message: "Error al eliminar" });
        }
        return res.status(200).json({ message: "Eliminado correctamente" });
    });
};

// ========================
// 📄 Exportar PDF filtrado (GET /buddypartner/export/pdf)
// ========================
exports.ExportPDF = (req, res) => {
    const filters = req.query;

    console.log("🔍 Filtros recibidos para PDF:", filters);

    let sql = "SELECT * FROM buddy WHERE 1=1";
    const params = [];

    if (filters.Est_empl) { sql += " AND Est_empl = ?"; params.push(filters.Est_empl); }
    if (filters.Est_vehi) { sql += " AND Est_vehi = ?"; params.push(filters.Est_vehi); }
    if (filters.Fecha) { sql += " AND DATE(Fecha) = ?"; params.push(filters.Fecha); }
    if (filters.num_cuadrilla) { sql += " AND num_cuadrilla = ?"; params.push(filters.num_cuadrilla); }

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error("❌ Error SQL:", err);
            return res.status(500).json({ message: "Error al consultar datos" });
        }

        console.log(`✅ ${results.length} registros crudos obtenidos`);

        if (results.length === 0) {
            return res.status(404).json({ message: "No hay datos para los filtros aplicados" });
        }

        // Agrupar y calcular estado
        const grouped = {};
        results.forEach(r => {
            const key = `${r.num_cuadrilla}_${moment(r.Fecha).format('YYYY-MM-DD')}_${r.id_empleado}`;
            if (!grouped[key]) {
                grouped[key] = {
                    num_cuadrilla: r.num_cuadrilla,
                    Fecha: moment(r.Fecha).format('YYYY-MM-DD'),
                    id_empleado: r.id_empleado,
                    Hora_buddy: r.Hora_buddy,
                    etapas: []
                };
            }
            grouped[key].etapas.push(r);
        });

        let jornadas = Object.values(grouped).map(j => {
            const tieneInicio = j.etapas.some(e => e.Tipo === 1);
            const tieneProceso = j.etapas.some(e => e.Tipo === 2);
            const tieneFinalizo = j.etapas.some(e => e.Tipo === 3);

            let estadoGeneral = 'Inicio';
            if (tieneInicio && tieneProceso && tieneFinalizo) estadoGeneral = 'Completado';
            else if (tieneFinalizo) estadoGeneral = 'Finalizó';
            else if (tieneProceso) estadoGeneral = 'En proceso';

            return { ...j, estadoGeneral };
        });

        if (filters.Est_etapa) {
            jornadas = jornadas.filter(j => j.estadoGeneral === filters.Est_etapa);
        }

        console.log(`   → PDF final con ${jornadas.length} jornadas`);

        if (jornadas.length === 0) {
            return res.status(404).json({ message: "No hay jornadas que coincidan con el filtro" });
        }

        const doc = new PDFDocument({ margin: 60, size: 'A4', layout: 'portrait' });
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=Reporte_BuddyPartners_${moment().format("YYYYMMDD_HHmm")}.pdf`);

        doc.pipe(res);

        // Título
        doc.fontSize(26).fillColor('#1a3c6d').font('Helvetica-Bold').text('Reporte de Buddy Partners', { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(12).fillColor('#555').text(`Generado el ${moment().format('DD/MM/YYYY')} a las ${moment().format('HH:mm')} • ${jornadas.length} jornadas`, { align: 'center' });
        doc.moveDown(2);

        jornadas.forEach((jornada, index) => {
            if (index > 0) doc.addPage();

            doc.fontSize(18).fillColor('#004080').font('Helvetica-Bold')
                .text(`Jornada: Cuadrilla ${jornada.num_cuadrilla} - ${jornada.Fecha} - Empleado ${jornada.id_empleado}`);

            doc.moveDown(0.5);
            doc.fontSize(12).fillColor('#444').text(`Hora: ${jornada.Hora_buddy || '—'}`);
            doc.moveDown(0.8);

            doc.fontSize(14)
                .fillColor(jornada.estadoGeneral === 'Completado' ? '#2e7d32' : '#c62828')
                .text(`Estado General: ${jornada.estadoGeneral}`);

            doc.moveDown(1.2);
            doc.moveTo(60, doc.y).lineTo(540, doc.y).lineWidth(1).stroke('#cccccc');
            doc.moveDown(1);

            // Siempre mostrar detalles de fases presentes
            doc.fontSize(15).fillColor('#004080').font('Helvetica-Bold').text('Detalles de las fases registradas');
            doc.moveDown(1);

            const fases = [
                { nombre: 'Inicio (Buddy Partner 1)', tipo: 1, color: '#1976d2' },
                { nombre: 'En proceso (Buddy Partner 2)', tipo: 2, color: '#0288d1' },
                { nombre: 'Finalizó (Buddy Partner 3)', tipo: 3, color: '#01579b' }
            ];

            fases.forEach(fase => {
                const etapa = jornada.etapas.find(e => e.Tipo === fase.tipo);
                if (!etapa) return; // Saltar si la fase no existe

                doc.fontSize(13).fillColor(fase.color).font('Helvetica-Bold').text(fase.nombre);
                doc.moveDown(0.4);

                doc.fontSize(11).fillColor('#333').font('Helvetica')
                    .text(`   Empleado:     ${etapa.Est_empl || '—'}`);
                doc.text(`   Vehículo:     ${etapa.Est_vehi || '—'}`);
                doc.text(`   Herramienta:  ${etapa.Est_her || '—'}`);

                doc.moveDown(0.3);
                doc.text('   Motivos:');
                const motivos = [];
                if (etapa.MotivoEmp) motivos.push(`Empleado: ${etapa.MotivoEmp}`);
                if (etapa.MotivoVeh) motivos.push(`Vehículo: ${etapa.MotivoVeh}`);
                if (etapa.MotivoHer) motivos.push(`Herramienta: ${etapa.MotivoHer}`);

                if (motivos.length > 0) {
                    motivos.forEach(m => doc.text(`      • ${m}`));
                } else {
                    doc.text('      —');
                }

                doc.moveDown(0.5);
                doc.fontSize(11).fillColor('#0066cc');
                if (fase.tipo === 1) {
                    if (etapa.Carnet) doc.text('   Carnet: ', { continued: true }).text('ver imagen', { link: etapa.Carnet, underline: true });
                    if (etapa.TarjetaVida) doc.text('   Tarjeta Vida: ', { continued: true }).text('ver imagen', { link: etapa.TarjetaVida, underline: true });
                } else if (fase.tipo === 2) {
                    if (etapa.Tablero) doc.text('   Tablero: ', { continued: true }).text('ver imagen', { link: etapa.Tablero, underline: true });
                    if (etapa.Calentamiento) doc.text('   Calentamiento: ', { continued: true }).text('ver imagen', { link: etapa.Calentamiento, underline: true });
                }

                doc.moveDown(1.5);
            });

            if (index < jornadas.length - 1) {
                doc.moveDown(0.5);
                doc.moveTo(60, doc.y).lineTo(540, doc.y).lineWidth(1).stroke('#dddddd');
                doc.moveDown(1);
            }
        });

        // Pie de página final
        doc.fontSize(10).fillColor('#777777')
            .text(`Página ${doc.bufferedPageRange().count} • Generado por Buddy Partners`, 60, doc.page.height - 50, { align: 'center' });

        doc.end();
    });
};

// ========================
// 📊 Exportar Excel mejorado (con fases separadas y hyperlinks)
// ========================
exports.ExportExcel = (req, res) => {
    const filters = req.query;

    console.log("🔍 Filtros recibidos para Excel:", filters);

    let sql = "SELECT * FROM buddy WHERE 1=1";
    const params = [];

    if (filters.Est_empl) { sql += " AND Est_empl = ?"; params.push(filters.Est_empl); }
    if (filters.Est_vehi) { sql += " AND Est_vehi = ?"; params.push(filters.Est_vehi); }
    if (filters.Fecha) { sql += " AND DATE(Fecha) = ?"; params.push(filters.Fecha); }
    if (filters.num_cuadrilla) { sql += " AND num_cuadrilla = ?"; params.push(filters.num_cuadrilla); }

    db.query(sql, params, async (err, results) => {
        if (err) {
            console.error("Error al consultar datos para Excel:", err);
            return res.status(500).send("Error al generar Excel");
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "No hay datos para los filtros aplicados" });
        }

        // Agrupar por jornada
        const grouped = {};
        results.forEach(r => {
            const key = `${r.num_cuadrilla}_${moment(r.Fecha).format('YYYY-MM-DD')}_${r.id_empleado}`;
            if (!grouped[key]) {
                grouped[key] = {
                    num_cuadrilla: r.num_cuadrilla,
                    Fecha: moment(r.Fecha).format('YYYY-MM-DD'),
                    id_empleado: r.id_empleado,
                    Hora_buddy: r.Hora_buddy,
                    etapas: []
                };
            }
            grouped[key].etapas.push(r);
        });

        let jornadas = Object.values(grouped).map(j => {
            const tieneInicio = j.etapas.some(e => e.Tipo === 1);
            const tieneProceso = j.etapas.some(e => e.Tipo === 2);
            const tieneFinalizo = j.etapas.some(e => e.Tipo === 3);

            let estadoGeneral = 'Inicio';
            if (tieneInicio && tieneProceso && tieneFinalizo) estadoGeneral = 'Completado';
            else if (tieneFinalizo) estadoGeneral = 'Finalizó';
            else if (tieneProceso) estadoGeneral = 'En proceso';

            return { ...j, estadoGeneral };
        });

        if (filters.Est_etapa) {
            jornadas = jornadas.filter(j => j.estadoGeneral === filters.Est_etapa);
        }

        if (jornadas.length === 0) {
            return res.status(404).json({ message: "No hay jornadas que coincidan con el filtro" });
        }

        // Crear Excel
        const ExcelJS = require('exceljs');
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Reporte Buddy Partners");

        // Columnas
        worksheet.columns = [
            { header: "Cuadrilla", key: "cuadrilla", width: 12 },
            { header: "Fecha", key: "fecha", width: 15 },
            { header: "Hora", key: "hora", width: 12 },
            { header: "Empleado ID", key: "empleado", width: 12 },
            { header: "Estado General", key: "estadoGeneral", width: 18 },
            { header: "Fase", key: "fase", width: 25 },
            { header: "Estado Empleado", key: "est_empl", width: 18 },
            { header: "Estado Vehículo", key: "est_vehi", width: 18 },
            { header: "Estado Herramienta", key: "est_her", width: 18 },
            { header: "Motivos", key: "motivos", width: 60 },
            { header: "Carnet", key: "carnet", width: 20 },
            { header: "Tarjeta Vida", key: "tarjetaVida", width: 20 },
            { header: "Tablero", key: "tablero", width: 20 },
            { header: "Calentamiento", key: "calentamiento", width: 20 }
        ];

        // Estilo encabezado
        const headerRow = worksheet.getRow(1);
        headerRow.eachCell((cell) => {
            cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 12 };
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F4E79" } };
            cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
        });
        headerRow.height = 30;

        // Congelar encabezado
        worksheet.views = [{ state: 'frozen', ySplit: 1 }];

        // Llenar datos
        jornadas.forEach(jornada => {
            const fasesDisponibles = jornada.etapas.map(etapa => {
                if (etapa.Tipo === 1) return { nombre: "Inicio (Buddy Partner 1)", tipo: 1 };
                if (etapa.Tipo === 2) return { nombre: "En proceso (Buddy Partner 2)", tipo: 2 };
                if (etapa.Tipo === 3) return { nombre: "Finalizó (Buddy Partner 3)", tipo: 3 };
                return null;
            }).filter(Boolean);

            fasesDisponibles.forEach(fase => {
                const etapa = jornada.etapas.find(e => e.Tipo === fase.tipo) || {};

                let motivos = [];
                if (etapa.MotivoEmp) motivos.push(`Empleado: ${etapa.MotivoEmp}`);
                if (etapa.MotivoVeh) motivos.push(`Vehículo: ${etapa.MotivoVeh}`);
                if (etapa.MotivoHer) motivos.push(`Herramienta: ${etapa.MotivoHer}`);

                const row = worksheet.addRow({
                    cuadrilla: jornada.num_cuadrilla,
                    fecha: jornada.Fecha,
                    hora: jornada.Hora_buddy || "",
                    empleado: jornada.id_empleado,
                    estadoGeneral: jornada.estadoGeneral,
                    fase: fase.nombre,
                    est_empl: etapa.Est_empl || "",
                    est_vehi: etapa.Est_vehi || "",
                    est_her: etapa.Est_her || "",
                    motivos: motivos.length > 0 ? motivos.join("\n") : "",
                    carnet: (fase.tipo === 1 && etapa.Carnet) ? "Ver imagen" : "",
                    tarjetaVida: (fase.tipo === 1 && etapa.TarjetaVida) ? "Ver imagen" : "",
                    tablero: (fase.tipo === 2 && etapa.Tablero) ? "Ver imagen" : "",
                    calentamiento: (fase.tipo === 2 && etapa.Calentamiento) ? "Ver imagen" : ""
                });

                // Asignar hipervínculos de forma más robusta y confiable
                const rowIndex = row.number;
                const blueFont = { color: { argb: "FF0000FF" }, underline: true };

                if (fase.tipo === 1) {
                    if (etapa.Carnet) {
                        const cell = worksheet.getCell(`K${rowIndex}`);
                        cell.value = { text: 'Ver imagen', hyperlink: etapa.Carnet };
                        cell.font = blueFont;
                        cell.alignment = { horizontal: 'center', vertical: 'middle' };
                    }
                    if (etapa.TarjetaVida) {
                        const cell = worksheet.getCell(`L${rowIndex}`);
                        cell.value = { text: 'Ver imagen', hyperlink: etapa.TarjetaVida };
                        cell.font = blueFont;
                        cell.alignment = { horizontal: 'center', vertical: 'middle' };
                    }
                } else if (fase.tipo === 2) {
                    if (etapa.Tablero) {
                        const cell = worksheet.getCell(`M${rowIndex}`);
                        cell.value = { text: 'Ver imagen', hyperlink: etapa.Tablero };
                        cell.font = blueFont;
                        cell.alignment = { horizontal: 'center', vertical: 'middle' };
                    }
                    if (etapa.Calentamiento) {
                        const cell = worksheet.getCell(`N${rowIndex}`);
                        cell.value = { text: 'Ver imagen', hyperlink: etapa.Calentamiento };
                        cell.font = blueFont;
                        cell.alignment = { horizontal: 'center', vertical: 'middle' };
                    }
                }
            });

            // Espacio entre jornadas
            worksheet.addRow({}).height = 10;
        });

        // Ajuste de altura para celdas con multilínea (motivos)
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) {
                row.height = 60;
            }
        });

        // Descarga
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename=Reporte_BuddyPartners_${moment().format("YYYYMMDD_HHmm")}.xlsx`);

        await workbook.xlsx.write(res);
        res.end();
    });
};

// ========================
// ⏳ Pendientes por usuario (sin cambios)
// ========================
exports.GetPendingByUser = (req, res) => {
    const { id } = req.params;
    const hoy = new Date().toISOString().split("T")[0];

    const sql = `
        SELECT Tipo AS tipo, Est_etapa AS estado, DATE(Fecha) AS fecha
        FROM buddy
        WHERE id_empleado = ?
        AND (Est_etapa = 'Inicio' OR Est_etapa = 'En proceso')
        AND DATE(Fecha) < ?
        ORDER BY Tipo ASC
    `;

    db.query(sql, [id, hoy], (error, results) => {
        if (error) {
            console.error("Error al obtener pendientes:", error);
            return res.status(500).json({ message: "Error al obtener pendientes" });
        }
        return res.status(200).json(results);
    });
};