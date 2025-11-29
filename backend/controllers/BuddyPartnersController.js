const db = require('../config/db');
// Se importa la librería para la generación de PDFs con tablas
const PDFDocument = require("pdfkit-table");
// Nota: La librería 'exceljs' se importa localmente en exports.ExportExcel para evitar errores si no se usa.

// ========================
// 📦 Obtener todos los registros (GET /buddypartner)
// ========================
/**
 * Obtiene todos los registros de Buddy Partners y calcula un indicador de "pendiente"
 * para aquellos registros Tipo 1 o 2 en etapa 'inicio'/'en proceso' de días anteriores.
 */
exports.GetBuddyPartner = (req, res) => {
    // Consulta la base de datos, extrayendo la fecha sin la hora para la lógica de "pendiente"
    db.query("SELECT *, DATE(Fecha) AS fecha_sola FROM buddy", (error, results) => {
        if (error) {
            console.error("Error al consultar registros de Buddy Partner:", error);
            return res.status(500).json({ message: "Error al obtener Buddy Partners" });
        }

        const hoy = new Date().toISOString().split("T")[0]; // Fecha actual en formato YYYY-MM-DD

        const data = results.map(r => {
            const etapa = r.Est_etapa?.toLowerCase();
            const fechaRegistro = r.fecha_sola;

            // Lógica para determinar si un registro está 'pendiente'
            const esPendiente =
                // Aplica para el Tipo 1 o Tipo 2
                (r.Tipo === 1 || r.Tipo === 2) &&
                // Debe estar en etapa de 'inicio' o 'en proceso'
                (etapa === "inicio" || etapa === "en proceso") &&
                // Debe ser un registro de un día ANTERIOR al actual
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
/**
 * Crea un nuevo registro de Buddy Partner en la base de datos.
 * Carnet y TarjetaVida ahora almacenan URLs.
 */
exports.BuddyPartner = (req, res) => {
    const {
        num_cuadrilla, Hora_buddy, Est_empl, Est_vehi, Carnet, TarjetaVida,
        Fecha, Est_etapa, Est_her, Tablero, Calentamiento, Tipo, id_empleado,
        MotivoEmp, MotivoVeh, MotivoHer // Campos de motivo agregados
    } = req.body;

    console.log("Datos de la solicitud (req.body):", req.body);

    // Validación de campos obligatorios
    if (!num_cuadrilla || !Hora_buddy || !Est_empl || !Est_vehi ||
        !Carnet || !TarjetaVida || // Se verifica que las URLs (cadenas) no estén vacías
        !Fecha || !Est_etapa || !Est_her || !id_empleado || !Tipo) {

        console.error("Faltan campos obligatorios en la solicitud.");
        return res.status(400).json({ message: "Todos los campos (incluyendo URLs de Carnet y TarjetaVida) son obligatorios" });
    }

    const values = {
        num_cuadrilla,
        Hora_buddy,
        Est_empl,
        Est_vehi,
        // Almacena la URL directamente (cadena de texto)
        Carnet: Carnet,
        TarjetaVida: TarjetaVida,
        Fecha,
        Est_etapa,
        Est_her,
        MotivoEmp,
        MotivoVeh,
        MotivoHer,
        // Valores opcionales, se establece null si no se reciben
        Tablero: Tablero || null,
        Calentamiento: Calentamiento || null,
        Tipo,
        id_empleado
    };

    // Inserción en la base de datos
    db.query("INSERT INTO buddy SET ?", values, (error) => {
        if (error) {
            console.error("Error al registrar Buddy Partner:", error);
            return res.status(500).json({ message: "Error al registrar Buddy Partners" });
        }
        return res.status(200).json({ message: `BuddyPartner #${Tipo} en cuadrilla ${num_cuadrilla} registrado correctamente` });
    });
};

// ========================
// 📝 Actualizar un registro existente (PUT /buddypartner/:id)
// ========================
/**
 * Actualiza un registro de Buddy Partner por su ID.
 * Se asume que los valores de Carnet y TarjetaVida son URLs si se envían.
 */
exports.EditBuddyPartner = (req, res) => {
    const { id } = req.params;
    const data = req.body;

    // Se eliminó la lógica obsoleta de conversión a 1/0, ahora se actualiza con la URL enviada

    db.query("UPDATE buddy SET ? WHERE id_buddy1 = ?", [data, id], (err) => {
        if (err) {
            console.error("Error al actualizar el reporte:", err);
            return res.status(500).json({ message: "Error al actualizar el reporte" });
        }
        return res.status(200).json({ message: "Reporte actualizado correctamente" });
    });
};

// ========================
// 🗑️ Eliminar un registro (DELETE /buddypartner/:id)
// ========================
/**
 * Elimina un registro de Buddy Partner por su ID.
 */
exports.DeleteBuddyPartner = (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM buddy WHERE id_buddy1 = ?", [id], (err) => {
        if (err) {
            console.error("Error al eliminar el reporte:", err);
            return res.status(500).json({ message: "Error al eliminar el reporte" });
        }
        return res.status(200).json({ message: "Reporte eliminado correctamente" });
    });
};

// ========================
// 📄 Exportar PDF filtrado (GET /buddypartner/export/pdf)
// ========================
/**
 * Genera un PDF con los registros de Buddy Partners aplicando filtros de consulta.
 * Utiliza 'pdfkit-table'.
 */
exports.ExportPDF = (req, res) => {
    const filters = req.query;
    let sql = "SELECT * FROM buddy WHERE 1=1";
    const params = [];

    // Construcción dinámica de filtros
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
        // Filtra por la fecha de registro (parte de la fecha/hora)
        sql += " AND DATE(Fecha) = ?";
        params.push(filters.Fecha);
    }

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error("Error al consultar datos para PDF:", err);
            return res.status(500).send("Error al generar PDF");
        }

        // Configuración de la respuesta HTTP para la descarga
        const doc = new PDFDocument({ margin: 30, size: "A4", layout: "landscape" });
        res.setHeader("Content-Disposition", "attachment; filename=Reporte_BuddyPartners.pdf");
        res.setHeader("Content-Type", "application/pdf");
        doc.pipe(res);

        // Contenido del PDF
        doc.fontSize(20).fillColor("#1f4e79").text("Reporte de Buddy Partners", { align: "center" });
        doc.moveDown(2);

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
                // Muestra un indicador para la URL
                r.Carnet ? "Ver URL" : "No",
                r.TarjetaVida ? "Ver URL" : "No",
                r.Fecha ? new Date(r.Fecha).toISOString().split("T")[0] : "",
                r.Est_etapa,
                r.Est_her,
                r.id_empleado,
                r.Tipo,
            ]),
        };

        // Lógica para el fondo degradado del encabezado de la tabla (manteniendo el estilo visual)
        const tableTop = doc.y + 10; // Ajuste para que se vea justo después del título
        const tableLeft = 30;
        const tableWidth = 785;
        const headerHeight = 25;

        const gradient = doc.linearGradient(tableLeft, tableTop, tableLeft + tableWidth, tableTop);
        gradient.stop(0, "#004aad");
        gradient.stop(1, "#1e88e5");

        doc.rect(tableLeft, tableTop, tableWidth, headerHeight).fill(gradient);

        // Dibujar tabla
        doc.table(table, {
            prepareHeader: () => doc.fontSize(10).fillColor("white").font("Helvetica-Bold"),
            prepareHeaderOptions: () => ({ fill: null }), // Evita sobreescribir el degradado
            prepareRow: (row, iCol, iRow) => {
                doc.fontSize(9).font("Helvetica");
                if (iRow % 2 === 0) doc.fillColor("black");
            },
            // Se mantienen los anchos de columna para el diseño horizontal (landscape)
            columnsSize: [35, 70, 70, 70, 70, 70, 70, 70, 70, 70, 59, 59],
            x: tableLeft,
            y: tableTop,
        });

        // Pie de página
        doc.moveDown(2);
        doc.fontSize(8).fillColor("gray")
            .text(`Generado el: ${new Date().toLocaleDateString()}`, { align: "right" });

        doc.end();
    });
};

