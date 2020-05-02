<template>
    <div class="container">
        <el-card v-if="showLoginScreen" class="login-card">
            <h2 class="title">Prijava Admina</h2>

            <el-input v-model="username" class="form-item" type="text" size="large" placeholder="Korisnicko ime">
                <i slot="prepend" class="fas fa-user"/>
            </el-input>
            <el-input
                v-model="password"
                class="form-item"
                type="password"
                size="large"
                placeholder="Sifra"
                show-password
            >
                <i slot="prepend" class="fas fa-lock"/>
            </el-input>

            <div class="login-button-container">
                <el-button :disabled="isLoginButtonDisabled" @click="loginUser">
                    Prijavi se
                </el-button>
            </div>
        </el-card>
        <div v-else>
            <i class="el-icon-loading"/>
        </div>
    </div>
</template>

<style lang="sass" scoped>
    @import './src/assets/styles/breakPoints'

    .container
        height: 100%
        display: flex
        flex-direction: row
        justify-content: center
        align-items: center
        .login-card
            width: unset
            @media($mobileBreakPoint)
                width: 90%
            .form-item
                margin-bottom: 10px
            .title
                text-align: center
            .suffix-icon
                height: 100%
                display: flex
                align-items: center
            .login-button-container
                display: flex
                justify-content: center
</style>

<script>
    import { mapActions } from 'vuex'
    import _ from 'lodash'
    /**
     * TODO
     * @task Check if user is logedin by calling whoami
     * [X] Add a flag that should login page be displayed
     * [X] Have spinner
     * [X] On create send request whoami
     * [X] If success redirect to where user was going
     * [X] If it fails show login screen
     * @task On login login user
     * [X] Create function that logins user
     * [X] Send request
     * [X] Create function that redirects user
     * [X] Use it created
     * [X] If success redirect to where user was going
     * [X] If failed show message
     * [X] Add callback to login button
     * @task Login on enter
     * @task When you login failed clear password
     */
    export default {
        data() {
            return {
                username: '',
                password: '',
                showLoginScreen: false,
            }
        },
        computed: {
            isLoginButtonDisabled() {
                return this.username.trim() === '' || this.password.trim() === ''
            },
            redirectUrl() {
                return _.get(this.$route.query, 'to', { name: 'adminHomePage' })
            },
        },
        methods: {
            ...mapActions('Admin/Admin', ['whoami', 'login']),
            loginUser() {
                this.login({
                    username: this.username,
                    password: this.password
                }).then(() => {
                    this.redirectUser()
                }).catch((e) => {
                    this.$message({ message: e, type: 'error' })
                })
            },
            redirectUser() {
                this.$router.replace(this.redirectUrl)
            }
        },
        created() {
            this.whoami()
            .then(() => {
                this.redirectUser()
            }).catch(() => {
                this.showLoginScreen = true
            })
        }
    }
</script>

