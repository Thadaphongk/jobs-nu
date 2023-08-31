<template>
  <div class="sidebar">
      <SidebarNav v-if="userLogin.u_role === 'admin'" :item="admin" class="sidebar-nav" />
      <SidebarNav v-if="userLogin.u_role === 'user'" :item="user" class="sidebar-nav" />
      <SidebarNav :item="setting" class="sidebar-nav" />
  </div>
</template>

<script>
import SidebarNav from "./SidebarNav";
import { mapState } from "vuex";
export default {
computed: {
  ...mapState({
    userLogin: state => state.user
  })
},
data() {
  return {
    admin: {
      header: "<i class='fa fa-unlock'></i> ส่วนของผู้ดูแลระบบ",
      navs: [
        { name: "ตรวจสอบผู้สมัครงาน", link: { name: "apply-manage" } },
        { name: "ข้อมูลงาน", link: { name: "job-list" } },
        { name: "เพิ่มข้อมูลงาน", link: { name: "job-form" } }
      ]
    },
    user: {
      header: "<i class='fa fa-user'></i> ส่วนของผู้ใช้งาน",
      navs: [
        { name: "หางาน", link: { name: "apply-job" } },
        { name: "ตรวจสอบสถานะงาน", link: { name: "apply-history" } },
        { name: "เปลี่ยนรหัสผ่าน" }
      ]
    },
    setting: {
      header: "<i class='fa fa-cog'></i> ตั้งค่าอื่่นๆ",
      navs: [
        { name: "ตั้งค่าข้อมูลส่วนตัว" },
        { name: "ตั้งค่าการแจ้งเตือน" },
        { name: "อัพเกรดบัญชี" }
      ]
    }
  };
},
components: {
  SidebarNav
}
};
</script>

<style scoped>
.sidebar-nav {
margin-bottom: 30px;
}
</style>


