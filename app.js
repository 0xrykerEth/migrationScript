import mongoose from "mongoose";
import ProductModel from "./productModel.js";
import ConnectDB from "./ConnectDB.js";
import fs from 'fs/promises';
await ConnectDB();

const file = await fs.readFile("./categories.json","utf-8")
const progress = await fs.readFile('./progress.json','utf-8');
const progressResult = JSON.parse(progress);
console.log(progressResult.value)
const update = JSON.parse(file)

const batchSize = 1000;

for(let i = progressResult.value; i < update.length; i += batchSize){
    const batch = update.slice(i, i + batchSize);

    const operations = batch.map(item => ({
    updateOne: {
        filter: {
            name: item.name
        },
        update: {
            $set: {
                category: item.category
            }
        }
    }
    
}

    
));


    
await ProductModel.bulkWrite(operations);

    progressResult.value = i + batch.length;

    await fs.writeFile("./progress.json",JSON.stringify(progressResult, null, 4));

console.log(`Updated ${Math.min(i + batch.length, update.length)} / ${update.length}`);

}
