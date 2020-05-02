<template>
    <el-dialog
        :visible.sync="visibleModel"
        :fullscreen="fullscreen"
        :close-on-press-escape="!addingReport"
        :close-on-click-modal="!addingReport"
        :show-close="false"
    >
        <div slot="title" class="header">
            <div class="close-button el-icon-close" @click="visibleModel = false"></div>
            <div>{{ generalInformation }}</div>
        </div>

        <div class="form-item">
            <label style="align-self: center">Hitan</label>
            <div>
                <report-urgent-switch v-model="isUrgent" yes-text="Jeste hitan" no-text="Nije hitan"/>
            </div>
        </div>
        <div class="form-item">
            <label>Opis<span style="color: red">*</span></label>
            <report-description v-model="description" :max-rows="6" :min-rows="3"/>
        </div>

        <div slot="footer">
            <el-button type="primary" size="small" @click="submit" :disabled="addingReport">
                Prijavi
            </el-button>
            <el-button size="small" @click="visibleModel = false">Otkazi</el-button>
        </div>
        <report-date :report-date="currentDate"/>
    </el-dialog>
</template>

<style lang="sass" scoped>
    .header
        display: flex
        flex-direction: column
        .close-button
            align-self: flex-end
    .form-item
        display: grid
        grid-template-columns: auto 1fr
        margin-bottom: 10px
        padding-top: -10px
        label
            margin-right: 10px
</style>

<script>
    import { mapActions } from 'vuex'
    import { ReportDescription, ReportUrgentSwitch, ReportDate } from '@/components/_common/report'

    export default {
        components: {
            ReportDescription,
            ReportUrgentSwitch,
            ReportDate,
        },
        props: {
            visible: Boolean,
            classroomId: String,
            computerId: Number,
            isGeneral: Boolean,
        },
        data() {
            return {
                currentDate: null,
                description: '',
                isUrgent: false,
                addingReport: false,
                fullscreen: null,
            }
        },
        computed: {
            visibleModel: {
                get() {
                    return this.visible
                },
                set(val) {
                    this.$emit('update:visible', val)
                }
            },
            generalInformation() {
                let message = `Prijavljivanje kvara u ucionici ${this.classroomId}`
                if (!this.isGeneral) {
                    message += ` za racunar ${this.computerId}`
                }
                return message
            },
        },
        methods: {
            ...mapActions('User/Report/Report', ['addReport', 'addGeneralReport']),
            resetState() {
                this.currentDate = Math.round(Date.now() / 1000)
                this.description = ''
                this.isUrgent = false
                this.addingReport = false
            },
            submit() {
                if (this.description.trim() === '') {
                    this.$message({
                        message: 'Polje opis je obavezno',
                        type: 'error',
                    })
                    return
                }
                this.addingReport = true
                let promise = null
                if (this.isGeneral) {
                    promise = this.addGeneralReport({
                        classroomId: this.classroomId,
                        description: this.description,
                        isUrgent: this.isUrgent,
                    })
                } else {
                    promise = this.addReport({
                        computerId: this.computerId,
                        classroomId: this.classroomId,
                        description: this.description,
                        isUrgent: this.isUrgent,
                    })
                }
                promise.then(() => {
                    this.$emit('change')
                }).catch((e) => {
                    this.addingReport = false
                    this.$message({
                        message: e,
                        type: 'error',
                    })
                })
            },
            mediaQueryChanged(e) {
                this.fullscreen = e.matches
            },
        },
        created() {
            this.resetState()
            this.mediaQuery = window.matchMedia('(max-width: 550px)')
            this.mediaQuery.addListener(this.mediaQueryChanged)
            this.fullscreen = this.mediaQuery.matches
        },
        beforeDestroy() {
            this.mediaQuery.removeListener(this.mediaQueryChanged)
        },
        watch: {
            visible() {
                this.resetState()
            }
        }
    }
</script>
