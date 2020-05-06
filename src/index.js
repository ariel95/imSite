if(process.env.NODE_ENV != 'production'){
    require('dotenv').config(); //process.env -> .env file
}

const app = require('./app');

app.listen(app.get('port'),()=>{
    console.log('Server on port ', app.get('port'));
    console.log('Enviroment: ' + process.env.NODE_ENV);
});