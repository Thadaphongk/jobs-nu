const router = require('express').Router();
const service = require('../services/job');
const { check, query } = require('express-validator/check');
const base64Img = require('base64-img');
const fs = require('fs');
const path = require('path');
const uploadDir = path.resolve('uploads');
const jobDir = path.join(uploadDir, 'jobs');

router.get('/', [
    query('page').not().isEmpty().isInt().toInt()
], async (req, res) => {
    try {
        req.validate();
        res.json(await service.find(req.query));
    }
    catch (ex) { res.error(ex); }
});

// แสดงข้อมูลห้องประชุมแค่ 1 recode เพื่อเอาไปแก้ไข
router.get('/:id', async (req, res) => {
    try {
        const model = await service.findOne({ j_id: req.params.id });
        if (!model) throw new Error('Not found item.');
        model.j_image = base64Img.base64Sync(path.join(jobDir, model.j_image));
        res.json(model);
    }
    catch (ex) { res.error(ex); }
});
// เพิ่มข้อมูล
router.post('/', [
    check('j_image').not().isEmpty(),
    check('j_name').not().isEmpty(),
    check('j_position').not().isEmpty(),
    check('j_phone').not().isEmpty(),
    check('j_location').not().isEmpty(),
    check('j_day').isInt(),
    check('j_hour').isInt(),
    check('j_salary').isInt(),
    check('j_detail').exists(),
], async (req, res) => {
    try {
        req.validate();

        // ตรวจสอบ Folder หากไม่มีก็ทำการสร้าง
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
        if (!fs.existsSync(jobDir)) fs.mkdirSync(jobDir);

        // แปลงข้อมูลรูปภาพ
        req.body.j_image = base64Img
            .imgSync(req.body.j_image, jobDir, `job-${Date.now()}`)
            .replace(`${jobDir}\\`, '');

        res.json({ message: await service.onCreate(req.body) });
    }
    catch (ex) {
        // หากว่ามีการ Insert ไม่ผ่านก็ลบทิ้ง
        const delImg = path.join(jobDir, req.body.j_image || '');
        if (fs.existsSync(delImg)) fs.unlink(delImg, () => null);
        res.error(ex);
    }
});
// ลบข้อมูล
router.delete('/:id', async (req, res) => {
    try {
        const item = await service.findOne({ j_id: req.params.id });
        if (!item) throw new Error('Not found item.');
        const deleteItem = await service.onDelete(item.j_id);
        const deleteImg = path.join(jobDir, item.j_image);
        if (fs.existsSync(deleteImg)) fs.unlink(deleteImg, () => null);
        res.send(deleteItem);
    }
    catch (ex) { res.error(ex); }
});

// แก้ไขข้อมูล
router.put('/:id', [
    check('j_image').not().isEmpty(),
   check('j_name').not().isEmpty(),
    check('j_position').not().isEmpty(),
   check('j_phone').not().isEmpty(),
    check('j_location').not().isEmpty(),
   check('j_day').isInt(),
   check('j_hour').isInt(),
    check('j_salary').isInt(),
    check('j_detail').exists(),
], async (req, res) => {
    try {
        req.validate();

        // หาข้อมูลที่จะแก้ไข
        const item = await service.findOne({ j_id: req.params.id });
        if (!item) throw new Error('Not found item.');

        // ตรวจสอบ Folder หากไม่มีก็ทำการสร้าง
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
        if (!fs.existsSync(jobDir)) fs.mkdirSync(jobDir);

        // แปลงข้อมูลรูปภาพ
        req.body.j_image = base64Img
            .imgSync(req.body.j_image, jobDir, `job-${Date.now()}`)
            .replace(`${jobDir}\\`, '');

        const updateItem = await service.onUpdate(req.params.id, req.body);

        // ตรวจสอบว่าแก้ไขข้อมูลได้หรือไม่
        if (updateItem.affectedRows > 0) {
            const deleteImg = path.join(jobDir, item.j_image);
            if (fs.existsSync(deleteImg)) fs.unlink(deleteImg, () => null);
        }

        res.json(updateItem);
    }
    catch (ex) {
        // หากว่ามีการ Insert ไม่ผ่านก็ลบทิ้ง
        const delImg = path.join(jobDir, req.body.j_image || '');
        if (fs.existsSync(delImg)) fs.unlink(delImg, () => null);
        res.error(ex);
    }
})


module.exports = router;