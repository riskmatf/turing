<template>
    <base-layout targetHomePage="adminHomePage">
        <template v-slot:topBar>
            <el-menu-item index="01" :route=" { name: 'adminHomePage' }">
                Pocetna
            </el-menu-item>

            <el-menu-item index="02">
                Kvarovi
            </el-menu-item>

            <el-menu-item index="03" :route=" { name: 'adminClassroomListPage' } ">
                Ucionice 
            </el-menu-item>

            <el-submenu index="04">
                <template slot="title">Nalog</template>
                <el-menu-item index="04-1">
                    <div>
                        <i class="el-icon-setting"></i>
                        <span>Podesavanja</span>
                    </div>
                </el-menu-item>

                <el-menu-item index="04-2">
                    <div>
                        <i class="el-icon-user"></i>
                        <span>Dodaj novog admina</span>
                    </div>
                </el-menu-item>

                <el-menu-item index="04-3">
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
    import { adminStore } from '@/store'
    
    export default {
        name: 'admin-base-layout',
        store: adminStore,
        components: {
            BaseLayout
        },
    }
</script>