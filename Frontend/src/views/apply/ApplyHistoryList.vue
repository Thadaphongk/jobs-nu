<template>
  <Layout>
      <Search :types="search_types" @onSearch="onSearch($event)" />
      <div class="form-group">
          <br>
          <br>
      </div>

       <div class="card">
          <div class="card-body">
              <header class="mb-4">
                  <h5><i class="fa fa-list-alt"></i> ตรวจสอบประวัติการสมัครงาน</h5>
              </header>

              <table class="table">
                  <thead>
                      <tr>
                          <th>ชื่อ</th>
                          <th>นามสกุล</th>                         
                          <th>รหัสนิสิต</th>
                          <th>ประวัตรการทำงาน</th>
                         
                          <th></th>
                      </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item of histories.result" :key="item.a_id" :class="getStatusClass(item)">
  <td>{{ item.a_name }}</td>
  <td>{{ item.a_lastname }}</td>
  <td>{{ item.a_studentid }}</td>
  <td>{{ item.a_resume }}</td>
  
  <td class="text-right">
    <label class="badge badge-warning" v-if="item.a_status == 'pending'">
      <i class="fa fa-hourglass"></i> รอดำเนินการ
    </label>
    <label class="badge badge-success" v-if="item.a_status == 'allowed'">
      <i class="fa fa-check-square-o"></i> รอสัมภาษณ์งาน
    </label>
    <label class="badge badge-danger" v-if="item.a_status == 'not allowed'">
      <i class="fa fa-window-close"></i> ไม่ผ่าน
    </label>
  </td>
</tr>

                    </tbody>
        

                  
                       
              </table>

              <Pagination :page="page" :data="histories" @onPage="onPage($event)" />
          </div>
       </div>
  </Layout>
</template>

<script>
import Layout from "@/components/Layout";
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";
import axios from 'axios'
import { mapState } from "vuex";
export default {
components: {
  Layout,
  Search,
  Pagination
},
computed: {
  ...mapState({
    histories: state => state.apply_histories
    
    
  })
},
data() {
  return {
    search_types: [
      { name: "งาน", value: "a_name" },
      { name: "วันที่เริ่ม", value: "a_created", type: "date" },
      { name: "วันที่สิ้นสุด", value: "a_updated", type: "date" }
    ],
    page: 1,
    search: {},
    
  };
},
mounted() {
  this.$store.dispatch("set_apply_histories");



},
methods: {

  // apply class ให้กับแถวใน Table
  getStatusClass(item) {
    const statusClass = {};
    statusClass[item.a_status] = true;
    return statusClass;
  },
  // Search filter
  onSearch(search) {
    this.search = search;
    this.$store.dispatch("set_apply_histories", {
      page: 1,
      ...this.search
    });
  },
  // Pagination
  onPage(page) {
    this.page = page;
    this.$store.dispatch("set_apply_histories", {
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
background-color: #17a2b8;
}
.badge {
width: 100px;
border-radius: 0;
font-weight: 400;
}
.allowed td {
color: #28a745;
}
.not.allowed td {
color: #dc3545;
}
</style>
