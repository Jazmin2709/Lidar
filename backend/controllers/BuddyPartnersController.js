const db = require('../config/db');


exports.GetBuddyPartner1 = (req, res) => {
    db.query('SELECT * FROM buddy_1', (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al obtener BuddyPartners1' });
        }
        return res.status(200).json(results);
    });
}
exports.BuddyPartner1 = (req, res) => {
    const { num_cuadrilla, Hora_buddy, Est_empl, Est_vehi, Carnet,  TarjetaVida, Fecha, Est_etapa, Est_her, id_empleado } = req.body;

    if (!num_cuadrilla || !Hora_buddy || !Est_empl || !Est_vehi || !Carnet || !TarjetaVida || !Fecha || !Est_etapa || !Est_her || !id_empleado) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    db.query('INSERT INTO buddy_1 SET ?', { num_cuadrilla, Hora_buddy, Est_empl, Est_vehi, Carnet, TarjetaVida, Fecha, Est_etapa, Est_her, id_empleado }, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al registrar BuddyPartners1'});
        }
        return res.status(200).json({ message: 'BuddyPartner1 registrado correctamente' });
    });
}