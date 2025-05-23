const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Configurar Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'df6nzkgi2',
    api_key: process.env.CLOUDINARY_API_KEY || '849495386851471',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'Hb54iF3CWK6vOHNt-4xTKbBZjZY',
});

// Función para subir una imagen
exports.subirImagen = async (filePath, upload_preset, public_id) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            public_id: public_id,
            upload_preset: upload_preset,
            transformation: [
                { width: 800, height: 600, crop: 'limit' },
                { quality: 'auto' },
                { fetch_format: 'webp' }
            ]
        });

        // Eliminar archivo local después de la subida
        fs.unlinkSync(filePath);

        return result.secure_url;
    } catch (error) {
        console.error('Error al subir imagen a Cloudinary:', error);
        throw new Error('Error al subir imagen');
    }
};

exports.eliminarImagen = async (public_id) => {
    try {
        await cloudinary.uploader.destroy(public_id);
    } catch (error) {
        console.error('Error al eliminar imagen de Cloudinary:', error);
        throw new Error('Error al eliminar imagen');
    }
}