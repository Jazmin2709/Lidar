const db = require('../config/db');
const PDFDocument = require("pdfkit-table");

// ========================
// Obtener todos los registros
// ========================
exports.GetBuddyPartner = (req, res) => {
    db.query("SELECT * FROM buddy", (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: "Error al obtener BuddyPartners1" });
        }
        return res.status(200).json(results);
    });
};

// ========================
// Crear nuevo registro
// ========================
exports.BuddyPartner = (req, res) => {
    const {
        num_cuadrilla, Hora_buddy, Est_empl, Est_vehi, Carnet, TarjetaVida,
        Fecha, Est_etapa, Est_her, Tablero, Calentamiento, Tipo, id_empleado
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
// Exportar PDF con estilos mejorados
// ========================
exports.ExportPDF = (req, res) => {
    db.query("SELECT * FROM buddy", (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error al generar PDF");
        }

        const doc = new PDFDocument({ margin: 30, size: "A4", layout: "landscape" });
        res.setHeader("Content-Disposition", "attachment; filename=Reporte_BuddyPartners.pdf");
        res.setHeader("Content-Type", "application/pdf");
        doc.pipe(res);

        // Encabezado
        doc.fontSize(20).fillColor("#1f4e79").text("Reporte de Buddy Partners", { align: "center" });
        doc.moveDown(2);

        // Definir tabla
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

        // Dibujar barra de degradado en el encabezado
        const tableTop = 100;
        const tableWidth = 780;
        const headerHeight = 25;

        const gradient = doc.linearGradient(30, tableTop, tableWidth, tableTop);
        gradient.stop(0, "#1e3c72");   // azul oscuro
        gradient.stop(1, "#2a5298");   // azul claro

        doc.rect(30, tableTop, tableWidth, headerHeight).fill(gradient);

        // Renderizar tabla con colores
        doc.table(table, {
            prepareHeader: () => {
                doc.fontSize(10).fillColor("white").font("Helvetica-Bold");
            },
            prepareHeaderOptions: () => {
                return { fill: null, textColor: "white" }; // usamos el degradado que ya pintamos
            },
            prepareRow: (row, iCol, iRow) => {
                doc.fontSize(9).font("Helvetica");

                // Estados coloreados
                if (iCol === 3 || iCol === 4 || iCol === 9) {
                    if (row[iCol] === "Excelente") doc.fillColor("#2e7d32").font("Helvetica-Bold");
                    if (row[iCol] === "Malo") doc.fillColor("#c62828").font("Helvetica-Bold");
                } else if (iCol === 8) {
                    if (row[iCol] === "Finalizó") doc.fillColor("#ef6c00").font("Helvetica-Bold");
                    if (row[iCol] === "Inicio") doc.fillColor("#1565c0").font("Helvetica-Bold");
                } else {
                    doc.fillColor("black");
                }
            },
            prepareRowOptions: (row, iRow) => {
                return {
                    fill: iRow % 2 === 0 ? "#f9f9f9" : "white",
                    textColor: "black"
                };
            },
            // Ajustamos tamaños (más espacio en "Tipo")
            columnsSize: [35, 70, 70, 110, 110, 55, 80, 80, 90, 110, 80, 70],
            x: 30,
            y: 100,
            padding: 6
        });

        // Pie de página
        doc.moveDown(2);
        doc.fontSize(8).fillColor("gray")
            .text(`Generado el: ${new Date().toLocaleDateString()}`, { align: "right" });

        doc.end();
    });
};

