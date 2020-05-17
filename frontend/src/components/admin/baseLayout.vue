<template>
    <base-layout targetHomePage="adminHomePage">
        <template v-slot:topBar>
            <el-menu-item index="01" :route=" { name: 'adminHomePage' }">
                Početna
            </el-menu-item>

            <el-menu-item index="02" :route="{ name: 'reportsFilterPage' }">
                Kvarovi
            </el-menu-item>

            <el-menu-item index="03" :route=" { name: 'adminClassroomListPage' } ">
                Učionice 
            </el-menu-item>

            <el-submenu index="04">
                <template slot="title">Nalog</template>
                <el-menu-item index="04-1" :route=" { name: 'adminSettingsPage' } ">
                    <div>
                        <i class="el-icon-setting"></i>
                        <span>Podešavanja</span>
                    </div>
                </el-menu-item>

                <el-menu-item index="04-2">
                    <div>
                        <i class="el-icon-user"></i>
                        <span>Dodaj novog admina</span>
                    </div>
                </el-menu-item>

                <el-menu-item @click="logoutUser">
                    <div>
                        <i class="el-icon-right"></i>                    
                        <span>Odjava</span>
                    </div>
                </el-menu-item>
            </el-submenu>
        </template>

        <template v-slot:body>
            <router-view/>
        </template>
    </base-layout>
</template>


<style lang="sass" scoped>
    .centerer
        display: flex  
        flex-direction: row
</style>

<script>
    import { BaseLayout } from '@/components/_common/baseLayout'
    import { mapActions } from 'vuex'

    export default {
        name: 'admin-base-layout',
        components: {
            BaseLayout
        },
        methods: {
            ...mapActions('Admin/Admin', ['logout']),
            logoutUser() {
                this.logout()
                .then(() => {
                    this.$router.replace({ name: 'adminLogin' })
                }).catch((e) => {
                    this.$message({ message: `Odjavljivanje nije uspelo: ${e}` })
                })
            },
        }
    }
</script>