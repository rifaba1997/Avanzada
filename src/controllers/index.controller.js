const { Pool } = require('pg'); // Conjunto de peticiones para Postgres
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: '123456',
    database: 'narinocovidapi',
    port: '5432'
})

const JWT_SECRETKEY = 'asdfjeirjkdf';

const login = async(req, res) => {
    const {user, password} = req.body;
    const auxuser = await pool.query('select usuario, email, contrasena from usuarios where usuario = $1', [user]);
    if(bcrypt.compare(password,auxuser.rows[0].contrasena)){
        console.log('Bienvenido');
        const token = jwt.sign(user, JWT_SECRETKEY);
        res.send({
            login_user: auxuser.rows[0].usuario,
            login_email: auxuser.rows[0].email,
            token: token
        });
    }
    else {
        return res.status(403).send('Usuario o contraseña incorrectos');
    }
    //if(!auxuser || auxuser.rows[0].contrasena !== password ) return res.status(403).send('Usuario o contraseña incorrectos');
    
}
const signup = async(req, res) => {
    const {user, email, password} = req.body;
    let hash =bcrypt.hashSync(password,10);
    const newUser = await pool.query('insert into usuarios(usuario, email, contrasena) values ($1, $2, $3)',[user, email, hash]);
    const token = jwt.sign(user, JWT_SECRETKEY);
    res.send({
        signed_user: user,
        signed_email: email,
        token: token
    })
    
}
const getPacientes = async (req, res) => {
    if (req.query.sexo){
        const pacientes = await pool.query('select * from pacientes where sexo = $1', [req.query.sexo]);
        return res.json(pacientes.rows);
    }
    if (req.query.edad){
        if (req.query.edad == 'infancia'){
            const minimo = 0;
            const maximo = 11;
            const pacientes = await pool.query('select * from pacientes where edad >= $1 and edad <= $2', [minimo, maximo]);
            return res.json(pacientes.rows);
        }
        if (req.query.edad == 'juventud'){
            const minimo = 12;
            const maximo = 26;
            const pacientes = await pool.query('select * from pacientes where edad >= $1 and edad <= $2', [minimo, maximo]);
            return res.json(pacientes.rows);
        }
        if (req.query.edad == 'adultez'){
            const minimo = 27;
            const maximo = 59;
            const pacientes = await pool.query('select * from pacientes where edad >= $1 and edad <= $2', [minimo, maximo]);
            return res.json(pacientes.rows);
        }
        if (req.query.edad == 'vejez'){
            const minimo = 60;
            const pacientes = await pool.query('select * from pacientes where edad >= $1', [minimo]);
            return res.json(pacientes.rows);
        }      
    }
    if (req.query.estado){
        const pacientes = await pool.query('select * from pacientes where estado = $1', [req.query.estado]);
        return res.json(pacientes.rows);
    }
    if(req.query.fecha_notif){

        switch(req.query. fecha_notif){
            case 'enero':
                var pacientes = await pool.query("select * from pacientes where fecha_notif::date >= '2020-01-01' and fecha_notif::date <= '2020-01-31'");
                return res.json(pacientes.rows);
                break;
            case 'febrero':
                var pacientes =await pool.query("select * from pacientes where fecha_notif::date >= '2020-02-01' and fecha_notif::date <= '2020-02-28'");
                return res.json(pacientes.rows);
                break;
            case 'marzo':
                var pacientes =await pool.query("select * from pacientes where fecha_notif::date >= '2020-03-01' and fecha_notif::date <= '2020-03-31'");
                return res.json(pacientes.rows);
                break;
            case 'abril':
                var pacientes =await pool.query("select * from pacientes where fecha_notif::date >= '2020-04-01' and fecha_notif::date <= '2020-04-30'");
                return res.json(pacientes.rows);
                break;
            case 'mayo':
                var pacientes =await pool.query("select * from pacientes where fecha_notif::date >= '2020-05-01' and fecha_notif::date <= '2020-05-31'");
                return res.json(pacientes.rows);
                break;
            case 'junio':
                var pacientes =await pool.query("select * from pacientes where fecha_notif::date >= '2020-06-01' and fecha_notif::date <= '2020-06-30'");
                return res.json(pacientes.rows);
                break;
            case 'julio':
                var pacientes =await pool.query("select * from pacientes where fecha_notif::date >= '2020-07-01' and fecha_notif::date <= '2020-07-31'");
                return res.json(pacientes.rows);
                break;
        }    
    }
 
    const response = await pool.query('select * from pacientes');
    res.json(response.rows);
}

module.exports = {
    getPacientes,
    login,
    signup
}