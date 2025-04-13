import express from 'express';
import multer from 'multer';
import { dirname } from 'path';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

const port = 3000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log(__filename)
console.log(__dirname)

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, path.join(__dirname, '../public/imgs'))
    },
    filename: (req, file, cb)=>{
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname)
    }
})

const filter = (req, file, cb)=>{
    const ext = path.extname(file.originalname).toLowerCase()
    const extList = ['.png', '.jpg', '.jpeg']
    if(!extList.includes(ext)){
        return cb(new Error(`Only - ${extList.join(', ')} are allowed`))
    }
    cb(null, true)
}

const upload = multer({storage, fileFilter: filter})

app.post('/', upload.single('img'), (req, res) => {
    res.status(200).json({message: 'Image uploaded!'});
});

app.use((err, req, res, next)=>{
    if(err instanceof multer.MulterError || err.message.includes('Only')){
        return res.status(400).json({error: err.message})
    }
    next(err)
})

app.listen(port, () => {
    console.log('Example app listening on port port!');
});
