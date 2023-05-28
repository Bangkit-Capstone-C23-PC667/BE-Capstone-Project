const Example = require('../models/Example');

exports.getExample = async (req, res) => {
 try {
    const examples = await Example.findAll();
    res.json(examples);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.createExample = async (req, res) => {
  try {
    const { name } = req.body;
    const example = await Example.create({ name });
    res.json(example);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updateExample = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const example = await Example.findByPk(id);
    
    if (!example) {
      return res.status(404).json({ message: 'Example not found' });
    }

    example.name = name;
    await example.save();
    res.json(example);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.deleteExample = async (req, res) => {
  try {
    const { id } = req.params;
    const example = await Example.findByPk(id);

    if (!example) {
      return res.status(404).json({ message: 'Example not found' });
    }

    await example.destroy();
    res.json({ message: 'Example deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
