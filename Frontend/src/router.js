import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Register from './views/Register'
import Login from './views/Login'
import JobList from './views/job/jobList'
import JobForm from './views/job/jobForm'
import ApplyJobList from './views/apply/ApplyJobList'
import ApplyHistoryList from './views/apply/ApplyHistoryList'
import ApplyManageList from './views/apply/ApplyManageList'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '/', name: 'home', component: Home, meta: { auth: true } },
   
  
  
    // For job
    { path: '/job', name: 'job-list', component: JobList, meta: { auth: ['admin','owner'] } },
   { path: '/job/form', name: 'job-form', component: JobForm, meta: { auth: ['admin','owner'] } },
   
    // For Apply
   { path: '/Apply/job', name: 'apply-job', component: ApplyJobList, meta: { auth: true } },
   { path: '/Apply/history', name: 'apply-history', component:ApplyHistoryList, meta: { auth: true } },
    {path: '/Apply/manage', name: 'apply-manage', component: ApplyManageList, meta: { auth: ['admin','owner'] } },

   { path: '/register', name: 'register', component: Register },
    { path: '/login', name: 'login', component: Login },
  ]
})

// ตรวจสอบสิทธิ์การเข้าถึงหน้า
router.beforeEach((to, from, next) => {
  const auth = to.meta.auth;
  if (!auth) return next();
  router.app.$store.dispatch('get_user_login')
    .then(() => {
      if (!Array.isArray(auth)) return next();
      const userLogin = router.app.$store.state.user;
      if (auth.indexOf(userLogin.u_role) >= 0) return next();
    })
    .catch(() => next({ name: 'login' }));
})

export default router;