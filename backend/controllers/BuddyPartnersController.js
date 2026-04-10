const { db, promisePool } = require('../config/db');
const PDFDocument = require("pdfkit"); // o "pdfkit-table" si planeas hacer tablas
const ExcelJS = require('exceljs');
const moment = require('moment');
const path = require('path');
const fs = require('fs');
// ========================
// 📦 Obtener todos los registros (GET /buddypartner)
// ========================
exports.GetBuddyPartner = async (req, res) => {
    try {
        const [results] = await promisePool.query("SELECT *, DATE(Fecha) AS fecha_sola FROM buddy");
        const hoy = moment().format("YYYY-MM-DD");

        const data = results.map(r => {
            const etapa = r.Est_etapa?.toLowerCase();
            const fechaRegistro = moment(r.fecha_sola).format("YYYY-MM-DD");

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
    } catch (error) {
        console.error("Error al consultar registros de Buddy Partner:", error);
        return res.status(500).json({ message: "Error al obtener Buddy Partners" });
    }
};

// ========================
// ➕ Crear nuevo registro (POST /buddypartner)
// ========================
exports.BuddyPartner = async (req, res) => {
    try {
        const {
            num_cuadrilla, Hora_buddy, Est_empl, Est_vehi,
            Fecha, Est_etapa, Est_her, Tipo, id_empleado,
            MotivoEmp, MotivoVeh, MotivoHer,
            Carnet = null,
            TarjetaVida = null,
            Tablero = null,
            Calentamiento = null,
        } = req.body;

        if (!num_cuadrilla || !Hora_buddy || !Est_empl || !Est_vehi ||
            !Fecha || !Est_etapa || !Est_her || !id_empleado || !Tipo) {
            return res.status(400).json({ message: "Faltan campos obligatorios" });
        }

        const values = {
            num_cuadrilla, Hora_buddy, Est_empl, Est_vehi,
            Carnet, TarjetaVida, Fecha, Est_etapa, Est_her,
            MotivoEmp, MotivoVeh, MotivoHer,
            Tablero, Calentamiento, Tipo, id_empleado
        };

        await promisePool.query("INSERT INTO buddy SET ?", values);
        return res.status(200).json({ message: `BuddyPartner #${Tipo} registrado correctamente` });

    } catch (error) {
        console.error("Error al registrar Buddy Partner:", error);
        return res.status(500).json({ message: "Error al registrar" });
    }
};

// ========================
// 🔍 Verificar duplicados (GET /check-duplicate)
// ========================
exports.CheckDuplicate = async (req, res) => {
    try {
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

        const [result] = await promisePool.query(sql, [id_empleado, fecha, tipo]);
        const row = result[0];
        const exists = row.count > 0;

        return res.json({
            exists,
            registro: exists ? {
                num_cuadrilla: row.num_cuadrilla || "—",
                Hora_buddy: row.hora_buddy || "—",
                Est_etapa: row.est_etapa || "—"
            } : null
        });
    } catch (error) {
        console.error("Error en CheckDuplicate:", error);
        return res.status(500).json({ exists: false });
    }
};

// ========================
// 📝 Actualizar registro (PUT /buddypartner/:id)
// ========================
exports.EditBuddyPartner = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        await promisePool.query("UPDATE buddy SET ? WHERE id_buddy1 = ?", [data, id]);
        return res.status(200).json({ message: "Actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar:", error);
        return res.status(500).json({ message: "Error al actualizar" });
    }
};

// ========================
// 🗑️ Eliminar registro (DELETE /buddypartner/:id)
// ========================
exports.DeleteBuddyPartner = async (req, res) => {
    try {
        const { id } = req.params;
        await promisePool.query("DELETE FROM buddy WHERE id_buddy1 = ?", [id]);
        return res.status(200).json({ message: "Eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar:", error);
        return res.status(500).json({ message: "Error al eliminar" });
    }
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

        console.log(` → PDF final con ${jornadas.length} jornadas`);

        if (jornadas.length === 0) {
            return res.status(404).json({ message: "No hay jornadas que coincidan con el filtro" });
        }

        // ====================== CREACIÓN DEL PDF ======================
        const doc = new PDFDocument({
            margin: 60,
            size: 'A4',
            layout: 'portrait'
        });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=Reporte_BuddyPartners_${moment().format("YYYYMMDD_HHmm")}.pdf`);

        doc.pipe(res);

        // ====================== AGREGAR LOGO EN ESQUINA SUPERIOR DERECHA ======================
        const logoPath = path.resolve(__dirname, '../../frontend/src/assets/img/Logo.jpeg');
        let logoBuffer = null;
        try {
            if (fs.existsSync(logoPath)) {
                logoBuffer = fs.readFileSync(logoPath);
            } else {
                console.error("❌ No se encontró el logo en la ruta:", logoPath);
            }
        } catch (error) {
            console.error("❌ Error al leer el archivo del logo:", error.message);
        }

        const logoWidth = 130;   // Ancho del logo
        const logoHeight = 65;   // Alto del logo (mantén proporción aproximada)

        // Insertar logo en la esquina superior derecha
        if (logoBuffer) {
            try {
                doc.image(logoBuffer, doc.page.width - logoWidth - 45, 35, {
                    width: logoWidth,
                    height: logoHeight,
                    align: 'right'
                });
            } catch (err) {
                console.error("❌ Error insertando logo en la primera página:", err.message);
            }
        }

        // ====================== TÍTULO ======================
        doc.fontSize(26)
            .fillColor('#1a3c6d')
            .font('Helvetica-Bold')
            .text('Reporte de Buddy Partners', {
                align: 'center',
                y: 45   // Ajustado para que no se superponga con el logo
            });

        // Subtítulo con fecha y cantidad de jornadas
        doc.moveDown(0.8);
        doc.fontSize(12)
            .fillColor('#555')
            .text(`Generado el ${moment().format('DD/MM/YYYY')} a las ${moment().format('HH:mm')} • ${jornadas.length} jornadas`,
                { align: 'center' });

        doc.moveDown(2);

        // ====================== CONTENIDO DE LAS JORNADAS ======================
        jornadas.forEach((jornada, index) => {
            if (index > 0) {
                doc.addPage();

                // Volver a poner el logo en las páginas siguientes
                if (logoBuffer) {
                    try {
                        doc.image(logoBuffer, doc.page.width - logoWidth - 45, 35, {
                            width: logoWidth,
                            height: logoHeight,
                            align: 'right'
                        });
                    } catch (err) {
                        console.error("❌ Error insertando logo en página extra:", err.message);
                    }
                }

                // Título en páginas siguientes
                doc.fontSize(26)
                    .fillColor('#1a3c6d')
                    .font('Helvetica-Bold')
                    .text('Reporte de Buddy Partners', {
                        align: 'center',
                        y: 45
                    });

                doc.moveDown(0.8);
                doc.fontSize(12)
                    .fillColor('#555')
                    .text(`Generado el ${moment().format('DD/MM/YYYY')} a las ${moment().format('HH:mm')} • ${jornadas.length} jornadas`,
                        { align: 'center' });

                doc.moveDown(2);
            }

            // Información de la jornada
            doc.fontSize(18)
                .fillColor('#004080')
                .font('Helvetica-Bold')
                .text(`Jornada: Cuadrilla ${jornada.num_cuadrilla} - ${jornada.Fecha} - Empleado ${jornada.id_empleado}`);

            doc.moveDown(0.5);
            doc.fontSize(12)
                .fillColor('#444')
                .text(`Hora: ${jornada.Hora_buddy || '—'}`);

            doc.moveDown(0.8);
            doc.fontSize(14)
                .fillColor(jornada.estadoGeneral === 'Completado' ? '#2e7d32' : '#c62828')
                .text(`Estado General: ${jornada.estadoGeneral}`);

            doc.moveDown(1.2);

            // Línea separadora
            doc.moveTo(60, doc.y).lineTo(540, doc.y).lineWidth(1).stroke('#cccccc');
            doc.moveDown(1);

            // Detalles de las fases
            doc.fontSize(15)
                .fillColor('#004080')
                .font('Helvetica-Bold')
                .text('Detalles de las fases registradas');

            doc.moveDown(1);

            const fases = [
                { nombre: 'Inicio (Buddy Partner 1)', tipo: 1, color: '#1976d2' },
                { nombre: 'En proceso (Buddy Partner 2)', tipo: 2, color: '#0288d1' },
                { nombre: 'Finalizó (Buddy Partner 3)', tipo: 3, color: '#01579b' }
            ];

            fases.forEach(fase => {
                const etapa = jornada.etapas.find(e => e.Tipo === fase.tipo);
                if (!etapa) return;

                doc.fontSize(13)
                    .fillColor(fase.color)
                    .font('Helvetica-Bold')
                    .text(fase.nombre);

                doc.moveDown(0.4);
                doc.fontSize(11)
                    .fillColor('#333')
                    .font('Helvetica')
                    .text(` Empleado: ${etapa.Est_empl || '—'}`)
                    .text(` Vehículo: ${etapa.Est_vehi || '—'}`)
                    .text(` Herramienta: ${etapa.Est_her || '—'}`);

                doc.moveDown(0.3);
                doc.text(' Motivos:');

                const motivos = [];
                if (etapa.MotivoEmp) motivos.push(`Empleado: ${etapa.MotivoEmp}`);
                if (etapa.MotivoVeh) motivos.push(`Vehículo: ${etapa.MotivoVeh}`);
                if (etapa.MotivoHer) motivos.push(`Herramienta: ${etapa.MotivoHer}`);

                if (motivos.length > 0) {
                    motivos.forEach(m => doc.text(` • ${m}`));
                } else {
                    doc.text(' —');
                }

                doc.moveDown(0.5);
                doc.fontSize(11).fillColor('#0066cc');

                if (fase.tipo === 1) {
                    if (etapa.Carnet) doc.text(' Carnet: ', { continued: true }).text('ver imagen', { link: etapa.Carnet, underline: true });
                    if (etapa.TarjetaVida) doc.text(' Tarjeta Vida: ', { continued: true }).text('ver imagen', { link: etapa.TarjetaVida, underline: true });
                } else if (fase.tipo === 2) {
                    if (etapa.Tablero) doc.text(' Tablero: ', { continued: true }).text('ver imagen', { link: etapa.Tablero, underline: true });
                    if (etapa.Calentamiento) doc.text(' Calentamiento: ', { continued: true }).text('ver imagen', { link: etapa.Calentamiento, underline: true });
                }

                doc.moveDown(1.5);
            });

            // Línea separadora entre jornadas (excepto la última)
            if (index < jornadas.length - 1) {
                doc.moveDown(0.5);
                doc.moveTo(60, doc.y).lineTo(540, doc.y).lineWidth(1).stroke('#dddddd');
                doc.moveDown(1);
            }
        });

        // Pie de página
        doc.fontSize(10)
            .fillColor('#777777')
            .text(`Página ${doc.bufferedPageRange().count} • Generado por Buddy Partners`,
                60, doc.page.height - 50, { align: 'center' });

        doc.end();
    });
};

// ========================
// 📊 Exportar Excel MEJORADO
// ========================
exports.ExportExcel = async (req, res) => {
    try {
        const filters = req.query;
        let sql = "SELECT * FROM buddy WHERE 1=1";
        const params = [];

        if (filters.Est_empl) { sql += " AND Est_empl = ?"; params.push(filters.Est_empl); }
        if (filters.Est_vehi) { sql += " AND Est_vehi = ?"; params.push(filters.Est_vehi); }
        if (filters.Fecha) { sql += " AND DATE(Fecha) = ?"; params.push(filters.Fecha); }
        if (filters.num_cuadrilla) { sql += " AND num_cuadrilla = ?"; params.push(filters.num_cuadrilla); }

        const [results] = await promisePool.query(sql, params);

        if (results.length === 0) {
            return res.status(404).json({ message: "No hay datos para los filtros aplicados" });
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Reporte Buddy Partners");

        worksheet.columns = [
            { header: "Cuadrilla", key: "cuadrilla", width: 12 },
            { header: "Fecha", key: "fecha", width: 15 },
            { header: "Hora", key: "hora", width: 12 },
            { header: "Empleado", key: "empleado", width: 15 },
            { header: "Tipo", key: "tipo", width: 10 },
            { header: "Estado Emp.", key: "est_empl", width: 15 },
            { header: "Estado Vehi.", key: "est_vehi", width: 15 },
            { header: "Estado Her.", key: "est_her", width: 15 },
            { header: "Motivos", key: "motivos", width: 40 },
            { header: "Evidencia 1", key: "img1", width: 30 },
            { header: "Evidencia 2", key: "img2", width: 30 }
        ];

        // Estilo Header
        worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
        worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1a3c6d' } };
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

        results.forEach(item => {
            const row = worksheet.addRow({
                cuadrilla: item.num_cuadrilla,
                fecha: moment(item.Fecha).format('DD/MM/YYYY'),
                hora: item.Hora_buddy,
                empleado: item.id_empleado,
                tipo: `BP ${item.Tipo}`,
                est_empl: item.Est_empl,
                est_vehi: item.Est_vehi,
                est_her: item.Est_her,
                motivos: [item.MotivoEmp, item.MotivoVeh, item.MotivoHer].filter(Boolean).join(" | "),
            });

            // Agregar links de imágenes si existen
            const img1 = item.Carnet || item.Tablero;
            const img2 = item.TarjetaVida || item.Calentamiento;

            if (img1) {
                row.getCell('img1').value = { text: 'Ver Imagen 1', hyperlink: img1 };
                row.getCell('img1').font = { color: { argb: '0000FF' }, underline: true };
            }
            if (img2) {
                row.getCell('img2').value = { text: 'Ver Imagen 2', hyperlink: img2 };
                row.getCell('img2').font = { color: { argb: '0000FF' }, underline: true };
            }
        });

        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename=Reporte_Lidar_${moment().format("YYYYMMDD")}.xlsx`);

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error("Error en ExportExcel:", error);
        return res.status(500).send("Error al generar Excel");
    }
};

// ========================
// ⏳ Pendientes por usuario
// ========================
exports.GetPendingByUser = async (req, res) => {
    try {
        const { id } = req.params;
        const hoy = moment().format("YYYY-MM-DD");

        const sql = `
            SELECT Tipo AS tipo, Est_etapa AS estado, DATE(Fecha) AS fecha
            FROM buddy
            WHERE id_empleado = ?
            AND (Est_etapa = 'Inicio' OR Est_etapa = 'En proceso')
            AND DATE(Fecha) < ?
            ORDER BY Tipo ASC
        `;

        const [results] = await promisePool.query(sql, [id, hoy]);
        return res.status(200).json(results);
    } catch (error) {
        console.error("Error al obtener pendientes:", error);
        return res.status(500).json({ message: "Error al obtener pendientes" });
    }
};
