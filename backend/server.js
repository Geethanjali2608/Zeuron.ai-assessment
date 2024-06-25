const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api', routes);
app.get("/",(req,res)=>{
    res.json({"user":"hii"});
})
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
