import mongoose from "mongoose";

const farmerSchema = mongoose.Schema(
    {
        userId: {  
            type: mongoose.Schema.Types.ObjectId,  
            ref: "User", // Reference to the User model  
            required: true  
        },
        fullname: {
            type: String,
            required: true,
            match: /^[A-Za-z]+(?: [A-Za-z]+)*$/,
        },
        email: {
            type: String,
            required:true

        },
        location: {
            type: String,
            required:true

        },
        contactNumber: {
            type: String,
            required: true,
            validate: {
                validator: function(value) {
                    return /^[0-9]{10}$/.test(value);
                },
                message: 'Contact number should be 10 digit number without letters.'
            }
        },
        plantName: { 
            type: String, 
            required: true
        },
        diseaseName: { 
            type: String, 
            required: true
        },
        issueDescription: { 
            type: String, 
            required: true
        },
        status: { 
            type: String, 
            enum: ["Pending", "In Progress", "Resolved"], 
            default: "Pending" 
        },
        requestDate: {
            type: Date,
            default: Date.now
        },
        reply: { 
            type: String, 
            default: "" 
        },
        latitude: { 
            type: String, 
            default: null 
        },  
        longitude: { 
            type: String, 
            default: null 
        },
        image: {
            type: String 
         }

    }
);


export const Farmer = mongoose.model('Farmer',farmerSchema);
