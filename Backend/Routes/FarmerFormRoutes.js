import express from "express";
import { Farmer } from "../Models/farmerModel.js";
import authenticateToken, { authorize } from '../Middleware/authMiddleware.js';


const router = express.Router();

//Route for save a new inquary
router.post('/', authenticateToken, async (request,response)=>{
    try{
        if(
            !request.body.fullname ||
            !request.body.email ||
            !request.body.location ||
            !request.body.contactNumber ||
            !request.body.plantName ||
            !request.body.diseaseName ||
            !request.body.issueDescription||
            !request.body.image
        ){
            return response.status(400).send({
                message:'Please send all required fields'
            });
        }
  
        const newFarmerForm = {
            userId: request.user.id,
            fullname: request.body.fullname,
            email: request.body.email,
            location: request.body.location,
            contactNumber: request.body.contactNumber,
            plantName: request.body.plantName,
            diseaseName: request.body.diseaseName,
            issueDescription: request.body.issueDescription,
            latitude: request.body.latitude,
            longitude: request.body.longitude,
            image: request.body.image
        };
  
        const farmer = await Farmer.create(newFarmerForm);
        return response.status(201).send(farmer)
  
    }catch(error){
        console.log(error.message);
        response.status(500).send({message:error.message});
    }
  
  })


 //get all farmers inquary
router.get('/', authenticateToken, async (request , response)=>{
    try{
        const farmers = await Farmer.find({userId: request.user.id});
        return response.status(200).json({
            count:farmers.length,
            data:farmers
        });

    } catch(error){
        console.log(error.message);
        response.status(500).send({message:error.message});
    }
});

// Get all farmers' inquiries for manager/map
router.get(
    "/all",
    authenticateToken,
    authorize("manager"),
    async (req, res) => {
      try {
        const farmers = await Farmer.find();
        return res.status(200).json({ data: farmers });
      } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
      }
    }
  );



//get farmer inquery by id
router.get('/:id', authenticateToken, async (request , response)=>{
    try{

        const {id} = request.params;

        const farmer = await Farmer.findById(id);

        if (!farmer) {
            return response.status(404).json({ message: 'Farmer inquiry not found' });
        }

        
        if (farmer.userId.toString() !== request.user.id) {
            return response.status(403).json({ message: 'Unauthorized to access this inquiry' });
        }

        
        return response.status(200).json({ 
farmer
    });

    } catch (error) {
        console.error(error.message);
        response.status(500).send({ message: error.message });
    }
});



//update an inquery
router.put('/:id', authenticateToken, async(request,response)=>{
    try{
        if(
            !request.body.fullname ||
            !request.body.email ||
            !request.body.location ||
            !request.body.contactNumber ||
            !request.body.plantName ||
            !request.body.diseaseName ||
            !request.body.issueDescription
        ){
            return response.status(400).send({
                message:'send all required field'
            });
        }

        const {id} = request.params;

        const farmerInquiry  =  await Farmer.findById(id);

        if (!farmerInquiry) {
            return response.status(404).json({ message: 'Farmer inquiry not found' });
        }

        // Check if the logged-in user is the owner of the inquiry
        if (farmerInquiry.userId.toString() !== request.user.id) {
            return response.status(403).json({ message: 'Unauthorized to update this inquiry' });
        }

        // Update the farmer inquiry
        const result = await Farmer.findByIdAndUpdate(id, request.body, { new: true });

        return response.status(200).send({
            message: 'Farmer inquiry updated successfully',
            data: result
        });

    } catch (error) {
        console.error(error.message);
        response.status(500).send({ message: error.message });
    }
});



//delete an inquery
router.delete('/:id', authenticateToken, async (request,response)=>{
    try{

        const {id} = request.params;

        const inquiry = await Farmer.findById(id);
        if (!inquiry) {
            return response.status(404).json({ message: 'Inquiry not found' });
        }

        if (inquiry.userId.toString() !== request.user.id) {
            return response.status(403).json({ message: 'Unauthorized to delete this inquiry' });
        }

        await Farmer.findByIdAndDelete(id);
        return response.status(200).json({ message: 'Inquiry deleted successfully' });
    } catch (error) {
        console.error(error.message);
        response.status(500).send({ message: error.message });
    }
});

export default router;