import express from "express";
import { Material } from "../Models/materialModel.js";

const router = express.Router();

// Route for Saving a New Material
router.post('/', async (request, response) => {
  try {
    if (
      !request.body.materialName ||
      !request.body.category ||
      !request.body.diseaseUsage ||
      !request.body.usageInstructions ||
      !request.body.unitType ||
      !request.body.pricePerUnit ||
      !request.body.supplierName ||
      !request.body.supplierContact
    ) {
      return response.status(400).send({
        message: 'All fields are required',
      });
    }

    const newMaterial = {
      materialName: request.body.materialName,
      category: request.body.category,
      diseaseUsage: request.body.diseaseUsage,
      usageInstructions: request.body.usageInstructions,
      unitType: request.body.unitType,
      pricePerUnit: request.body.pricePerUnit,
      supplierName: request.body.supplierName,
      supplierContact: request.body.supplierContact,
      image: request.body.image || '',
    };

    const material = await Material.create(newMaterial);

    return response.status(201).send(material);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Get All Materials from database
router.get('/', async (request, response) => {
  try {
    const materials = await Material.find({});

    return response.status(200).json({
      count: materials.length,
      data: materials,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Get One Material from database by id
router.get('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const material = await Material.findById(id);

    if (!material) {
      return response.status(404).json({ message: 'Material not found' });
    }

//     return response.status(200).json(material);
//   } catch (error) {
//     console.log(error.message);
//     response.status(500).send({ message: error.message });
//   }
// });

return response.status(200).json({
  ...material._doc,
  image: material.image // Ensure the image is included in the response
});
} catch (error) {
console.log(error.message);
response.status(500).send({ message: error.message });
}
});

// Route for Update a Material
router.put('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    // Check if all required fields are provided
    if (
      !request.body.materialName ||
      !request.body.category ||
      !request.body.diseaseUsage ||
      !request.body.usageInstructions ||
      !request.body.unitType ||
      !request.body.pricePerUnit ||
      !request.body.supplierName ||
      !request.body.supplierContact
    ) {
      return response.status(400).send({
        message: 'Send all required fields: materialName, category, diseaseUsage, usageInstructions, unitType, pricePerUnit, supplierName, supplierContact',
      });
    }

    const result = await Material.findByIdAndUpdate(id, request.body, { new: true });

    if (!result) {
      return response.status(404).json({ message: 'Material not found' });
    }

    return response.status(200).send({ message: 'Material updated successfully' });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Delete a Material
router.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const result = await Material.findByIdAndDelete(id);

    if (!result) {
      return response.status(404).json({ message: 'Material not found' });
    }

    return response.status(200).send({ message: 'Material deleted successfully' });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;
