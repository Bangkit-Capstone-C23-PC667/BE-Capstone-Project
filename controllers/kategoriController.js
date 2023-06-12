const Kategori = require('../models/kategoriModel');

// Get all kategoris
exports.getAllKategoris = async (req, res) => {
    try {
        const kategoris = await Kategori.findAll();
        if (kategoris.length === 0) {
            return res.status(404).json({ message: 'No kategori found' });
        }
        const response = {
            status: "success",
            message: "berhasil menampilkan semua data kategoris",
            data: kategoris,
        }  
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get a single kategori by ID
exports.getKategoriById = async (req, res) => {
    const { id } = req.params;
    try {
        const kategori = await Kategori.findByPk(id);
        if (!kategori) {
        return res.status(404).json({ message: 'Kategori not found' });
        }
        const response = {
            status: "success",
            message: "berhasil menampilkan data kategori",
            data: kategori,
        }  
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Create a new kategori
exports.createKategori = async (req, res) => {
    const { kategori_nama, kategori_desc } = req.body;
    try {
        const kategori = await Kategori.create({ kategori_nama, kategori_desc });
        const response = {
            status: "success",
            message: "berhasil membuat kategori",
            data: kategori,
        }  
        res.status(201).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Update an existing kategori
exports.updateKategori = async (req, res) => {
    const { id } = req.params;
    const { kategori_nama, kategori_desc } = req.body;
    try {
        const kategori = await Kategori.findByPk(id);
        if (!kategori) {
        return res.status(404).json({ message: 'Kategori not found' });
        }
        kategori.kategori_nama = kategori_nama;
        kategori.kategori_desc = kategori_desc;
        await kategori.save();
        const response = {
            status: "success",
            message: "berhasil memperbarui kategori",
            data: kategori,
        }  
        res.status(200).json(response);    
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Delete a kategori
exports.deleteKategori = async (req, res) => {
    const { id } = req.params;
    try {
        const kategori = await Kategori.findByPk(id);
        if (!kategori) {
        return res.status(404).json({ message: 'Kategori not found' });
        }
        await kategori.destroy();
        const response = {
            status: "success",
            message: "berhasil menghapus kategori",
        }  
        res.status(200).json(response);    
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
