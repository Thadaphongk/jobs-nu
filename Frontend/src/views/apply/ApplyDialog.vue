<template>
    <div class="modal fade" tabindex="-1" role="dialog" id="apply-dialog">
        <div class="modal-dialog" role="document">
            <form class="modal-content" @submit.prevent="onSubmit()">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="fa fa-ticket"></i> สมัครงาน
                    </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <div class="modal-body">
                    <div class="form-group">
                        <label for="">ชื่อ</label>
                        <input type="text" name="a_name"
                            v-model.trim="form.a_name"
                            v-validate="{ required: true }"
                            :class="{ 'is-invalid': errors.has('a_name') }"
                            class="form-control">
                        <p class="invalid-feedback">{{ errors.first('a_name') }}</p>
                    </div> 


                    <div class="form-group">
                        <label for="">นามสกุล</label>
                        <input type="text" name="a_lastname"
                            v-model.trim="form.a_lastname"
                            v-validate="{ required: true }"
                            :class="{ 'is-invalid': errors.has('a_lastname') }"
                            class="form-control">
                        <p class="invalid-feedback">{{ errors.first('a_lastname') }}</p>
                    </div> 

                    <div class="form-group">
                        <label for="">รหัสนิสิต</label>
                        <input type="number" name="a_studentid"
                            v-model.trim="form.a_studentid"
                            v-validate="{ required: true }"
                            :class="{ 'is-invalid': errors.has('a_studentid') }"
                            class="form-control">
                        <p class="invalid-feedback">{{ errors.first('a_studentid') }}</p>
                    </div> 


                    <div class="form-group">
                    <label for="">คณะ</label>
                      <select name="a_faculty"
                    v-model.trim="form.a_faculty"
                   v-validate="{ required: true }"
          :class="{ 'is-invalid': errors.has('a_faculty') }"
          class="form-control">
                <option value="">กรุณาเลือกคณะ.</option>
                <option value="วิทยาศาตร์">วิทยาศาตร์</option>
                <option value="วิศวะกรรมศาสตร์">วิศวะกรรมศาสตร์</option>
  
  </select>
  <p class="invalid-feedback">{{ errors.first('a_faculty') }}</p>
</div>


                    <div class="form-group">
                        <label for="">วันเกิด</label>
                        <input type="date" name="a_date"
                            v-model.trim="form.a_date"
                            v-validate="{ required: true }"
                            :class="{ 'is-invalid': errors.has('a_date') }"
                            class="form-control">
                        <p class="invalid-feedback">{{ errors.first('a_date') }}</p>
                    </div> 



                    <div class="form-group">
                        <label for="">เบอร์โทรติดต่อ</label>
                        <input type="number" name="a_phone"
                            v-model.trim="form.a_phone"
                            v-validate="{ required: true }"
                            :class="{ 'is-invalid': errors.has('a_phone') }"
                            class="form-control">
                        <p class="invalid-feedback">{{ errors.first('a_phone') }}</p>
                    </div> 


                    <div class="form-group">
                    <label for="">เพศ</label>
                      <select name="a_sex"
                    v-model.trim="form.a_sex"
                   v-validate="{ required: true }"
          :class="{ 'is-invalid': errors.has('a_sex') }"
          class="form-control">
                <option value="">เพศ</option>
    <option value="ชาย ">ชาย</option>
    <option value="หญิง ">หญิง</option>
  
  </select>
  <p class="invalid-feedback">{{ errors.first('a_sex') }}</p>
</div>

                    

                    <div class="form-group">
                        <label for="">resume</label>
                        <textarea 
                            v-model.trim="form.a_resume"
                            class="form-control" rows="4"></textarea>
                    </div>

                    <div class="modal-footer">
    <button type="submit" class="btn btn-orange btn-block mt-2 mb-4">สมัครงาน</button>
  </div>
              </div>
            </form>
        </div>
    </div>
</template>

<script>
import Axios from "axios";
export default {
  props: {
  job: {
    required: true
  }
},
watch: {
  job(value) {
    if (!value) return;
    this.jquery("#apply-dialog").modal();
    this.form.tb_detailJob_j_id = value.j_id; // ตรงนี้
  }
},
data() {
  return {
    form: {
      tb_detailJob_j_id: "",
        a_name:"",
        a_lastname: "",
        a_studentid: "",
        a_faculty: "",
        a_date: "",
        a_phone: "",
        a_sex:"",
        a_resume: "",
    }
  };
},
  mounted() {
    // ตรวจจับ Event การปิดหน้า Modal dialog
    this.jquery("#apply-dialog").on("hide.bs.modal", event => {
      this.$emit("onClose", event);
    });

  },
  methods: {
    // บันทึกข้อมูล
    onSubmit() {
  this.$validator.validateAll().then(valid => {
    if (!valid) return;
    const requestData = { ...this.form };
    // ส่งข้อมูลไปยัง Server
    Axios.post("/api/apply", requestData)
      .then(response => {
        this.onReset();
        this.jquery("#apply-dialog").modal("hide");
      })
      .catch(err => this.alertify.error(err.response.data.message));
  });
},
 
    // ล้างข้อมูลจาก Form
    onReset() {
      this.$validator.reset();
      this.form = {
        tb_detailJob_j_id: "",
        a_name:"",
        a_lastname: "",
        a_studentid: "",
        a_faculty: "",
        a_date: "",
        a_phone: "",
        a_sex:"",
        a_resume: "",
        
      };
    }
  }
};
</script>

<style scoped>
.modal {
  color: #525b62;
}
.modal-body,
.modal-footer {
  padding-left: 8%;
  padding-right: 8%;
}
.form-check {
  margin-bottom: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.img-equipment {
  width: 100px;
  height: 70px;
  border: solid 1px #d0d0d0;
  display: inline-block;
  margin: 1px;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: contain;
}
.btn-orange {
  background-color: #FFA500;
  color: #fff;
}
</style>

