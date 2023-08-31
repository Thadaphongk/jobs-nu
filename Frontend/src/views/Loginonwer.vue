<template>
    <div class="login">
                <img src="/img/logo.png" alt="Logo" class="img-logo">
                <div class="card">
                    <h1 class="card-header">
                        LOGIN Onwer
                    </h1>
                    <div class="card-body">

                        <form @submit.prevent="onSubmit()">
                            <div class="form-group">
                                <label for="">ชื่อผู้ใช้งาน</label>
                                <input type="text" name="u_username"
                                v-validate="{required : true }"
                                    v-model.trim="form.o_username"
                                    :class="{ 'is-invalid': errors.has('o_username') }"
                                    class="form-control">
                                <span class="invalid-feedback">{{ errors.first('o_username') }}</span>
                            </div>

                            <div class="form-group">
                                <label for="">รหัสผ่าน</label>
                                <input type="password" name="o_password"
                                    v-validate="{required : true  }"
                                    v-model.trim="form.o_password"
                                    :class="{ 'is-invalid': errors.has('o_password') }"
                                    class="form-control">
                                <span class="invalid-feedback">{{ errors.first('o_password') }}</span>
                            </div>
                            <div v-if=" errorMessage"  class="alert alert-warning text-center">
                                  {{ errorMessage }}
                              </div>
                         
                            <div class="form-group buttons">
                              <button type="submit" class="btn btn-block btn-orange">
                      เข้าสู่ระบบ
                     </button>
                           
                                <button type="button" @click="onRedirectToRegister()" class="btn  btn-secondary btn-block">
                                    ลงทะเบียน
                                </button>
                            
                            </div>
                        </form>

                    </div>
                </div>
            </div>
</template>

<script>


import axios from 'axios';
export default {
  data() {
    return {
      form: {
        o_username: "",
        o_password: ""
      },
      errorMessage:""
    };
  
  
  
  },
  methods: {
    // ส่งข้อมูลไปตรวจสอบ
    onSubmit() {
        this.$validator.validateAll().then( valid => {
             if (!valid) return;
               axios
              .post("api/owner/login", this.form)
              .then(response => {this.$router.push({name : 'home'})})
              .catch(err => (this.errorMessage = err.response.data.message));
             
        });
    },
  
  
    onReset(){
      this.errorMessage = null ;
      this.$validator.reset();
               this.form = {
               o_username: "",
               o_password: "",
               o_firstname: "",
               o_lastname: ""
      }
  },
  onRedirectToRegister(){
    this.$router.push({name:"registeronwer" });
  }
  
  }
};
</script>

<style scoped>
.login{
max-width: 500px;
margin: auto;
}
.img-logo {
  width: 40%;
  display: block;
  margin: auto;
  margin-top: 10%;
  margin-bottom: 30px;
}
h1 {
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  letter-spacing: 5px;
}
.card {
  margin-bottom: 15%;
}
.card-body {
  padding-left: 15%;
  padding-right: 15%;
}
.buttons .btn-secondary {
  margin-top: 20px;
}
.buttons {
  margin-top: 30px;
  margin-bottom: 50px;
}

.btn-orange {
    background-color: orange;
    color: white;
    transition: background-color 0.3s; 
}

.btn-orange:hover {
    background-color: black; 
}




</style>


