<template>
    <router-link :to="classroomLink" tag="div" class="clickable">
        <el-card class="box-card" shadow="hover">
            <template v-slot:header>
                <div>
                    <classroom-name :classroomName="classroom.name"/>
                </div>
            </template>
            <div class="column">
                <classroom-image :classroomImageUrl="classroom.imageUrl"/>
                <classroom-comp-count :classroomCompCount="classroom.numberOfComputers"/>
            </div>
        </el-card>
    </router-link>
</template>

<style lang="sass" scoped>
    .column
        display: flex
        flex-direction: column
    .clickable
        cursor: pointer
    .box-card
        & ::v-deep .el-card__header
            padding: 7.5px 15px!important
</style>

<script>
    import { ClassroomCompCount, ClassroomName, ClassroomImage, } from '@/components/_common/classroom'
    import { Card } from 'element-ui'

    export default {
        components: {
            ClassroomCompCount,
            ClassroomName,
            ClassroomImage,
            ElCard: Card,
        },
        props: {
            classroom: Object,
        },
        computed: {
            classroomLink() {
                return {
                    name: 'classroomPage', 
                    params: {
                        classroomId: this.classroom.name
                    }, 
                }
            },
        },
    }
</script>