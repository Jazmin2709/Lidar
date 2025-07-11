const db = require('../config/db');

// Obtener todos los registros
exports.GetBuddyPartner = (req, res) => {
    db.query('SELECT * FROM buddy', (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al obtener BuddyPartners1' });
        }
        return res.status(200).json(results);
    });
};

// Crear nuevo registro
exports.BuddyPartner = (req, res) => {
    const {
        num_cuadrilla, Hora_buddy, Est_empl, Est_vehi, Carnet, TarjetaVida,
        Fecha, Est_etapa, Est_her, Tablero, Calentamiento, Tipo, id_empleado
    } = req.body;

    if (!num_cuadrilla || !Hora_buddy || !Est_empl || !Est_vehi || !Carnet || !TarjetaVida ||
        !Fecha || !Est_etapa || !Est_her || !id_empleado || !Tipo) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

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
        Tablero: Tablero || null,
        Calentamiento: Calentamiento || null,
        Tipo,
        id_empleado
    };

    db.query('INSERT INTO buddy SET ?', values, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al registrar BuddyPartners1' });
        }
        return res.status(200).json({ message: `BuddyPartner #${Tipo} en cuadrilla ${num_cuadrilla} registrado correctamente` });
    });
};

// Actualizar un registro existente
exports.EditBuddyPartner = (req, res) => {
    const { id } = req.params;
    const data = req.body;

    db.query('UPDATE buddy SET ? WHERE id_buddy1 = ?', [data, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error al actualizar el reporte' });
        }
        return res.status(200).json({ message: 'Reporte actualizado correctamente' });
    });
};

// Eliminar un registro
exports.DeleteBuddyPartner = (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM buddy WHERE id_buddy1 = ?', [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error al eliminar el reporte' });
        }
        return res.status(200).json({ message: 'Reporte eliminado correctamente' });
    });
};
