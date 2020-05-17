<template>
    <div>
        <page-header>
            <breadcrumbs :paths="breadcrumbData" class="breadcrumbs"/>
        </page-header>
        <div v-if="request.status === 'success'" class="location-container">
            <el-card class="content-container">
                <el-collapse>
                    <el-collapse-item title="Promena imena">
                        <div class="collapse-container">
                            <div class="marginer">Unesite novo ime:</div>
                            <el-input placeholder="Novo ime" size="mini" class="input"></el-input> 
                            <el-button size="mini" class="styler">Promeni ime</el-button>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item title="Promena lozinke">
                        <div class="collapse-container">
                            <div class="marginer">Unesite novu lozinku:</div>
                            <el-input placeholder="Nova lozinka" size="mini" class="input"></el-input> 
                            <div class="marginer">Potvrdite novu lozinku:</div>
                            <el-input placeholder="Potvrda lozinke" size="mini" class="input"></el-input> 
                            <el-button size="mini" class="styler">Promeni lozinku</el-button>                  
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </el-card>
        </div>
        <template v-else-if="request.status === 'loading'">
            <div class="loading">
                Učitavanje...
            </div> 
        </template>
        <div v-else-if="request.status === 'error'" class="text-danger">
            Greška: {{ request.message }}
        </div>
    </div>
</template>

<style lang="sass" scoped>
    .breadcrumbs
        margin-top: 5px
        margin-bottom: 5px
        margin-left: 2px
    .location-container
        display: flex
        flex-direction: column
        align-items: center
        margin-top: 5px
        .content-container
            width: 90%
            .collapse-container
                display: flex
                flex-direction: column
                width: 90%
                margin: auto
            .styler
                margin-top: 10px
                align-self: flex-end
            .marginer
                margin-top: 2px
                margin-bottom: 2px
    .loading
        margin: 20px
</style>

<script>
    import Breadcrumbs from '@/components/_common/breadcrumbs/breadcrumbs'
    import PageHeader from '@/components/_common/pageHeader'
    import { mapState } from 'vuex'


    export default {
        components: {
            Breadcrumbs,
            PageHeader,
        },
        computed: {
            ...mapState('Admin/Classroom/AllClassrooms', ['request']),
            breadcrumbData() {
                return [
                        { name: 'početna', to: {name: 'adminHomePage'}},
                        { name: 'podešavanja', to: { name: 'adminClassroomListPage' } }
                       ]
            },
        }
    }
</script>