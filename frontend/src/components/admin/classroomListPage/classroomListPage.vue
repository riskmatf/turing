<template>
    <div>
        <page-header>
            <breadcrumbs :paths="breadcrumbData" class="breadcrumbs"/>
        </page-header>
        <div class="location-container">
            <el-collapse 
                v-for="(classrooms, location) in classroomData"
                :key="location"
                class="collapse"
            >
                <el-collapse-item :title="location">
                    <classroom-grid :classroomList="classrooms" class="classroom-grid"> 
                        <template v-slot="{ classroom }">
                            <classroom :classroom="classroom" class="classroom" :key="classroom.name"/>
                        </template>
                    </classroom-grid>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>

<style lang="sass" scoped>
    @import "./src/assets/styles/breakPoints"
    
    .breadcrumbs
        margin-top: 5px
        margin-bottom: 5px
        margin-left: 2px
    .location-container
        display: flex
        flex-direction: column
        align-content: center
        margin-top: 5px
        .collapse
            width: 77%
            padding-left: 10px
            padding-bottom: 5px
            align-self: center
            .classroom-grid
                padding-left: 10px
                justify-content: center
            .classroom
                width: 30%
                margin-right: 10px
                margin-top: 10px
                @media ($mobileBreakPoint)
                    width: 95%
                @media ($middleScreenBreakPoint)
                    width: 45%
        .el-collapse-item__header
            padding-left: 15px
            font-size: 14px
            font-weight: bold
</style>

<script>
    import Breadcrumbs from '@/components/_common/breadcrumbs/breadcrumbs'
    import ClassroomGrid from '@/components/_common/classroomGrid'
    import PageHeader from '@/components/_common/pageHeader'
    import Classroom from './classroom'

    export default {
        components: {
            Breadcrumbs,
            ClassroomGrid,
            PageHeader,
            Classroom,
        },
        computed: {
            breadcrumbData() {
                return [
                        { name: 'pocetna', to: {name: 'adminHomePage'}},
                        { name: 'ucionice', to: { name: 'adminClassroomListPage' } }
                       ]
            },
            classroomData() {
                return  {"Trg":[
                    {
                        "name":"704",
                        "location":"Trg",
                        "numberOfComputers":{"working":16,"broken":0},
                        "imageUrl":"http://localhost:3000/static/images/704.jpg",
                        "schemaUrl":"http://localhost:3000/static/schemas/704.svg"
                    },
                    {
                        "name":"718",
                        "location":"Trg",
                        "numberOfComputers":{"working":21,"broken":0},
                        "imageUrl":"http://localhost:3000/static/images/718.jpg",
                        "schemaUrl":"http://localhost:3000/static/schemas/718.svg"
                    },
                    {
                        "name":"bim",
                        "location":"Trg",
                        "numberOfComputers":{"working":21,"broken":0},
                        "imageUrl":"http://localhost:3000/static/images/bim.jpg",
                        "schemaUrl":"http://localhost:3000/static/schemas/bim.svg"
                    },
                    {
                        "name":"dlab",
                        "location":"Trg",
                        "numberOfComputers":{"working":11,"broken":0},
                        "imageUrl":"http://localhost:3000/static/images/dlab.jpg",
                        "schemaUrl":"http://localhost:3000/static/schemas/dlab.svg"
                    },
                ]}
            }
        },
    }
</script>