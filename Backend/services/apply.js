const connection = require('../configs/database');
const config = require('../configs');
const table = {
    a: 'tb_apply',
};
module.exports = {
    findById(id) {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM ${table.a} WHERE a_id = ?`, [id], (error, result) => {
                if (error) return reject(error);
                resolve(result.length > 0 ? result[0] : null);
            });
        });
    },
    findByRoomId(jobId) {
        return new Promise((resolve, reject) => {
            connection.query(`
                SELECT * 
                FROM ${table.a} 
                WHERE tb_detailjob_j_id=?
                AND a_status <> 'not allowed'`, [jobId], (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                });
        });
    },
    findHistory(value, tb_users_u_id) {
        return new Promise((resolve, reject) => {
            const limitPage = config.limitPage;
            const startPage = ((value.page || 1) - 1) * limitPage;
            const sqls = {
                count: `SELECT COUNT(*) AS row_count FROM ${table.a} WHERE tb_users_u_id = ${connection.escape(tb_users_u_id)}`,
                select: `SELECT * FROM ${table.a} WHERE tb_users_u_id = ${connection.escape(tb_users_u_id)}`
            };
    
            if (value.search_key && value.search_text) {
                const key = value.search_key;
                const txt = value.search_text;
                const sqlSearch = ` AND ${connection.escapeId(key)} LIKE ${connection.escape(`%${txt}%`)}`;
                sqls.count += sqlSearch;
                sqls.select += sqlSearch;
            }
    
            // เรียงลำดับข้อมูล
            sqls.select += ' ORDER BY a_created DESC';
    
            // หาจำนวนแถว
            connection.query(sqls.count, (error, countResult) => {
                if (error) return reject(error);
    
                const totalRows = countResult[0].row_count;
    
                // แบ่งหน้า page
                sqls.select += ` LIMIT ${startPage},${limitPage}`;
                connection.query(sqls.select, (error, dataResult) => {
                    if (error) return reject(error);
    
                    const items = {
                        result: dataResult,
                        rows: totalRows,
                        limit: limitPage
                    };
    
                    resolve(items);
                });
            });
        });
    },
    find(value) {
        return new Promise((resolve, reject) => {
            const limitPage = config.limitPage;
            const startPage = ((value.page || 1) - 1) * limitPage;
            const sqls = {
                count: `SELECT COUNT(*) AS row_count FROM ${table.a}`, // Changed alias to row_count
                select: `SELECT * FROM ${table.a}`
            };

            if (value.search_key && value.search_text) {
                const key = value.search_key;
                const txt = value.search_text;
                const sqlSerch = ` WHERE ${connection.escapeId(key)} LIKE ${connection.escape(`%${txt}%`)}`;
                sqls.count += sqlSerch;
                sqls.select += sqlSerch;
            }

            // เรียงลำดับข้อมูล
            sqls.select += ' ORDER BY a_created DESC';

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
    onCreate(value) {
        return new Promise((resolve, reject) => {
            // ตรวจสอบว่า table.a ถูกกำหนดไว้ให้ถูกต้อง
            const table = {
                a: 'tb_apply' // ปรับตามชื่อตารางที่ถูกต้อง
            };
    
            
            const aModel = {
                a_name: value.a_name,
                a_lastname: value.a_lastname,
                a_studentid: value.a_studentid,
                a_faculty: value.a_faculty,
                a_date: value.a_date,
                a_phone: value.a_phone,
                a_sex: value.a_sex,
                a_resume: value.a_resume,
                tb_users_u_id: value.tb_users_u_id,
                tb_detailJob_j_id: value.tb_detailJob_j_id
            };
    
            connection.query(`INSERT INTO ${table.a} SET ?`, aModel, (aError, aResult) => {
                if (aError) {
                    return reject(aError);
                }
    
                resolve(aResult);
            });
        });
    },
    onUpdate(id, value) {
        return new Promise((resolve, reject) => {
            connection.query(`
                UPDATE ${table.a} 
                SET 
                    ?,
                    a_updated = NOW()
                WHERE a_id = ${connection.escape(id)}`, value, (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                })
        });
    },
    onDelete(id) {
        return new Promise((resolve, reject) => {
            connection.query(`DELETE FROM ${table.a} WHERE a_id = ?`, [id], (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
        });
    }
};