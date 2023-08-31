<template>
  <Layout>
      <div  class="form-group">
          <router-link class="btn" :to="{ name:'job-list' }">รายการข้อมูล</router-link>
          
      </div>
      <div class="card">
          <div class="card-body">
              <header class="mb-4">
                  <Search :types="search_types" @onSearch="onSearch($event)" />
                  <h5><i class="fa fa-list-alt"></i> รายการข้อมูลงาน</h5>
              </header>
              <table class="table">
  <thead>
    <tr>
      <th>รูป</th>
      <th>ชื่องาน</th>
      <th>สถานที่</th>
      <th>ตำแหน่ง</th>
      <th>แก้ไขล่าสุด</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="item in job.result" :key="item.j_id">
      <td>
        <div class="img-container">
          <img :alt="item.j_name" :src="`/api/uploads/${item.j_image}`">
        </div>
      </td>
      <td>{{ item.j_name }}</td>
      <td>{{ item.j_location }}</td>
      <td>{{ item.j_position || 'ไม่มีข้อมูล' }}</td>
      <td>{{ formatTimeAgo(item.j_updated) }}</td>
      <td class="text-right">
        <i @click="onUpdate(item)" class="pointer fa fa-edit text-info mr-3"></i>
        <i @click="onDelete(item)" class="pointer fa fa-trash text-danger"></i>
      </td>
    </tr>
    <tr v-for="item in items" :key="item.id">
      <td>{{ item.name }}</td>
      <td>{{ formatTimeAgo(item.j_updated) }}</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
  </tbody>
</table>

              <Pagination :data="job" :page="page" @onPage="onPage($event)" />
          </div>
      </div>
  </Layout>
</template>

<script>

import 'alertifyjs/build/css/alertify.min.css';
import alertify from 'alertifyjs' ;
import Layout from "@/components/Layout";
import Pagination from "@/components/Pagination";
import Search from "@/components/Search";
import { mapState } from "vuex";
import Axios from "axios";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
dayjs.locale('th');
export default {
data() {
  return {
    search: {},
    page: 1,
    search_types: [
      { name: "ชื่องาน", value: "j_name" },
      { name: "จำนวนที่รับ", value: "j_location" },
      { name: "ตำแหน่ง", value: "j_position" }
    ],
   items: [] 
  };
},
computed: {
  ...mapState(["job"])
},
components: {
  Layout,
  Pagination,
  Search
},
created() {
  this.$store.dispatch("set_job");
},
methods: {

  formatTimeAgo(timestamp) {
      return dayjs(timestamp).fromNow();
    },
  // แก้ไขข้อมูลโดยส่ง id ไปที่หน้า Form create
  onUpdate(item) {
    this.$router.push({ name: "job-form", query: { id: item.j_id } });
  },
  // ลบข้อมูล
  onDelete(item) {
      alertify.confirm()
        .setting({
          title: 'ลบรายการ',
          message: 'คุณต้องการดำเนินการนี้หรือไม่?',
          labels: {
            ok: 'ตกลง',
            cancel: 'ยกเลิก'
          }
        })
        .set('onok', () => {
          Axios.delete(`/api/job/${item.j_id}`)
            .then(() => {
              this.$store.dispatch("set_job");
              alertify.success('ลบรายการสำเร็จ');
            })
            .catch(error => {
              this.alertify.error(error.response.data.message);
            });
        })
        .show();
    },
    onSearch(search) {
      this.search = search;
      this.page = 1;
      this.$store.dispatch("set_job", { page: this.page, ...this.search });
    }
  },
  // การแบ่งหน้า Pagination
  onPage(page) {
    this.page = page;
    this.$store.dispatch("set_job", {
      page: this.page,
      ...this.search
    });
  },
  // การค้นหาข้อมูล Filter
 
  };

</script>

<style  scoped>
.btn {
color: #ffffff;
background-color: #ced4da;
margin-right: 7px;
min-width: 130px;
}
.btn.router-link-active {
background-color: orange;
}

.table th:nth-child(4),.table td:nth-child(4) {
        width: 15%; /* ปรับความกว้างตามที่ต้องการ */
}
</style>
