const router = require('express').Router();
const { query, check, param } = require('express-validator/check');
const jobService = require('../services/job');
const applyService = require('../services/apply');
const { isInRoles } = require('../configs/security');

// แสดงรายการห้องประชุมที่จะทำการจอง
router.get('/', [
    query('page').isInt()
], async (req, res) => {
    try {
        req.validate();
        res.json(await jobService.find(req.query));
    }
    catch (ex) { res.error(ex); }
});

// แสดงข้อมูลอุปกรณ์ห้องประชุมเพื่อเอาไปทำ list checkbox
router.get('/่jobs', async (req, res) => {
    try {
        res.json(await jobService.findAll());
    }
    catch (ex) { res.error(ex); }
});
// แสดงประวัติการจองห้องประชุม
router.get('/history', [
    query('page').isInt()
], async (req, res) => {
    try {
        req.validate();
        res.json(await applyService.findHistory(
            req.query, 
            req.session.userLogin.u_id 
        ));
    }
    catch (ex) { res.error(ex); }
});

// แสดงรายละเอียดของห้องประชุม
router.get('/job/:id', async (req, res) => {
    try {
        const model = await jobService.findDetailForBooking(req.params.id);
        if (!model) throw new Error('Not found item.');
        res.json(model);
    }
    catch (ex) { res.error(ex); }
});

// เพิ่มการจองห้องประชุม
router.post('/', [
    check('tb_detailJob_j_id').isInt(),
    check('a_name').not().isEmpty(),
    check('a_lastname').not().isEmpty(),
    check('a_studentid').isInt(),
    check('a_faculty').not().isEmpty(),
    check('a_sex').not().isEmpty(),
    check('a_phone').isInt(),
    check('a_resume').not().isEmpty(),
    check('a_date').not().isEmpty(),
], async (req, res) => {
    try {
        req.validate();
        req.body.tb_users_u_id = req.session.userLogin.u_id;
        res.json(await applyService.onCreate(req.body));
    }
    catch (ex) { res.error(ex); }
});

// ดึงข้อมูลห้องประชุมมาทำ Select
router.get('/job/select', async (req, res) => {
    try {
        res.json(await jobService.findSelect());
    }
    catch (ex) { res.error(ex); }
});

//#region สำหรับผู้ดูและระบบ 


// แสดงรายการจองห้องประชุมของสมาชิก
router.get('/manage', isInRoles(['admin']), [
    query('page').isInt()
], async (req, res) => {
    try {
        req.validate();
        res.json(await applyService.find(req.query));
    }
    catch (ex) { res.error(ex); }
});

// แก้ไขสถานะการจองเป็น อนุมัติ กับ ไม่อนุมัติ
router.put('/manage/:id', isInRoles(['admin']), [
    param('id').isInt(),
    check('a_status').isIn(['allowed', 'not allowed'])
], async (req, res) => {
    try {
        req.validate();
        const findItem = await applyService.findById(req.params.id);
        if (!findItem) throw new Error('Not found item.');
        res.json(await applyService.onUpdate(findItem.a_id, req.body));
    }
    catch (ex) { res.error(ex); }
});

// ลบข้อมูลห้องประชุม
router.delete('/manage/:id', isInRoles(['admin']), [
    param('id').isInt()
], async (req, res) => {
    try {
        req.validate();
        const findItem = await applyService.findById(req.params.id);
        if (!findItem) throw new Error('Not found item.');
        res.json(await applyService.onDelete(findItem.a_id));
    }
    catch (ex) { res.error(ex); }
});

//#endregion

module.exports = router;