const connection = require('../configs/database');
const { password_hash, password_verify } = require('../configs/security');

module.exports = {
    onRegister(value) {
        return new Promise((resolve, reject) => {
            value.o_password = password_hash(value.o_password);
            connection.query('INSERT INTO tb_owner SET ?', value, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
        });
    },



    onLogin(value){
        return new Promise((resolve, reject) => {
            connection
            .query('SELECT * FROM tb_owner WHERE o_username=?',[value.o_username],(error, result)=>{
                if (error) return reject(error) ;
                if (result.length > 0) {
                    const ownerLogin = result[0];
                    if (password_verify(value.u_password,ownerLogin.u_password)) {
                        delete ownerLogin.u_password;
                        delete ownerLogin.u_created;
                        delete ownerLogin.u_updated;
                        return resolve(ownerLogin);
                    }
                    
                }    
                reject (new Error('Invalid username or password'));
                
            });

    });
   }



   
};