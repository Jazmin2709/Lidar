const db = require('../config/db');
const PDFDocument = require("pdfkit-table");

// ========================
// Obtener todos los registros
// ========================
exports.GetBuddyPartner = (req, res) => {
    db.query("SELECT *, DATE(Fecha) AS fecha_sola FROM buddy", (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: "Error al obtener BuddyPartners1" });
        }

        const hoy = new Date().toISOString().split("T")[0];

        const data = results.map(r => {
            const etapa = r.Est_etapa?.toLowerCase();
            const fechaRegistro = r.fecha_sola;

            const esPendiente =
                (r.Tipo === 1 || r.Tipo === 2) &&
                (etapa === "inicio" || etapa === "en proceso") &&
                fechaRegistro < hoy; // si la fecha es menor → es otro día

            return {
                ...r,
                pendiente: esPendiente
            };
        });

        return res.status(200).json(data);
    });
};


// ========================
// Crear nuevo registro
// ========================
exports.BuddyPartner = (req, res) => {
    const {
        num_cuadrilla, Hora_buddy, Est_empl, Est_vehi, Carnet, TarjetaVida,
        Fecha, Est_etapa, Est_her, Tablero, Calentamiento, Tipo, id_empleado,
        // ✅ CAMPOS FALTANTES AGREGADOS
        MotivoEmp, MotivoVeh, MotivoHer
    } = req.body;

    if (!num_cuadrilla || !Hora_buddy || !Est_empl || !Est_vehi ||
        Carnet === undefined || TarjetaVida === undefined ||
        !Fecha || !Est_etapa || !Est_her || !id_empleado || !Tipo) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const carnetValue = Carnet === "1" || Carnet === 1 ? 1 : 0;
    const tarjetaVidaValue = TarjetaVida === "1" || TarjetaVida === 1 ? 1 : 0;

    const values = {
        num_cuadrilla,
        Hora_buddy,
        Est_empl,
        Est_vehi,
        Carnet: carnetValue,
        TarjetaVida: tarjetaVidaValue,
        Fecha,
        Est_etapa,
        Est_her,
        // ✅ MOTIVOS AGREGADOS AL OBJETO DE INSERCIÓN
        MotivoEmp,
        MotivoVeh,
        MotivoHer,
        Tablero: Tablero || null,
        Calentamiento: Calentamiento || null,
        Tipo,
        id_empleado
    };

    db.query("INSERT INTO buddy SET ?", values, (error) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: "Error al registrar BuddyPartners1" });
        }
        return res.status(200).json({ message: `BuddyPartner #${Tipo} en cuadrilla ${num_cuadrilla} registrado correctamente` });
    });
};

// ========================
// Actualizar un registro existente
// ========================
exports.EditBuddyPartner = (req, res) => {
    const { id } = req.params;
    const data = req.body;

    if (data.Carnet !== undefined) {
        data.Carnet = data.Carnet === "1" || data.Carnet === 1 ? 1 : 0;
    }
    if (data.TarjetaVida !== undefined) {
        data.TarjetaVida = data.TarjetaVida === "1" || data.TarjetaVida === 1 ? 1 : 0;
    }

    db.query("UPDATE buddy SET ? WHERE id_buddy1 = ?", [data, id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error al actualizar el reporte" });
        }
        return res.status(200).json({ message: "Reporte actualizado correctamente" });
    });
};

// ========================
// Eliminar un registro
// ========================
exports.DeleteBuddyPartner = (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM buddy WHERE id_buddy1 = ?", [id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error al eliminar el reporte" });
        }
        return res.status(200).json({ message: "Reporte eliminado correctamente" });
    });
};

