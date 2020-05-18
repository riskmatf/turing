<template>
    <div>
        <page-header>
            <breadcrumbs :paths="breadcrumbData" class="breadcrumbs"/>
        </page-header>
        <div class="location-container">
            <el-card class="content-container">
                <div style="font-weight: bold; margin-bottom: 8px"> Dodavanje novog admina </div>
                <div class="narrower">
                    <div class="marginer"> Unesite ime admina: </div>
                    <el-input
                        placeholder="Ime"
                        size="mini" 
                        v-model="nameInput"   
                    />
                    <div class="marginer"> Unesite korisničko ime: </div>
                    <el-input
                        placeholder="Korisničko ime"
                        size="mini"
                        v-model="usernameInput"
                    />
                    <div class="marginer"> Unesite lozinku: </div>
                    <form autocomplete="off">
                        <el-input
                            placeholder="Lozinka"
                            size="mini"
                            v-model="passInput"
                            show-password
                        />
                    </form>
                    <div class="marginer"> Ponovite lozinku: </div>
                    <form autocomplete="off">
                        <el-input
                            placeholder="Ponovite lozinku"
                            size="mini"   
                            v-model="repeatInput"
                            show-password
                        />
                    </form>
                    <el-button size="mini" class="styler" @click="handleAddNewAdmin"> Dodaj admina </el-button>
                </div>
            </el-card>
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
            .narrower
                display: flex
                flex-direction: column
                width: 90%
                margin: auto
            .styler
                margin-top: 8px
                align-self: flex-end
            .marginer
                margin-top: 3px
                margin-bottom: 3px
</style>

<script>
    import Breadcrumbs from '@/components/_common/breadcrumbs/breadcrumbs'
    import PageHeader from '@/components/_common/pageHeader'
    import { mapActions } from 'vuex'

    export default {
        components: {
            Breadcrumbs,
            PageHeader,
        },
        computed: {
            breadcrumbData() {
                return [
                        { name: 'početna', to: {name: 'adminHomePage'}},
                        { name: 'dodaj admina', to: { name: 'adminClassroomListPage' } }
                       ]
            },
        },
        data() {
            return {
                nameInput: '',
                usernameInput: '',
                passInput: '',
                repeatInput: '',
            }
        },
        methods: {
            handleAddNewAdmin() {
                if (this.passInput === this.repeatInput) {
                    console.log(this.nameInput)
                } else {
                    this.$message({
                        type: 'error',
                        message: `Lozinke se ne poklapaju.`,
                    })
                }
            },
            ...mapActions('Admin/Admin', ['addNewAdmin']),
        }
    }
</script>