<template>
  <Layout>
      <Search :types="search_types" @onSearch="onSearch($event)" />
      <div class="form-group">
        <router-link class="btn btn-menu" :to="{ name:'apply-job' }">หางาน</router-link>
        <router-link class="btn btn-menu" :to="{ name:'apply-history' }">ตรวจสอบงาน</router-link>
      </div>

      <div class="card mb-3" v-for="item in job.result" :key="item.j_id">
          <div class="row align-items-center">
              <div class="col-sm-4 text-center">
                  <img :src="`/api/uploads/${item.j_image}`" :alt="item.j_name" class="img-apply">
              </div>
              <div class="col-sm-8">
                  <div class="card-body">
                      <div>ชื่อร้าน : {{ item.j_name }}</div>
                      <div>ตำแหน่ง : {{ item.j_position }}</div>
                      <div>สถานประกอบการ : {{ item.j_location || 'ไม่มีข้อมูล!' }}</div>
                      <div class="btn-apply">
                        <button @click="onBooking(item)" class="btn btn-info btn-orange">
                       <i class="fa fa-ticket"></i> สมัครงาน
                        </button>

                          <button @click="onDetail(item)" class="btn btn-secondary">
                              <i class="fa fa-info"></i> รายละเอียด
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <Pagination :data="job" :page="page" @onPage="onPage($event)" />
      <ApplyDialog :job="jobItem" @onClose="jobItem = null" />
      <ApplyDetailDialog :job="jobDetailItem" @onClose="jobDetailItem = null" @onBooking="jobItem = $event"/>
  </Layout>
</template>


<script>
import Layout from "@/components/Layout";
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";
import ApplyDialog from "./ApplyDialog";
import ApplyDetailDialog from "./ApplyDetailDialog";
import { mapState } from "vuex";
export default {
components: {
  Layout,
  Search,
  Pagination,
  ApplyDialog,
  ApplyDetailDialog
},
computed: {
  ...mapState(["job"])
},
data() {
  return {
    search_types: [
      { name: "ชื่อห้อง", value: "j_name" },
      { name: "ขนาด", value: "j_position" },
      { name: "รายละเอียด", value: "j_location" }
    ],
    page: 1,
    search: "",
    jobItem: null,
    jobDetailItem: null
  };
},
mounted() {
  this.$store.dispatch("set_apply_job");
},
methods: {
  // เมื่อมีการคลิกเพื่อดูรายละเอียดของห้องประชุม
  onDetail(item) {
    this.jobDetailItem = item;
  },
  // เมื่อมีการคลิกที่จองห้องนี้ จะแสดงหน้า Modal dialod
  onBooking(item) {
    this.jobItem = item;
  },
  onSearch(search) {
    this.search = search;
    this.$store.dispatch("set_apply_job", { page: 1, ...this.search });
  },
  onPage(page) {
    this.page = page;
    this.$store.dispatch("set_apply_job", {
      page: this.page,
      ...this.search
    });
  }
}
};
</script>

<style scoped>
.btn-menu {
color: #ffffff;
background-color: #ced4da;
margin-right: 7px;
min-width: 130px;
}
.btn.router-link-active {
background-color: orange;
}
.card {
color: #525b62;
border-right: solid 5px orange;
}
.card-body {
padding-left: 5px;
}
.img-apply {
max-width: 100%;
}
.btn-apply .btn {
margin-right: 10px;
width: 150px;
margin-top: 15px;
}


.btn-orange {
    background-color: orange;
    color: white;
    border: 2px solid orange; 
}

.btn-orange:hover {
    background-color: darkorange;
    border-color: darkorange; 
}
</style>
