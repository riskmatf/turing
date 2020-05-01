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

            <el-menu-item index="04">
                Admin nalog
            </el-menu-item>

            <el-menu-item index="05">
                Dodaj admin nalog
            </el-menu-item>
        </template>

        <template v-slot:body>
            <router-view/>
        </template>
    </base-layout>
</template>


<style lang="sass" scoped>

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