// ========================
// Exportar PDF filtrado
// ========================
exports.ExportPDF = (req, res) => {
    const filters = req.query;
    let sql = "SELECT * FROM buddy WHERE 1=1";
    const params = [];

    // Construcción dinámica del filtro
    if (filters.Est_empl) {
        sql += " AND Est_empl = ?";
        params.push(filters.Est_empl);
    }
    if (filters.Est_vehi) {
        sql += " AND Est_vehi = ?";
        params.push(filters.Est_vehi);
    }
    if (filters.Est_etapa) {
        sql += " AND Est_etapa = ?";
        params.push(filters.Est_etapa);
    }
    if (filters.Fecha) {
        sql += " AND DATE(Fecha) = ?";
        params.push(filters.Fecha);
    }

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error al generar PDF");
        }

        const PDFDocument = require("pdfkit-table");
        const doc = new PDFDocument({ margin: 30, size: "A4", layout: "landscape" });
        res.setHeader("Content-Disposition", "attachment; filename=Reporte_BuddyPartners.pdf");
        res.setHeader("Content-Type", "application/pdf");
        doc.pipe(res);

        // ========================
        // Encabezado principal
        // ========================
        doc.fontSize(20).fillColor("#1f4e79").text("Reporte de Buddy Partners", { align: "center" });
        doc.moveDown(2);

        // ========================
        // Configurar tabla
        // ========================
        const table = {
            headers: [
                { label: "Id", align: "center" },
                { label: "Cuadrilla", align: "center" },
                { label: "Hora", align: "center" },
                { label: "Estado Empleado", align: "center" },
                { label: "Estado Vehículo", align: "center" },
                { label: "Carnet", align: "center" },
                { label: "Tarjeta Vida", align: "center" },
                { label: "Fecha", align: "center" },
                { label: "Etapa", align: "center" },
                { label: "Herramienta", align: "center" },
                { label: "Empleado", align: "center" },
                { label: "Tipo", align: "center" }
            ],
            rows: results.map((r) => [
                r.id_buddy1,
                r.num_cuadrilla,
                r.Hora_buddy,
                r.Est_empl,
                r.Est_vehi,
                r.Carnet ? "Sí" : "No",
                r.TarjetaVida ? "Sí" : "No",
                r.Fecha ? new Date(r.Fecha).toISOString().split("T")[0] : "",
                r.Est_etapa,
                r.Est_her,
                r.id_empleado,
                r.Tipo,
            ]),
        };

        // ========================
        // Dibujar fondo degradado del encabezado de la tabla
        // ========================
        const tableTop = 100;
        const tableLeft = 30;
        const tableWidth = 785;   // Ajustado al ancho total aproximado de columnas
        const headerHeight = 25;

        // Crear degradado azul
        const gradient = doc.linearGradient(tableLeft, tableTop, tableLeft + tableWidth, tableTop);
        gradient.stop(0, "#004aad");  // Azul oscuro
        gradient.stop(1, "#1e88e5");  // Azul claro

        // Dibujar rectángulo del fondo del encabezado
        doc.rect(tableLeft, tableTop, tableWidth, headerHeight).fill(gradient);

        // ========================
        // Dibujar tabla
        // ========================
        doc.table(table, {
            prepareHeader: () => doc.fontSize(10).fillColor("white").font("Helvetica-Bold"),
            prepareHeaderOptions: () => ({ fill: null }), // Evita sobreescribir el degradado
            prepareRow: (row, iCol, iRow) => {
                doc.fontSize(9).font("Helvetica");
                if (iRow % 2 === 0) doc.fillColor("black");
            },
            columnsSize: [35, 70, 70, 70, 70, 70, 70, 70, 70, 70, 59, 59],
            x: tableLeft,
            y: tableTop,
        });

        // ========================
        // Pie de página
        // ========================
        doc.moveDown(2);
        doc.fontSize(8).fillColor("gray")
            .text(`Generado el: ${new Date().toLocaleDateString()}`, { align: "right" });

        doc.end();
    });
};

// ========================
// Exportar Excel filtrado
// ========================
exports.ExportExcel = (req, res) => {
    const filters = req.query;
    let sql = "SELECT * FROM buddy WHERE 1=1";
    const params = [];

    // Filtros dinámicos
    if (filters.Est_empl) {
        sql += " AND Est_empl = ?";
        params.push(filters.Est_empl);
    }
    if (filters.Est_vehi) {
        sql += " AND Est_vehi = ?";
        params.push(filters.Est_vehi);
    }
    if (filters.Est_etapa) {
        sql += " AND Est_etapa = ?";
        params.push(filters.Est_etapa);
    }
    if (filters.Fecha) {
        sql += " AND DATE(Fecha) = ?";
        params.push(filters.Fecha);
    }

    db.query(sql, params, async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error al generar Excel");
        }

        const ExcelJS = require('exceljs');
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Reporte Buddy Partners");

        // Encabezados
        worksheet.columns = [
            { header: "Id", key: "id_buddy1", width: 10 },
            { header: "Cuadrilla", key: "num_cuadrilla", width: 15 },
            { header: "Hora", key: "Hora_buddy", width: 15 },
            { header: "Estado Empleado", key: "Est_empl", width: 20 },
            { header: "Estado Vehículo", key: "Est_vehi", width: 20 },
            { header: "Carnet", key: "Carnet", width: 10 },
            { header: "Tarjeta Vida", key: "TarjetaVida", width: 15 },
            { header: "Fecha", key: "Fecha", width: 15 },
            { header: "Etapa", key: "Est_etapa", width: 15 },
            { header: "Herramienta", key: "Est_her", width: 15 },
            { header: "Id Empleado", key: "id_empleado", width: 15 },
            { header: "Tipo", key: "Tipo", width: 10 },
        ];

        // Estilos del encabezado
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF1F4E79" }
            };
        });

        // Agregar los datos
        results.forEach((r) => {
            worksheet.addRow({
                ...r,
                Fecha: r.Fecha ? new Date(r.Fecha).toISOString().split("T")[0] : "",
                Carnet: r.Carnet ? "Sí" : "No",
                TarjetaVida: r.TarjetaVida ? "Sí" : "No",
            });
        });

        // Enviar archivo
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=Reporte_BuddyPartners.xlsx"
        );

        await workbook.xlsx.write(res);
        res.end();
    });
};

// ========================
// Obtener Buddys pendientes por usuario
// ========================
exports.GetPendingByUser = (req, res) => {
    const { id } = req.params; // id del usuario logueado

    const hoy = new Date().toISOString().split("T")[0];

    const sql = `
        SELECT 
            Tipo AS tipo, 
            Est_etapa AS estado, 
            DATE(Fecha) AS fecha
        FROM buddy
        WHERE id_empleado = ?
        AND (Est_etapa = 'Inicio' OR Est_etapa = 'En proceso')
        AND DATE(Fecha) < ?
        ORDER BY Tipo ASC
    `;

    db.query(sql, [id, hoy], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: "Error al obtener pendientes" });
        }

        return res.status(200).json(results);
    });
};