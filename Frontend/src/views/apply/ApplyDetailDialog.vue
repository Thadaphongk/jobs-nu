<template>
    <div class="modal fade" tabindex="-1" role="dialog" id="apply-detail-dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="fa fa-info"></i> รายละเอียดของงาน
                    </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <div class="modal-body" v-if="jobItem">
                   
                   <div class="form-group">
                     <img class="img-fluid"
                      :src="`/api/uploads/${jobItem.j_image}`" 
                      :alt="jobItem.j_name">
                   </div>

                   <div class="row black mt-4">
                     <div class="col-sm-4 form-group">ชื่อร้าน
                    </div>
                     <div class="col-sm-8 form-group">: {{ jobItem.j_name }}</div>
                   </div>

                   <div class="row">
                     <div class="col-sm-4 form-group">ตำแหน่ง</div>
                     <div class="col-sm-8 form-group">: {{ jobItem.j_position }} </div>
                   </div>

                   <div class="row">
                     <div class="col-sm-4 form-group">ใบสมัครล่าสุด</div>
                     <div class="col-sm-8 form-group">:  {{ jobItem.j_apply }} ใบ</div>
                   </div>

                   <div class="row">
                     <div class="col-sm-4 form-group">เบอร์โทรศัพท์ติดต่อ</div>
                     <div class="col-sm-6 form-group">:  {{ jobItem.j_phone }} </div>
                   </div>
                   <div class="row">
                     <div class="col-sm-4 form-group">ชั่วโมงที่ทำงาน</div>
                     <div class="col-sm-8 form-group">:  {{ jobItem.j_hour }}      ชั่วโมง/วัน</div>
                   </div>


                   <div class="row">
                     <div class="col-sm-4 form-group">วันที่ทำงาน</div>
                     <div class="col-sm-8 form-group">:  {{ jobItem.j_day }} วัน/สัปดาห์</div>
                   </div>

                   <div class="row">
                     <div class="col-sm-4 form-group">รายได้</div>
                     <div class="col-sm-8 form-group">:  {{ jobItem.j_salary }} บาท/วัน</div>
                   </div>

                   <div class="row">
                     <div class="col-sm-4 form-group">รายละเอียด</div>
                     <div class="col-sm-8 form-group">: {{ jobItem.j_detail || 'ไม่มีข้อมูล !' }}</div>
                   </div>

                </div>

                <div class="modal-footer">
                  <button @click="onApply()" class="btn btn-info btn-kerry-orange btn-block mt-2 mb-4">
      สมัครงาน
    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Axios from "axios";
const modalID = "#apply-detail-dialog";
export default {
  props: {
    job: {
      required: true
    }
  },
  watch: {
    job(value) {
      if (!value) return;
      // ส่งข้อมูลไป j_id ไปทำการค้นหารายละเอียดห้องประชุม
      Axios.get(`/api/apply/job/${value.j_id}`)
        .then(response => {
          this.jquery(modalID).modal();
          this.jobItem = response.data;
        })
        .catch(err => {
          this.alertify.error(err.response.data.message);
        });
    }
  },
  data() {
    return {
      jobItem: null
    };
  },
  mounted() {
    // ตรวจจับ Event การปิดหน้า Modal dialog
    this.jquery(modalID).on("hide.bs.modal", event => {
      this.$emit("onClose", event);
    });
  },
  methods: {
    onApply() {
      this.jquery(modalID).modal("hide");
      const job = { ...this.job };
      setTimeout(() => {
        this.$emit("onApply", job);
      }, 500);
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
.img-fluid {
  border: solid 1px #6c757d;
}
.black {
  color: #212529;
}


.btn-kerry-orange {
    background-color: #FF5E13;
    color: white;
    border: 2px solid #FF5E13;
}

.btn-kerry-orange:hover {
    background-color: #E84A00;
    border-color: #E84A00;
}
</style>

