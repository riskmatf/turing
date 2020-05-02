<template>
    <div class="container">
        <el-card class="login-card">
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
                <el-button :disabled="isLoginButtonDisabled">
                    Prijavi se
                </el-button>
            </div>
        </el-card>
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
    export default {
        data() {
            return {
                username: '',
                password: '',
            }
        },
        computed: {
            isLoginButtonDisabled() {
                return this.username.trim() === '' || this.password.trim() === ''
            }
        }
    }
</script>

