import Order from "../../models/Order";
import Product from "../../models/Product";
import connectDb from "../../middleware/mongoose";

const handler = async (req, res) => {
    if(req.method=='POST'){
        const { email, id, status, address, pin, city, state, amount, products } = req.body;

        let product, sumTotal=0;
        for(let item in products){
            product = await Product.findOne({slug: item})
            sumTotal += product.price * products[item].qty
            if(product.availableQty<products[item].qty){
                res.status(200).json({success: false, error:"🚨 Some products in your cart are out of stock"})
                return;
            }
            if(product.price != products[item].price){
                res.status(200).json({success: false, error:'🚨 Checkout Unsuccessfull, please try again later!!'})
                return;
            }
        }
        if(sumTotal!==amount){
            res.status(200).json({success: false, error:'🚨 Checkout Unsuccessfull, please try again later!!'})
            return;
        }

        const newOrder = new Order({email, orderId:id, status, address, pincode:pin, city, state, amount, products});
        await newOrder.save();

        for(let item in products){
            await Product.findOneAndUpdate({slug: item},{$inc:{"availableQty":-products[item].qty}})
        }

        if(newOrder){
            res.status(200).json({success:true});
        } else{
            res.status(400).json({success:false});
        }
    } else{
        res.status(400).json({error:"This method is not allowed"});
    }
}

export default connectDb(handler);