<template>
    <router-link :to="classroomLink" tag="div" class="clickable">
        <el-card class="box-card" shadow="hover">
            <template v-slot:header>
                <div class="row">
                    <classroom-name :classroomName="classroom.name"/>
                    <div class="aligner">
                        <i class="el-icon-delete text-danger" @click="(e)=>confirmDelete(e, classroom.name)"></i>
                    </div>
                </div>
            </template>
            <div class="column">
                <classroom-image :classroomImageUrl="classroom.imageUrl"/>
                <classroom-comp-count class="centered" :classroomCompCount="classroom.numberOfComputers"/>
            </div>
        </el-card>
    </router-link>
</template>

<style lang="sass" scoped>
    .row
        display: flex
        flex-direction: row
        justify-content: space-between
        .aligner
            align-self: center
    .column
        display: flex
        flex-direction: column
        .centered
            justify-content: center
    .clickable
        cursor: pointer
    .box-card
        & ::v-deep .el-card__header
            padding: 7.5px 15px!important
</style>

<script>
    import { ClassroomCompCount, ClassroomName, ClassroomImage, } from '@/components/_common/classroom'
    import { mapActions } from 'vuex'

    export default {
        components: {
            ClassroomCompCount,
            ClassroomName,
            ClassroomImage,
        },
        props: {
            classroom: Object,
        },
        computed: {
            classroomLink() {
                return {
                    name: 'adminClassroomPage', 
                    params: {
                        classroomId: this.classroom.name
                    }, 
                }
            },
        },
        methods: {
            confirmDelete(e, classroomId) {
                e.stopImmediatePropagation()
                this.$confirm('Da li zelite da uklonite ucionicu?', {
                        cancelButtonText: 'Otkazi',
                        confirmButtonText: 'Obrisi',
                        customClass: 'message-box-reversed',
                    }
                ).then(() => {
                        this.deleteClassroom({ classroomId })
                            .then(()=> {
                                this.$message({
                                    type: 'success',
                                    message: 'Ucionica obrisana'
                                })
                                this.$emit('change')
                            }).catch((e)=>{
                                this.$message({
                                    type: 'error',
                                    message: `Brisanje neuspesno: ${e}`,
                                })
                            })
                        
                })
            },
            ...mapActions('Admin/Classroom/AllClassrooms', ['deleteClassroom'])
        },
    }
</script>