// ========================
// 📊 Exportar Excel filtrado (GET /buddypartner/export/excel)
// ========================
/**
 * Genera un archivo Excel con los registros de Buddy Partners aplicando filtros de consulta.
 * Utiliza 'exceljs'.
 */
exports.ExportExcel = (req, res) => {
    const filters = req.query;
    let sql = "SELECT * FROM buddy WHERE 1=1";
    const params = [];

    // Construcción dinámica de filtros
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
            console.error("Error al consultar datos para Excel:", err);
            return res.status(500).send("Error al generar Excel");
        }

        // Importación local de ExcelJS
        const ExcelJS = require('exceljs');
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Reporte Buddy Partners");

        // Definición de columnas (incluyendo ancho aumentado para las URLs)
        worksheet.columns = [
            { header: "Id", key: "id_buddy1", width: 10 },
            { header: "Cuadrilla", key: "num_cuadrilla", width: 15 },
            { header: "Hora", key: "Hora_buddy", width: 15 },
            { header: "Estado Empleado", key: "Est_empl", width: 20 },
            { header: "Estado Vehículo", key: "Est_vehi", width: 20 },
            { header: "Carnet", key: "Carnet", width: 40 },
            { header: "Tarjeta Vida", key: "TarjetaVida", width: 40 },
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
                fgColor: { argb: "FF1F4E79" } // Color azul oscuro
            };
        });

        // Agregar los datos
        results.forEach((r) => {
            worksheet.addRow({
                ...r,
                // Formatear la fecha a YYYY-MM-DD
                Fecha: r.Fecha ? new Date(r.Fecha).toISOString().split("T")[0] : "",
                // Usar la URL completa o un mensaje si está vacía
                Carnet: r.Carnet || "No Aplica",
                TarjetaVida: r.TarjetaVida || "No Aplica",
            });
        });

        // Configuración de la respuesta HTTP para la descarga
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
// ⏳ Obtener Buddys pendientes por usuario (GET /buddypartner/pending/:id)
// ========================
/**
 * Obtiene los registros de Buddy Partners que están pendientes para un empleado específico.
 * Se considera pendiente si es de un día anterior y la etapa es 'Inicio' o 'En proceso'.
 */
exports.GetPendingByUser = (req, res) => {
    const { id } = req.params; // id del usuario logueado

    const hoy = new Date().toISOString().split("T")[0]; // Fecha actual para comparación

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
            console.error("Error al obtener pendientes:", error);
            return res.status(500).json({ message: "Error al obtener pendientes" });
        }

        return res.status(200).json(results);
    });
};