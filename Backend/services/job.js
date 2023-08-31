const connection = require('../configs/database');
const config = require('../configs');
const table = 'tb_detailjob';
module.exports = {
   
    findAll() {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT j_name, j_position, j_location FROM ${table}`, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
        });
    },
    findSelect() {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT j_id, j_name FROM ${table}`, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
        });
    },
    findDetailForBooking(id) {
        return new Promise((resolve, reject) => {
            connection.query(`
                SELECT 
                j_id,
                j_image,
                j_name,
                j_position,
                j_day,
                j_hour,
                j_salary,
                j_phone,
                j_location,
                (SELECT COUNT(*) FROM tb_apply WHERE tb_detailjob_j_id = j_id AND a_status = 'pending') AS j_apply,
                j_detail
                FROM ${table}
                WHERE j_id = ?`, [id], (error, result) => {
                    if (error) return reject(error);
                    resolve(result.length == 0 ? null : result[0]);
                });
        });
    },
    find(value) {
        return new Promise((resolve, reject) => {
            const limitPage = config.limitPage;
            const startPage = ((value.page || 1) - 1) * limitPage;
            const sqls = {
                count: 'SELECT COUNT(*) AS `rows` FROM tb_detailjob',
                select: `SELECT * FROM ${table}`
            };
 
            if (value.search_key && value.search_text) {
                const key = value.search_key;
                const txt = value.search_text;
                const sqlSerch = ` WHERE ${connection.escapeId(key)} LIKE ${connection.escape(`%${txt}%`)}`;
                sqls.count += sqlSerch;
                sqls.select += sqlSerch;
            }

            // เรียงลำดับข้อมูล
             sqls.select += ' ORDER BY j_updated DESC';

            // หาจำนวนแถว
            connection.query(sqls.count, (error, result) => {
                if (error) return reject(error);
                const items = { result: [], rows: result[0].rows, limit: limitPage };

                // แบ่งหน้า page
                sqls.select += ` LIMIT ${connection.escape(startPage)},${limitPage}`;
                connection.query(sqls.select, (error, result) => {
                    if (error) return reject(error);
                    items.result = result;
                    resolve(items);
                });
            });
        });
    },
    findOne(column) {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM ${table} WHERE ?`, column, (error, result) => {
                if (error) return reject(error);
                resolve(result.length > 0 ? result[0] : null);
            });
        });
    },
    onCreate(value) {
        return new Promise((resolve, reject) => {
            connection.query(`INSERT INTO ${table} SET ?`, value, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
        });
    },
    onDelete(id) {
        return new Promise((resolve, reject) => {
            connection.query(`DELETE FROM ${table} WHERE j_id=?`, [id], (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
        });
    },
    onUpdate(id, value) {
        return new Promise((resolve, reject) => {
            const $query = `
                UPDATE ${table} SET
                    j_name = ?,
                    j_image= ?,
                    j_position= ?,
                    j_day= ?,
                    j_hour= ?,
                    j_salary= ?,
                    j_phone= ?,
                    j_location= ?,
                    j_detail= ?,
                    j_updated = NOW()
                WHERE 
                    j_id = ?`;
            connection.query($query, [value.j_name,value.j_image,value.j_position,value.j_day,value.j_hour,value.j_salary,value.j_phone,value.j_location,value.j_detail, id], (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
        });
    }
};