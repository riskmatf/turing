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
                        @keyup.native.enter="handleAddNewAdmin"
                    />
                    <div class="marginer"> Unesite korisničko ime: </div>
                    <el-input
                        placeholder="Korisničko ime"
                        size="mini"
                        v-model="usernameInput"
                        @keyup.native.enter="handleAddNewAdmin"
                    />
                    <div class="marginer"> Unesite lozinku: </div>
                    <form autocomplete="off" @submit="preventSubmit">
                        <el-input
                            placeholder="Lozinka"
                            size="mini"
                            v-model="passInput"
                            show-password
                            @keyup.native.enter="handleAddNewAdmin"
                        />
                    </form>
                    <div class="marginer"> Ponovite lozinku: </div>
                    <form autocomplete="off" disabled @submit="preventSubmit">
                        <el-input
                            placeholder="Ponovite lozinku"
                            size="mini"   
                            v-model="repeatInput"
                            show-password
                            @keyup.native.enter="handleAddNewAdmin"
                        />
                    </form>
                    <el-button 
                        size="mini" 
                        class="styler" 
                        @click="handleAddNewAdmin"
                        :disabled="isAddNewAdminButtonDisabled"
                    > 
                        Dodaj admina 
                    </el-button>
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
            isAddNewAdminButtonDisabled(){
                return this.addNewAdminRequestInProgress || 
                    this.nameInput.trim().length === 0 || 
                    this.usernameInput.trim().length === 0 ||
                    this.passInput.trim().length === 0 || 
                    this.repeatInput.trim().length === 0
            },
        },
        data() {
            return {
                nameInput: '',
                usernameInput: '',
                passInput: '',
                repeatInput: '',
                addNewAdminRequestInProgress: false,
            }
        },
        methods: {
            ...mapActions('Admin/Admin', ['addNewAdmin']),
            handleAddNewAdmin() {
                if(this.isAddNewAdminButtonDisabled) {
                    return
                }
                if (this.passInput === this.repeatInput) {
                    this.changePasswordRequestInProgress = true

                    this.$confirm(
                        this.$createElement(
                            'div',
                            [
                                this.$createElement('div', [`Ime: ${this.nameInput}`]),
                                this.$createElement('div', [`Korisničko ime: ${this.usernameInput}`])
                            ]
                        ),
                        'Potvrda novog admina',
                        {
                            cancelButtonText: 'Otkaži',
                            confirmButtonText: 'Potvrdi',
                            customClass: 'message-box-reversed',
                        }
                    ).then(()=>{

                            this.addNewAdmin({
                                username: this.usernameInput,
                                displayName: this.nameInput,
                                password: this.passInput
                            })
                            .then(()=> {
                                this.$message({
                                    type: 'success',
                                    message: 'Novi admin je uspešno dodat.'
                                })
                            }).catch((e)=>{
                                this.$message({
                                    type: 'error',
                                    message: `Dodavanje novog admina neuspešno. ${e}`,
                                })
                            }).finally(()=> {
                                this.changePasswordRequestInProgress = false
                            })
                    })
                } else {
                    this.$message({
                        type: 'error',
                        message: `Lozinke se ne poklapaju.`,
                    })
                }
            },
            preventSubmit(e) {
                e.preventDefault()
            },
        }
    }
</script>